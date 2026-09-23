from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import PageView


def days_ago(n):
    return timezone.now() - timezone.timedelta(days=n)


class TrackPageViewTests(APITestCase):
    """Covers: public visit creates a record; bots/empty UA don't; validation;
    tracking never surfaces as a hard failure to the caller."""

    def test_public_page_visit_creates_analytics_record(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"path": "/research", "referrer": "", "visitor_id": "visitor-a"},
            HTTP_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PageView.objects.count(), 1)
        record = PageView.objects.first()
        self.assertEqual(record.path, "/research")
        self.assertEqual(record.visitor_id, "visitor-a")
        self.assertEqual(record.device_category, "desktop")
        self.assertEqual(record.browser_category, "chrome")

    def test_bot_user_agent_does_not_create_record(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"path": "/", "visitor_id": "bot-visitor"},
            HTTP_USER_AGENT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        )
        # Still a clean 204 — the frontend never needs to know a beacon was dropped.
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PageView.objects.count(), 0)

    def test_missing_user_agent_does_not_create_record(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"path": "/", "visitor_id": "no-ua-visitor"},
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PageView.objects.count(), 0)

    def test_missing_path_is_rejected(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"visitor_id": "visitor-a"},
            HTTP_USER_AGENT="Mozilla/5.0 Chrome/120.0",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PageView.objects.count(), 0)

    def test_path_not_starting_with_slash_is_rejected(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"path": "research", "visitor_id": "visitor-a"},
            HTTP_USER_AGENT="Mozilla/5.0 Chrome/120.0",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PageView.objects.count(), 0)

    def test_other_api_requests_never_create_page_view_rows(self):
        """A request to an unrelated public endpoint must not be silently
        tracked — only the dedicated /analytics/track/ beacon creates rows."""
        self.client.get(reverse("research:research-article-list"))
        self.client.get(reverse("gallery:gallery-item-list"))
        self.assertEqual(PageView.objects.count(), 0)

    def test_same_visitor_repeated_views_is_one_unique_visitor_many_page_views(self):
        for _ in range(3):
            self.client.post(
                reverse("analytics:track"),
                {"path": "/", "visitor_id": "repeat-visitor"},
                HTTP_USER_AGENT="Mozilla/5.0 Chrome/120.0",
            )
        self.assertEqual(PageView.objects.count(), 3)
        self.assertEqual(PageView.objects.values("visitor_id").distinct().count(), 1)

    def test_different_visitors_are_counted_separately(self):
        for visitor in ["visitor-1", "visitor-2", "visitor-3"]:
            self.client.post(
                reverse("analytics:track"),
                {"path": "/", "visitor_id": visitor},
                HTTP_USER_AGENT="Mozilla/5.0 Chrome/120.0",
            )
        self.assertEqual(PageView.objects.values("visitor_id").distinct().count(), 3)


class AnalyticsPermissionTests(APITestCase):
    """Covers: dashboard analytics endpoints require staff auth; anonymous and
    plain-customer users are rejected; staff are accepted."""

    def setUp(self):
        self.customer = User.objects.create_user(email="customer@example.com", password="pass12345")
        self.staff = User.objects.create_user(email="staff@example.com", password="pass12345", role=User.Role.STAFF)

    def test_anonymous_cannot_access_overview(self):
        response = self.client.get(reverse("analytics:overview"))
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_customer_cannot_access_overview(self):
        self.client.force_authenticate(self.customer)
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_access_overview(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_cannot_access_trend(self):
        response = self.client.get(reverse("analytics:trend"))
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_track_endpoint_is_public(self):
        response = self.client.post(
            reverse("analytics:track"),
            {"path": "/", "visitor_id": "anon"},
            HTTP_USER_AGENT="Mozilla/5.0 Chrome/120.0",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class AnalyticsOverviewAccuracyTests(APITestCase):
    """Covers: today/yesterday/7-day/30-day/total counts and date boundaries,
    using deterministic backdated rows rather than relying on real time."""

    def setUp(self):
        self.staff = User.objects.create_user(email="staff@example.com", password="pass12345", role=User.Role.STAFF)
        self.client.force_authenticate(self.staff)

        # Today: 2 visitors, 3 page views.
        PageView.objects.create(visitor_id="today-1", path="/", created_at=days_ago(0))
        PageView.objects.create(visitor_id="today-1", path="/products", created_at=days_ago(0))
        PageView.objects.create(visitor_id="today-2", path="/", created_at=days_ago(0))

        # Yesterday: 1 visitor.
        PageView.objects.create(visitor_id="yesterday-1", path="/", created_at=days_ago(1))

        # 5 days ago: 1 visitor (inside the 7-day window, outside today/yesterday).
        PageView.objects.create(visitor_id="week-1", path="/", created_at=days_ago(5))

        # 20 days ago: 1 visitor (inside the 30-day window, outside the 7-day window).
        PageView.objects.create(visitor_id="month-1", path="/", created_at=days_ago(20))

        # 40 days ago: 1 visitor (outside every window — must not be counted anywhere but total).
        PageView.objects.create(visitor_id="old-1", path="/", created_at=days_ago(40))

    def test_today_visitor_and_page_view_counts(self):
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.data["today_visitors"], 2)
        self.assertEqual(response.data["today_page_views"], 3)

    def test_yesterday_visitor_count(self):
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.data["yesterday_visitors"], 1)

    def test_last_7_days_includes_today_yesterday_and_5_days_ago_only(self):
        response = self.client.get(reverse("analytics:overview"))
        # today (2) + yesterday (1) + 5-days-ago (1) = 4; month-1/old-1 excluded.
        self.assertEqual(response.data["last_7_days_visitors"], 4)

    def test_last_30_days_excludes_the_40_day_old_row(self):
        response = self.client.get(reverse("analytics:overview"))
        # everything except old-1 (40 days ago) = 5 unique visitors.
        self.assertEqual(response.data["last_30_days_visitors"], 5)

    def test_total_visitors_includes_every_row_regardless_of_age(self):
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.data["total_visitors"], 6)

    def test_total_page_views_counts_every_row(self):
        response = self.client.get(reverse("analytics:overview"))
        self.assertEqual(response.data["total_page_views"], PageView.objects.count())
        self.assertEqual(response.data["total_page_views"], 7)


class AnalyticsTrendTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user(email="staff@example.com", password="pass12345", role=User.Role.STAFF)
        self.client.force_authenticate(self.staff)

        PageView.objects.create(visitor_id="a", path="/", created_at=days_ago(0))
        PageView.objects.create(visitor_id="b", path="/", created_at=days_ago(0))
        PageView.objects.create(visitor_id="a", path="/products", created_at=days_ago(2))

    def test_trend_returns_one_bucket_per_day_with_zero_fill(self):
        response = self.client.get(reverse("analytics:trend"), {"days": 7})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 7)

        by_date = {row["date"]: row for row in response.data["results"]}
        today_key = timezone.localdate().isoformat()
        two_days_ago_key = (timezone.localdate() - timezone.timedelta(days=2)).isoformat()
        one_day_ago_key = (timezone.localdate() - timezone.timedelta(days=1)).isoformat()

        self.assertEqual(by_date[today_key]["visitors"], 2)
        self.assertEqual(by_date[today_key]["page_views"], 2)
        self.assertEqual(by_date[two_days_ago_key]["visitors"], 1)
        # A day with no visits at all must zero-fill, not be omitted.
        self.assertEqual(by_date[one_day_ago_key]["visitors"], 0)
        self.assertEqual(by_date[one_day_ago_key]["page_views"], 0)

    def test_trend_days_parameter_is_clamped_to_a_sane_range(self):
        response = self.client.get(reverse("analytics:trend"), {"days": 5000})
        self.assertEqual(response.data["days"], 90)
        self.assertEqual(len(response.data["results"]), 90)
