from django.db import models
from django.utils import timezone


class PageView(models.Model):
    """One row per tracked public-page view on the React site.

    Privacy design: this table deliberately never stores IP addresses or any
    other directly-identifying data. `visitor_id` is a random identifier the
    frontend generates once with `crypto.randomUUID()` and keeps in the
    browser's localStorage (see frontend/src/services/analytics.ts) — it
    identifies a browser/device, not a person, and carries no personal
    information. If local storage is unavailable, tracking simply degrades
    (a fresh id per page load) rather than falling back to anything
    IP-based.

    Counting rules (see FINAL_QA_2_REPORT.md for the full write-up):
      - "page views" for a period = row count (`PageView.objects.filter(...).count()`).
      - "unique visitors" for a period = distinct `visitor_id` values among
        rows in that period (`.values("visitor_id").distinct().count()`),
        NOT the row count — the same visitor loading 5 pages today is 1
        unique visitor and 5 page views.
      - "today"/"yesterday" are calculated in the project's configured
        TIME_ZONE (Asia/Kabul), via `django.utils.timezone.localdate()`,
        not UTC.
    """

    visitor_id = models.CharField(max_length=64, db_index=True)
    path = models.CharField(max_length=255, db_index=True)
    referrer = models.CharField(max_length=500, blank=True)
    device_category = models.CharField(max_length=20, blank=True)
    browser_category = models.CharField(max_length=20, blank=True)

    # `default=timezone.now` (not auto_now_add) so tests can deterministically
    # backdate rows to exercise "yesterday" / "last 7 days" / "last 30 days"
    # boundaries without waiting on real wall-clock time.
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    # Local calendar date derived from created_at, kept as its own indexed
    # column purely so "today"/"last N days" queries can filter on a plain
    # DateField equality/range instead of doing a per-row TZ conversion in
    # the database on every query.
    date = models.DateField(db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["date", "visitor_id"]),
            models.Index(fields=["date", "path"]),
        ]

    def __str__(self):
        return f"{self.path} @ {self.created_at:%Y-%m-%d %H:%M}"

    def save(self, *args, **kwargs):
        self.date = timezone.localtime(self.created_at).date()
        super().save(*args, **kwargs)
