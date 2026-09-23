import re

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.permissions import IsDashboardStaff

from . import services
from .models import PageView
from .serializers import AnalyticsOverviewSerializer, AnalyticsTrendSerializer, PageViewTrackSerializer

# Simple substring heuristic, not a full user-agent parser — good enough to
# filter out well-behaved crawlers/monitoring tools that identify themselves
# honestly in their User-Agent, which covers the overwhelming majority of
# non-human traffic without pulling in an external dependency.
BOT_USER_AGENT_PATTERN = re.compile(
    r"bot|spider|crawl|slurp|facebookexternalhit|bingpreview|headlesschrome|"
    r"python-requests|python-urllib|curl|wget|monitor|pingdom|uptimerobot",
    re.IGNORECASE,
)


def _device_category(user_agent: str) -> str:
    ua = user_agent.lower()
    if "tablet" in ua or "ipad" in ua:
        return "tablet"
    if "mobile" in ua or "android" in ua or "iphone" in ua:
        return "mobile"
    return "desktop"


def _browser_category(user_agent: str) -> str:
    ua = user_agent.lower()
    if "edg/" in ua:
        return "edge"
    if "chrome/" in ua and "chromium" not in ua:
        return "chrome"
    if "firefox/" in ua:
        return "firefox"
    if "safari/" in ua and "chrome/" not in ua:
        return "safari"
    return "other"


class TrackPageViewAPIView(APIView):
    """POST /api/v1/analytics/track/ — public beacon, called once per page
    view by the React site (see frontend/src/services/analytics.ts).

    Always responds 204 (even for a bot/empty user agent that we silently
    decline to record) so the frontend never has a reason to treat a
    tracking call as a failure — analytics must never affect the visible
    site. No IP address is read or stored anywhere in this view.
    """

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "analytics"

    @extend_schema(request=PageViewTrackSerializer, responses={204: None})
    def post(self, request):
        serializer = PageViewTrackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_agent = request.META.get("HTTP_USER_AGENT", "")
        if not user_agent or BOT_USER_AGENT_PATTERN.search(user_agent):
            return Response(status=status.HTTP_204_NO_CONTENT)

        PageView.objects.create(
            visitor_id=serializer.validated_data["visitor_id"],
            path=serializer.validated_data["path"],
            referrer=serializer.validated_data.get("referrer", "")[:500],
            device_category=_device_category(user_agent),
            browser_category=_browser_category(user_agent),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class AnalyticsOverviewAPIView(APIView):
    """GET /api/v1/analytics/overview/ — dashboard-staff only.

    Returns today/yesterday/7-day/30-day/total unique-visitor counts plus
    today's and total page-view counts, computed with DB aggregation
    (COUNT / COUNT DISTINCT) rather than loading rows into Python.
    """

    permission_classes = [IsDashboardStaff]

    @extend_schema(responses=AnalyticsOverviewSerializer)
    def get(self, request):
        return Response(services.get_overview())


class AnalyticsTrendAPIView(APIView):
    """GET /api/v1/analytics/trend/?days=7 (or 30) — dashboard-staff only.

    Returns one {date, visitors, page_views} bucket per day in the window,
    built from two aggregate queries (not one query per day, not a full
    table scan into Python) plus cheap zero-filling for days with no rows.
    """

    permission_classes = [IsDashboardStaff]

    @extend_schema(responses=AnalyticsTrendSerializer)
    def get(self, request):
        try:
            requested_days = int(request.query_params.get("days", 7))
        except (TypeError, ValueError):
            requested_days = 7

        days, results = services.get_trend(requested_days)
        for row in results:
            row["date"] = row["date"].isoformat()

        return Response({"days": days, "results": results})
