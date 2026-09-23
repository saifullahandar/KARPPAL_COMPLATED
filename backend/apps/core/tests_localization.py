"""Tests for three-language (English / Dari / Pashto) dashboard-managed content,
public read access, and the session-cookie hardening."""
import atexit
import shutil
import tempfile

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.core.i18n import get_request_language, normalize_language
from apps.core.models import Feature, HeroSlide
from apps.gallery.models import GalleryCategory, GalleryItem
from apps.jobs.models import JobPosting
from apps.products.models import Category, Product
from apps.research.models import ResearchArticle, ResearchCategory
from apps.services.models import Service

# Uploads made by these tests go to a throw-away directory instead of the real MEDIA_ROOT.
TEMP_MEDIA = tempfile.mkdtemp(prefix="karppal-test-media-")
atexit.register(shutil.rmtree, TEMP_MEDIA, ignore_errors=True)
temp_media = override_settings(MEDIA_ROOT=TEMP_MEDIA)

TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def tiny_image(name="t.gif"):
    return SimpleUploadedFile(name, TINY_GIF, content_type="image/gif")


@temp_media
class LanguageResolutionTests(TestCase):
    def test_normalize_language(self):
        self.assertEqual(normalize_language("fa-AF"), "fa")
        self.assertEqual(normalize_language("PS"), "ps")
        self.assertEqual(normalize_language("en_US"), "en")
        self.assertIsNone(normalize_language("de"))
        self.assertIsNone(normalize_language(""))

    def test_query_param_beats_header_and_unsupported_falls_back_to_english(self):
        from django.test import RequestFactory

        rf = RequestFactory()
        self.assertEqual(get_request_language(rf.get("/x/?lang=ps", HTTP_ACCEPT_LANGUAGE="fa")), "ps")
        self.assertEqual(get_request_language(rf.get("/x/", HTTP_ACCEPT_LANGUAGE="de,fa-AF;q=0.8,en;q=0.5")), "fa")
        self.assertEqual(get_request_language(rf.get("/x/?lang=de")), "en")
        self.assertEqual(get_request_language(rf.get("/x/")), "en")


@temp_media
class PublicLocalizedContentTests(APITestCase):
    """Anonymous visitors read every public content type in the selected language."""

    def setUp(self):
        cat = Category.objects.create(
            name="Feed", name_fa="خوراک", name_ps="خوراک پښتو",
            description="Animal feed", description_fa="خوراک حیوانات", description_ps="د څارویو خوراک",
        )
        self.product = Product.objects.create(
            category=cat, image=tiny_image(),
            name="Animal Feed", name_fa="خوراک حیوانات", name_ps="د څارویو خوراک",
            short_description="High-quality", short_description_fa="با کیفیت", short_description_ps="لوړ کیفیت",
            description="EN body", description_fa="متن دری", description_ps="پښتو متن",
            tag1="Feed", tag1_fa="خوراک", tag1_ps="خوراک",
        )
        gcat = GalleryCategory.objects.create(name="Farm", name_fa="فارم", name_ps="فارم پښتو")
        GalleryItem.objects.create(
            category=gcat, image=tiny_image("g.gif"),
            title="Farm photo", title_fa="عکس فارم", title_ps="د فارم انځور",
            description="EN desc", description_fa="توضیح دری", description_ps="پښتو توضیح",
        )
        Service.objects.create(
            name="Consulting", name_fa="مشاوره", name_ps="مشوره",
            short_description="Advice", short_description_fa="راهنمایی", short_description_ps="لارښوونه",
        )
        rcat = ResearchCategory.objects.create(name="Dairy", name_fa="لبنیات", name_ps="لبنیات پښتو")
        self.article = ResearchArticle.objects.create(
            category=rcat, featured_image=tiny_image("r.gif"),
            title="Milk study", title_fa="مطالعه شیر", title_ps="د شیدو څیړنه",
            excerpt="EN excerpt", excerpt_fa="خلاصه", excerpt_ps="لنډیز",
            content="EN content", content_fa="محتوای دری", content_ps="پښتو منځپانګه",
        )
        JobPosting.objects.create(
            title="Driver", title_fa="راننده", title_ps="چلوونکی",
            location="Kabul", location_fa="کابل", location_ps="کابل پښتو",
            tags="Kabul, 3+ years", tags_fa="کابل, ۳ سال", tags_ps="کابل, ۳ کاله",
            description="EN d", description_fa="دری d", description_ps="پښتو d",
            requirements="EN r", requirements_fa="دری r", requirements_ps="پښتو r",
        )
        HeroSlide.objects.create(
            image=tiny_image("h.gif"), title="Hero", title_fa="قهرمان", title_ps="اتل",
            subtitle="Sub", subtitle_fa="زیر", subtitle_ps="سب", cta_text="Go", cta_text_fa="برو", cta_text_ps="ځه",
        )
        Feature.objects.create(title="Fast", title_fa="سریع", title_ps="ګړندی", text="T", text_fa="ت", text_ps="ټ")

    def get(self, url, lang=None, **extra):
        return self.client.get(url + (f"?lang={lang}" if lang else ""), **extra)

    def first(self, response):
        data = response.json()
        return data["results"][0] if isinstance(data, dict) and "results" in data else data[0]

    def test_products_follow_selected_language(self):
        for lang, name, cat_name in [
            ("en", "Animal Feed", "Feed"), ("fa", "خوراک حیوانات", "خوراک"), ("ps", "د څارویو خوراک", "خوراک پښتو"),
        ]:
            item = self.first(self.get("/api/v1/products/", lang))
            self.assertEqual(item["name"], name)
            self.assertEqual(item["category_name"], cat_name)

    def test_product_detail_localizes_nested_category_and_text(self):
        data = self.get(f"/api/v1/products/{self.product.slug}/", "fa").json()
        self.assertEqual(data["name"], "خوراک حیوانات")
        self.assertEqual(data["description"], "متن دری")
        self.assertEqual(data["short_description"], "با کیفیت")
        self.assertEqual(data["category"]["name"], "خوراک")
        self.assertEqual(data["tag1"], "خوراک")

    def test_translation_columns_are_not_leaked_in_public_output(self):
        item = self.first(self.get("/api/v1/products/", "fa"))
        self.assertFalse([k for k in item if k.endswith(("_fa", "_ps"))])

    def test_gallery_services_research_jobs_hero_features_localize(self):
        cases = [
            ("/api/v1/gallery/", "title", {"en": "Farm photo", "fa": "عکس فارم", "ps": "د فارم انځور"}),
            ("/api/v1/services/", "name", {"en": "Consulting", "fa": "مشاوره", "ps": "مشوره"}),
            ("/api/v1/research/", "title", {"en": "Milk study", "fa": "مطالعه شیر", "ps": "د شیدو څیړنه"}),
            ("/api/v1/research/", "category_name", {"en": "Dairy", "fa": "لبنیات", "ps": "لبنیات پښتو"}),
            ("/api/v1/jobs/postings/", "title", {"en": "Driver", "fa": "راننده", "ps": "چلوونکی"}),
            ("/api/v1/jobs/postings/", "location", {"en": "Kabul", "fa": "کابل", "ps": "کابل پښتو"}),
            ("/api/v1/core/hero-slides/", "cta_text", {"en": "Go", "fa": "برو", "ps": "ځه"}),
            ("/api/v1/core/features/", "title", {"en": "Fast", "fa": "سریع", "ps": "ګړندی"}),
        ]
        for url, field, expected in cases:
            for lang, value in expected.items():
                self.assertEqual(self.first(self.get(url, lang))[field], value, (url, field, lang))

    def test_gallery_item_category_object_is_localized(self):
        self.assertEqual(self.first(self.get("/api/v1/gallery/", "ps"))["category"]["name"], "فارم پښتو")

    def test_research_detail_content_is_localized(self):
        detail = self.get(f"/api/v1/research/{self.article.slug}/", "ps").json()
        self.assertEqual(detail["content"], "پښتو منځپانګه")
        self.assertEqual(detail["excerpt"], "لنډیز")

    def test_job_tag_list_follows_language(self):
        item = self.first(self.get("/api/v1/jobs/postings/", "fa"))
        self.assertEqual(item["tag_list"], ["کابل", "۳ سال"])
        self.assertEqual(self.first(self.get("/api/v1/jobs/postings/", "en"))["tag_list"], ["Kabul", "3+ years"])

    def test_accept_language_header_is_honoured_without_query_param(self):
        item = self.first(self.get("/api/v1/products/", HTTP_ACCEPT_LANGUAGE="ps-AF,ps;q=0.9,en;q=0.5"))
        self.assertEqual(item["name"], "د څارویو خوراک")

    def test_company_info_is_localized(self):
        from apps.core.models import CompanyInfo

        info = CompanyInfo.load()
        info.tagline, info.tagline_fa, info.tagline_ps = "Quality", "کیفیت", "کیفیت پښتو"
        info.save()
        self.assertEqual(self.get("/api/v1/core/company-info/", "fa").json()["tagline"], "کیفیت")

    def test_dari_search_finds_dari_only_text(self):
        results = self.get("/api/v1/products/?search=%D8%AE%D9%88%D8%B1%D8%A7%DA%A9", "fa").json()["results"]
        self.assertEqual(len(results), 1)


@temp_media
class FallbackTests(APITestCase):
    def test_missing_translation_falls_back_to_english_never_blank(self):
        cat = Category.objects.create(name="Dairy")
        Product.objects.create(category=cat, name="Milk", name_fa="شیر", image=tiny_image())
        item = self.client.get("/api/v1/products/?lang=ps").json()["results"][0]
        self.assertEqual(item["name"], "Milk")  # Pashto missing -> English
        self.assertEqual(item["category_name"], "Dairy")
        self.assertEqual(item["short_description"], "")  # nothing entered anywhere -> empty string, not null
        self.assertEqual(self.client.get("/api/v1/products/?lang=fa").json()["results"][0]["name"], "شیر")

    def test_english_blank_uses_any_available_language(self):
        Service.objects.create(name="", name_ps="خدمت")
        self.assertEqual(self.client.get("/api/v1/services/?lang=en").json()["results"][0]["name"], "خدمت")


@temp_media
class PublicAccessAndPermissionTests(APITestCase):
    """Anonymous = read-only on public content; every write stays protected."""

    PUBLIC_READS = [
        "/api/v1/products/", "/api/v1/products/categories/", "/api/v1/services/", "/api/v1/gallery/",
        "/api/v1/gallery/categories/", "/api/v1/research/", "/api/v1/research/categories/", "/api/v1/jobs/postings/",
        "/api/v1/core/company-info/", "/api/v1/core/hero-slides/", "/api/v1/core/statistics/", "/api/v1/core/features/",
    ]

    def test_anonymous_can_read_all_public_endpoints_in_every_language(self):
        for url in self.PUBLIC_READS:
            for lang in ("en", "fa", "ps"):
                self.assertEqual(self.client.get(f"{url}?lang={lang}").status_code, 200, (url, lang))

    def test_anonymous_cannot_write_public_content(self):
        cat = Category.objects.create(name="Dairy")
        product = Product.objects.create(category=cat, name="Milk", image=tiny_image())
        self.assertIn(self.client.post("/api/v1/products/", {"name": "x"}).status_code, (401, 403))
        self.assertIn(self.client.patch(f"/api/v1/products/{product.slug}/", {"name_fa": "x"}).status_code, (401, 403))
        self.assertIn(self.client.put(f"/api/v1/products/{product.slug}/", {"name": "x"}).status_code, (401, 403))
        self.assertIn(self.client.delete(f"/api/v1/products/{product.slug}/").status_code, (401, 403))
        product.refresh_from_db()
        self.assertEqual(product.name_fa, "")

    def test_internal_export_and_quality_data_stay_private(self):
        self.assertEqual(self.client.get("/api/v1/exports/").status_code, 401)
        self.assertEqual(self.client.get("/api/v1/quality/reports/").status_code, 401)

    def test_customer_cannot_write_but_staff_can_write_all_three_languages(self):
        cat = Category.objects.create(name="Dairy")
        customer = User.objects.create_user(email="c@t.af", password="Pass12345", role=User.Role.CUSTOMER)
        staff = User.objects.create_user(email="s@t.af", password="Pass12345", role=User.Role.STAFF)
        def payload():  # a fresh upload each time: a file object is consumed by the request that reads it
            return {
                "category_id": cat.pk, "name": "TEST EN Product", "name_fa": "TEST FA Product",
                "name_ps": "TEST PS Product", "image": tiny_image(),
            }

        self.client.force_authenticate(customer)
        self.assertEqual(self.client.post("/api/v1/products/", payload(), format="multipart").status_code, 403)
        self.client.force_authenticate(staff)
        response = self.client.post("/api/v1/products/", payload(), format="multipart")
        self.assertEqual(response.status_code, 201, response.content)
        product = Product.objects.get(name="TEST EN Product")
        self.assertEqual((product.name_fa, product.name_ps), ("TEST FA Product", "TEST PS Product"))


@temp_media
class DashboardThreeLanguageFormTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(email="staff@t.af", password="Pass12345", role=User.Role.STAFF)
        self.admin = User.objects.create_user(email="admin@t.af", password="Pass12345", role=User.Role.ADMIN)
        self.client.force_login(self.staff)

    def test_product_form_offers_english_dari_and_pashto_inputs(self):
        html = self.client.get("/dashboard/product/add/").content.decode()
        for label in ("Name (English)", "Name (Dari)", "Name (Pashto)", "Short description (Dari)", "Description (Pashto)"):
            self.assertIn(label, html)
        self.assertIn('name="name_fa"', html)
        self.assertIn('name="name_ps"', html)
        self.assertIn('dir="rtl"', html)

    def test_every_localized_module_form_has_three_language_inputs(self):
        for slug, field in [
            ("service", "name"), ("galleryitem", "title"), ("gallerycategory", "name"), ("researcharticle", "title"),
            ("researchcategory", "name"), ("jobposting", "title"), ("category", "name"), ("heroslide", "title"),
            ("feature", "title"), ("statistic", "label"), ("productimage", "alt_text"), ("productspecification", "key"),
        ]:
            html = self.client.get(f"/dashboard/{slug}/add/").content.decode()
            self.assertIn(f'name="{field}_fa"', html, slug)
            self.assertIn(f'name="{field}_ps"', html, slug)

    def test_staff_saves_three_languages_through_the_dashboard(self):
        cat = Category.objects.create(name="Dairy")
        response = self.client.post("/dashboard/product/add/", {
            "category": cat.pk, "name": "TEST EN Product", "name_fa": "TEST FA Product", "name_ps": "TEST PS Product",
            "short_description": "s", "description": "d", "currency": "AFN", "status": "active", "order": 0,
            "image": tiny_image("p.gif"),
        })
        self.assertEqual(response.status_code, 302, getattr(response, "context", None) and response.context["form"].errors)
        p = Product.objects.get(name="TEST EN Product")
        self.assertEqual((p.name_fa, p.name_ps), ("TEST FA Product", "TEST PS Product"))
        for lang, expected in [("en", "TEST EN Product"), ("fa", "TEST FA Product"), ("ps", "TEST PS Product")]:
            self.assertEqual(self.client.get(f"/api/v1/products/?lang={lang}").json()["results"][0]["name"], expected)

    def test_dari_and_pashto_are_optional_english_stays_required(self):
        cat = Category.objects.create(name="Dairy")
        ok = self.client.post("/dashboard/product/add/", {
            "category": cat.pk, "name": "Only English", "currency": "AFN", "status": "active", "order": 0,
            "image": tiny_image("p2.gif"),
        })
        self.assertEqual(ok.status_code, 302)
        bad = self.client.post("/dashboard/product/add/", {
            "category": cat.pk, "name": "", "name_fa": "فقط دری", "currency": "AFN", "status": "active", "order": 0,
            "image": tiny_image("p3.gif"),
        })
        self.assertEqual(bad.status_code, 200)  # form re-rendered with an error

    def test_company_info_form_has_three_languages_and_is_admin_only(self):
        self.assertEqual(self.client.get("/dashboard/settings/company-info/").status_code, 403)
        self.client.force_login(self.admin)
        html = self.client.get("/dashboard/settings/company-info/").content.decode()
        self.assertIn('name="mission_fa"', html)
        self.assertIn('name="address_ps"', html)

    def test_dashboard_search_matches_dari_text(self):
        cat = Category.objects.create(name="Dairy")
        Product.objects.create(category=cat, name="Milk", name_fa="شیر تازه", image=tiny_image())
        response = self.client.get("/dashboard/product/?q=%D8%B4%DB%8C%D8%B1")
        self.assertContains(response, "Milk")


@temp_media
class SessionCookieHardeningTests(TestCase):
    def test_cookie_names_are_project_specific(self):
        self.assertNotEqual(settings.SESSION_COOKIE_NAME, "sessionid")
        self.assertNotEqual(settings.CSRF_COOKIE_NAME, "csrftoken")

    def test_foreign_sessionid_cookie_does_not_log_the_dashboard_out(self):
        User.objects.create_user(email="staff@t.af", password="Pass12345", role=User.Role.STAFF)
        self.assertTrue(self.client.login(email="staff@t.af", password="Pass12345"))
        self.client.cookies["sessionid"] = "cookie-set-by-another-project-on-the-same-host"
        self.assertEqual(self.client.get("/dashboard/").status_code, 200)

    def test_logout_still_ends_the_session(self):
        User.objects.create_user(email="staff@t.af", password="Pass12345", role=User.Role.STAFF)
        self.client.login(email="staff@t.af", password="Pass12345")
        self.client.post("/dashboard/logout/")
        self.assertEqual(self.client.get("/dashboard/").status_code, 302)
