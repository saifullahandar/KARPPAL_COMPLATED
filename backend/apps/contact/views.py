from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from apps.core.permissions import IsDashboardStaff

from .models import ContactMessage
from .serializers import ContactMessageCreateSerializer, ContactMessageSerializer


class ContactMessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                             mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    """/api/v1/contact/messages/ — public POST to send a message, staff-only to view/manage the inbox."""

    queryset = ContactMessage.objects.all()
    filterset_fields = ["status"]
    search_fields = ["name", "email", "phone", "subject", "message"]
    throttle_scope = "contact"

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsDashboardStaff()]

    def get_serializer_class(self):
        if self.action == "create":
            return ContactMessageCreateSerializer
        return ContactMessageSerializer
