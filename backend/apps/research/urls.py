from rest_framework.routers import DefaultRouter

from .views import ResearchArticleViewSet, ResearchCategoryViewSet

app_name = "research"

router = DefaultRouter()
router.register("categories", ResearchCategoryViewSet, basename="research-category")
router.register("", ResearchArticleViewSet, basename="research-article")

urlpatterns = router.urls
