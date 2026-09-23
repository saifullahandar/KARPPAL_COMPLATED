from rest_framework.routers import DefaultRouter

from .views import JobApplicationViewSet, JobPostingViewSet

app_name = "jobs"

router = DefaultRouter()
router.register("postings", JobPostingViewSet, basename="job-posting")
router.register("applications", JobApplicationViewSet, basename="job-application")

urlpatterns = router.urls
