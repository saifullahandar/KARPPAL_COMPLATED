"""Shared aggregation logic for visitor analytics — used by both the
dashboard-only REST endpoints (views.py) and the server-rendered dashboard
page (dashboard/views.py), so the counting rules live in exactly one place.
"""
from django.db.models import Count
from django.utils import timezone

from .models import PageView


def _unique_visitors(queryset):
    return queryset.values("visitor_id").distinct().count()


def get_overview():
    today = timezone.localdate()
    yesterday = today - timezone.timedelta(days=1)
    last_7_start = today - timezone.timedelta(days=6)
    last_30_start = today - timezone.timedelta(days=29)

    qs = PageView.objects.all()

    return {
        "today_visitors": _unique_visitors(qs.filter(date=today)),
        "yesterday_visitors": _unique_visitors(qs.filter(date=yesterday)),
        "last_7_days_visitors": _unique_visitors(qs.filter(date__gte=last_7_start, date__lte=today)),
        "last_30_days_visitors": _unique_visitors(qs.filter(date__gte=last_30_start, date__lte=today)),
        "total_visitors": _unique_visitors(qs),
        "today_page_views": qs.filter(date=today).count(),
        "total_page_views": qs.count(),
    }


def get_trend(days=7):
    days = min(max(int(days), 1), 90)

    today = timezone.localdate()
    start = today - timezone.timedelta(days=days - 1)
    qs = PageView.objects.filter(date__gte=start, date__lte=today)

    page_views_by_date = dict(
        qs.values("date").annotate(count=Count("id")).values_list("date", "count")
    )
    visitors_by_date = dict(
        qs.values("date").annotate(count=Count("visitor_id", distinct=True)).values_list("date", "count")
    )

    results = []
    for offset in range(days):
        day = start + timezone.timedelta(days=offset)
        results.append({
            "date": day,
            "visitors": visitors_by_date.get(day, 0),
            "page_views": page_views_by_date.get(day, 0),
        })
    return days, results
