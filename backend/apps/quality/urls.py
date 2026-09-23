from rest_framework.routers import DefaultRouter

from .views import QualityDailyReportViewSet, QualityScoreViewSet

app_name = "quality"

router = DefaultRouter()
router.register("scores", QualityScoreViewSet, basename="quality-score")
router.register("reports", QualityDailyReportViewSet, basename="quality-report")

urlpatterns = router.urls
