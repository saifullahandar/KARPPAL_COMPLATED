from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaff

from .models import QualityDailyReport, QualityScore
from .serializers import QualityDailyReportSerializer, QualityScoreSerializer


class QualityDailyReportViewSet(viewsets.ModelViewSet):
    """/api/v1/quality/reports/ — internal QC scorecards, staff-only."""

    serializer_class = QualityDailyReportSerializer
    permission_classes = [IsDashboardStaff]
    queryset = QualityDailyReport.objects.prefetch_related("scores")
    ordering_fields = ["date"]


class QualityScoreViewSet(viewsets.ModelViewSet):
    serializer_class = QualityScoreSerializer
    permission_classes = [IsDashboardStaff]
    queryset = QualityScore.objects.all()
    filterset_fields = ["report", "score_type"]
