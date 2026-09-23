from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet

app_name = "contact"

router = DefaultRouter()
router.register("messages", ContactMessageViewSet, basename="contact-message")

urlpatterns = router.urls
