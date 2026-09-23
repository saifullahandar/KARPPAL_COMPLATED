from django.contrib import admin

from .models import ExportShipment


@admin.register(ExportShipment)
class ExportShipmentAdmin(admin.ModelAdmin):
    list_display = ["invoice_number", "destination_country", "amount", "currency", "status", "shipped_at"]
    list_filter = ["status", "destination_country"]
    search_fields = ["invoice_number", "destination_country"]
