from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import ExportShipment


class ExportShipmentAPITests(APITestCase):
    def setUp(self):
        ExportShipment.objects.create(invoice_number="EXP-1", destination_country="UAE", amount=1000, status=ExportShipment.Status.COMPLETED)
        ExportShipment.objects.create(invoice_number="EXP-2", destination_country="Germany", amount=500, status=ExportShipment.Status.PENDING)
        self.staff = User.objects.create_user(email="staff@karppal.af", password="StrongPass123", role=User.Role.STAFF)

    def test_anonymous_cannot_access(self):
        response = self.client.get(reverse("exports:export-shipment-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_staff_can_list_and_see_stats(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get(reverse("exports:export-shipment-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

        stats = self.client.get(reverse("exports:export-shipment-stats"))
        self.assertEqual(stats.status_code, status.HTTP_200_OK)
        self.assertEqual(stats.data["total_count"], 2)
        self.assertEqual(float(stats.data["total_amount"]), 1500.0)
