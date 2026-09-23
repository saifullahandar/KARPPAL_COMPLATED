from rest_framework.routers import DefaultRouter

from .views import ExportShipmentViewSet

app_name = "exports"

router = DefaultRouter()
router.register("", ExportShipmentViewSet, basename="export-shipment")

urlpatterns = router.urls
