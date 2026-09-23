from rest_framework import serializers

from .models import QualityDailyReport, QualityScore


class QualityScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityScore
        fields = ["id", "report", "score_type", "label", "percentage", "order"]


class QualityDailyReportSerializer(serializers.ModelSerializer):
    scores = QualityScoreSerializer(many=True, read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = QualityDailyReport
        fields = [
            "id", "date", "samples_count", "in_review_count", "issues_count",
            "approved_count", "rejected_count", "avg_review_hours", "acceptance_rate",
            "notes", "scores", "created_at",
        ]
