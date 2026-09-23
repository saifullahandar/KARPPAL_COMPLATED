from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaffOrReadOnly

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    """/api/v1/services/ — public read, staff-managed CRUD."""

    serializer_class = ServiceSerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["featured", "active"]
    search_fields = [
        "name", "name_fa", "name_ps", "short_description", "short_description_fa", "short_description_ps",
        "description", "description_fa", "description_ps",
    ]
    ordering_fields = ["order", "name"]

    def get_queryset(self):
        qs = Service.objects.all()
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(active=True)
        return qs
