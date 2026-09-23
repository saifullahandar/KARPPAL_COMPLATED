from django.db.models import Count, Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.permissions import IsDashboardStaff

from .models import ExportShipment
from .serializers import ExportShipmentSerializer


class ExportShipmentViewSet(viewsets.ModelViewSet):
    """/api/v1/exports/ — internal export-monitoring data, staff-only (no public read).

    These are operational shipment records (invoice, destination, amount, status),
    not customer-facing catalog content, so the whole endpoint requires dashboard staff.
    """

    serializer_class = ExportShipmentSerializer
    permission_classes = [IsDashboardStaff]
    queryset = ExportShipment.objects.all()
    filterset_fields = ["status", "destination_country"]
    search_fields = ["invoice_number", "destination_country"]
    ordering_fields = ["created_at", "amount", "shipped_at"]

    @action(detail=False, methods=["get"])
    def stats(self, request):
        qs = self.get_queryset()
        totals = qs.aggregate(total_amount=Sum("amount"), total_count=Count("id"))
        by_status = {row["status"]: row["count"] for row in qs.values("status").annotate(count=Count("id"))}
        return Response({
            "total_amount": totals["total_amount"] or 0,
            "total_count": totals["total_count"] or 0,
            "pending": by_status.get(ExportShipment.Status.PENDING, 0),
            "shipping": by_status.get(ExportShipment.Status.SHIPPING, 0),
            "completed": by_status.get(ExportShipment.Status.COMPLETED, 0),
        })
