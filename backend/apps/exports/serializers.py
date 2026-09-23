from rest_framework import serializers

from .models import ExportShipment


class ExportShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExportShipment
        fields = [
            "id", "invoice_number", "destination_country", "amount", "currency",
            "status", "shipped_at", "notes", "created_at", "updated_at",
        ]
