from django.contrib import admin

from .models import QualityDailyReport, QualityScore


class QualityScoreInline(admin.TabularInline):
    model = QualityScore
    extra = 1


@admin.register(QualityDailyReport)
class QualityDailyReportAdmin(admin.ModelAdmin):
    list_display = ["date", "samples_count", "approved_count", "rejected_count", "acceptance_rate"]
    inlines = [QualityScoreInline]
    date_hierarchy = "date"
