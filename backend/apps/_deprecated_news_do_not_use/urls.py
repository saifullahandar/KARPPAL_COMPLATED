from rest_framework.routers import DefaultRouter

from .views import NewsArticleViewSet, NewsCategoryViewSet

app_name = "news"

router = DefaultRouter()
router.register("categories", NewsCategoryViewSet, basename="news-category")
router.register("", NewsArticleViewSet, basename="news-article")

urlpatterns = router.urls
