from django.db import models
from django.utils import timezone

from apps.core.models import TimeStampedModel


class QualityDailyReport(TimeStampedModel):
    """One scorecard per day for the internal quality-control dashboard."""

    date = models.DateField(default=timezone.localdate, unique=True)
    samples_count = models.PositiveIntegerField(default=0)
    in_review_count = models.PositiveIntegerField(default=0)
    issues_count = models.PositiveIntegerField(default=0)
    approved_count = models.PositiveIntegerField(default=0)
    rejected_count = models.PositiveIntegerField(default=0)
    avg_review_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"Quality report — {self.date}"

    @property
    def acceptance_rate(self):
        total = self.approved_count + self.rejected_count
        if not total:
            return 0
        return round(self.approved_count / total * 100, 1)


class QualityScore(TimeStampedModel):
    """A single scored line item (e.g. 'Color & Coating' 98%) attached to a daily report."""

    class ScoreType(models.TextChoices):
        CHECK = "check", "Quality Check"
        SECTION = "section", "Production Section"

    report = models.ForeignKey(QualityDailyReport, on_delete=models.CASCADE, related_name="scores")
    score_type = models.CharField(max_length=10, choices=ScoreType.choices, default=ScoreType.CHECK)
    label = models.CharField(max_length=120)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["score_type", "order", "id"]

    def __str__(self):
        return f"{self.label}: {self.percentage}%"
