from rest_framework.routers import DefaultRouter

from .views import GalleryCategoryViewSet, GalleryItemViewSet

app_name = "gallery"

router = DefaultRouter()
router.register("categories", GalleryCategoryViewSet, basename="gallery-category")
router.register("", GalleryItemViewSet, basename="gallery-item")

urlpatterns = router.urls
