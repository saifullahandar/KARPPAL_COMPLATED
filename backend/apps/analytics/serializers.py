from rest_framework import serializers


class AnalyticsOverviewSerializer(serializers.Serializer):
    """Response shape for GET /api/v1/analytics/overview/ — also doubles as
    the OpenAPI schema hint for drf-spectacular, since AnalyticsOverviewAPIView
    is a plain APIView (its response isn't backed by a queryset/model)."""

    today_visitors = serializers.IntegerField()
    yesterday_visitors = serializers.IntegerField()
    last_7_days_visitors = serializers.IntegerField()
    last_30_days_visitors = serializers.IntegerField()
    total_visitors = serializers.IntegerField()
    today_page_views = serializers.IntegerField()
    total_page_views = serializers.IntegerField()


class AnalyticsTrendPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    visitors = serializers.IntegerField()
    page_views = serializers.IntegerField()


class AnalyticsTrendSerializer(serializers.Serializer):
    days = serializers.IntegerField()
    results = AnalyticsTrendPointSerializer(many=True)


class PageViewTrackSerializer(serializers.Serializer):
    """Validates an incoming public page-view beacon.

    Deliberately a plain Serializer, not a ModelSerializer — device/browser
    category and the calendar `date` are derived server-side from the request
    (see views.py), never accepted from the client.
    """

    path = serializers.CharField(max_length=255)
    referrer = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")
    visitor_id = serializers.CharField(max_length=64, min_length=1)

    def validate_path(self, value):
        if not value.startswith("/"):
            raise serializers.ValidationError("path must be a relative site path starting with '/'.")
        return value
