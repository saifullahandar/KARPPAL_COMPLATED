from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone

from apps.accounts.models import User
from apps.analytics.models import PageView
from apps.gallery.models import GalleryCategory
from apps.products.models import Category, Product
from apps.research.models import ResearchArticle, ResearchCategory

TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def tiny_image():
    return SimpleUploadedFile("test.gif", TINY_GIF, content_type="image/gif")


class DashboardAccessTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(email="customer@test.af", password="Pass12345", role=User.Role.CUSTOMER)
        self.staff = User.objects.create_user(email="staff@test.af", password="Pass12345", role=User.Role.STAFF)
        self.admin = User.objects.create_user(email="admin@test.af", password="Pass12345", role=User.Role.ADMIN)
        self.super_admin = User.objects.create_user(email="super@test.af", password="Pass12345", role=User.Role.SUPER_ADMIN)

    def test_anonymous_is_redirected_to_login(self):
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 302)

    def test_customer_cannot_reach_dashboard(self):
        self.client.force_login(self.customer)
        response = self.client.get("/dashboard/")
        self.assertEqual(response.status_code, 403)

    def test_staff_can_reach_dashboard_home_and_content_modules(self):
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get("/dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/dashboard/product/").status_code, 200)

    def test_staff_cannot_manage_users_or_settings(self):
        self.client.force_login(self.staff)
        self.assertEqual(self.client.get("/dashboard/user/").status_code, 403)
        self.assertEqual(self.client.get("/dashboard/user/add/").status_code, 403)
        self.assertEqual(self.client.get("/dashboard/settings/company-info/").status_code, 403)

    def test_admin_can_manage_users_but_not_grant_super_admin(self):
        self.client.force_login(self.admin)
        self.assertEqual(self.client.get("/dashboard/user/").status_code, 200)
        response = self.client.get("/dashboard/user/add/")
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, 'value="super_admin"')

    def test_super_admin_can_grant_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/dashboard/user/add/")
        self.assertContains(response, 'value="super_admin"')


class DashboardCrudTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(email="admin@test.af", password="Pass12345", role=User.Role.ADMIN)
        self.client.force_login(self.admin)

    def test_delete_view_actually_deletes_an_unreferenced_record(self):
        category = GalleryCategory.objects.create(name="Temp")
        response = self.client.post(f"/dashboard/gallerycategory/{category.pk}/delete/", follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(GalleryCategory.objects.filter(pk=category.pk).exists())

    def test_delete_view_blocks_protected_records_with_friendly_message(self):
        category = Category.objects.create(name="Dairy")
        Product.objects.create(category=category, name="Milk", image=tiny_image())

        response = self.client.post(f"/dashboard/category/{category.pk}/delete/", follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(Category.objects.filter(pk=category.pk).exists())
        self.assertContains(response, "Cannot delete")

    def test_create_and_edit_flow(self):
        category = Category.objects.create(name="Dairy")
        response = self.client.post("/dashboard/product/add/", {
            "category": category.pk, "name": "Yogurt", "image": tiny_image(),
            "currency": "AFN", "status": "active", "order": 0,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        product = Product.objects.get(name="Yogurt")

        response = self.client.post(f"/dashboard/product/{product.pk}/edit/", {
            "category": category.pk, "name": "Yogurt Updated", "image": tiny_image(),
            "currency": "AFN", "status": "active", "order": 0,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        product.refresh_from_db()
        self.assertEqual(product.name, "Yogurt Updated")


class ResearchDashboardCrudTests(TestCase):
    """Dashboard-side regression coverage for Research CRUD (complements the
    browser-driven QA pass described in FINAL_QA_2_REPORT.md)."""

    def setUp(self):
        self.staff = User.objects.create_user(email="staff@test.af", password="Pass12345", role=User.Role.STAFF)
        self.client.force_login(self.staff)

    def test_research_category_crud(self):
        response = self.client.post("/dashboard/researchcategory/add/", {"name": "Dairy Science", "order": 1, "active": True}, follow=True)
        self.assertEqual(response.status_code, 200)
        category = ResearchCategory.objects.get(name="Dairy Science")

        response = self.client.get("/dashboard/researchcategory/")
        self.assertContains(response, "Dairy Science")

        response = self.client.post(f"/dashboard/researchcategory/{category.pk}/edit/", {"name": "Dairy Science Updated", "order": 1, "active": True}, follow=True)
        self.assertEqual(response.status_code, 200)
        category.refresh_from_db()
        self.assertEqual(category.name, "Dairy Science Updated")

        response = self.client.post(f"/dashboard/researchcategory/{category.pk}/delete/", follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(ResearchCategory.objects.filter(pk=category.pk).exists())

    def test_research_article_create_publish_and_feature(self):
        category = ResearchCategory.objects.create(name="Livestock")
        response = self.client.post("/dashboard/researcharticle/add/", {
            "category": category.pk, "title": "Milk Yield Study", "excerpt": "Summary",
            "content": "Full findings.", "featured_image": tiny_image(),
            "featured": True, "published": True, "published_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "meta_title": "", "meta_description": "",
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        article = ResearchArticle.objects.get(title="Milk Yield Study")
        self.assertTrue(article.featured)
        self.assertTrue(article.published)

        response = self.client.post(f"/dashboard/researcharticle/{article.pk}/edit/", {
            "category": category.pk, "title": "Milk Yield Study", "excerpt": "Summary",
            "content": "Full findings.", "featured_image": tiny_image(),
            "featured": False, "published": False, "published_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "meta_title": "", "meta_description": "",
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        article.refresh_from_db()
        self.assertFalse(article.featured)
        self.assertFalse(article.published)

    def test_research_search_in_dashboard_list(self):
        ResearchArticle.objects.create(title="Findable Article", content="...", featured_image=tiny_image())
        ResearchArticle.objects.create(title="Other Article", content="...", featured_image=tiny_image())

        response = self.client.get("/dashboard/researcharticle/", {"q": "Findable"})
        self.assertContains(response, "Findable Article")
        self.assertNotContains(response, "Other Article")


class AnalyticsDashboardAccessTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(email="customer2@test.af", password="Pass12345", role=User.Role.CUSTOMER)
        self.staff = User.objects.create_user(email="staff2@test.af", password="Pass12345", role=User.Role.STAFF)

    def test_anonymous_is_redirected(self):
        response = self.client.get("/dashboard/analytics/")
        self.assertEqual(response.status_code, 302)

    def test_customer_cannot_access(self):
        self.client.force_login(self.customer)
        response = self.client.get("/dashboard/analytics/")
        self.assertEqual(response.status_code, 403)

    def test_staff_can_access_and_sees_real_counts(self):
        PageView.objects.create(visitor_id="v1", path="/", created_at=timezone.now())
        PageView.objects.create(visitor_id="v2", path="/research", created_at=timezone.now())

        self.client.force_login(self.staff)
        response = self.client.get("/dashboard/analytics/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Today's Visitors")
        self.assertContains(response, "<div class=\"stat-value\">2</div>")


class QualityOverviewAccessTests(TestCase):
    def setUp(self):
        self.customer = User.objects.create_user(email="customer3@test.af", password="Pass12345", role=User.Role.CUSTOMER)
        self.staff = User.objects.create_user(email="staff3@test.af", password="Pass12345", role=User.Role.STAFF)

    def test_anonymous_is_redirected(self):
        response = self.client.get("/dashboard/quality/")
        self.assertEqual(response.status_code, 302)

    def test_customer_cannot_access(self):
        self.client.force_login(self.customer)
        response = self.client.get("/dashboard/quality/")
        self.assertEqual(response.status_code, 403)

    def test_staff_sees_empty_state(self):
        self.client.force_login(self.staff)
        response = self.client.get("/dashboard/quality/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No quality reports yet.")

    def test_staff_sees_latest_report(self):
        from apps.quality.models import QualityDailyReport, QualityScore

        report = QualityDailyReport.objects.create(samples_count=128, approved_count=112, rejected_count=16)
        QualityScore.objects.create(report=report, score_type=QualityScore.ScoreType.CHECK, label="Color & Coating", percentage=98)
        QualityScore.objects.create(report=report, score_type=QualityScore.ScoreType.SECTION, label="Packaging", percentage=95)

        self.client.force_login(self.staff)
        response = self.client.get("/dashboard/quality/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "<div class=\"stat-value\">128</div>")
        self.assertContains(response, "87.5%")
        self.assertContains(response, "Color &amp; Coating")
        self.assertContains(response, "Packaging")
