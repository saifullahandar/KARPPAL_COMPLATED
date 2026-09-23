from django.db import models

from apps.core.models import TimeStampedModel


class ExportShipment(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SHIPPING = "shipping", "Shipping"
        COMPLETED = "completed", "Completed"

    invoice_number = models.CharField(max_length=30, unique=True)
    destination_country = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=8, default="USD")
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    shipped_at = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "-created_at"])]

    def __str__(self):
        return f"{self.invoice_number} — {self.destination_country}"
