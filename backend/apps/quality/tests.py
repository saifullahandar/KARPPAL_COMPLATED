from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import QualityDailyReport


class QualityAPITests(APITestCase):
    def test_requires_staff(self):
        response = self.client.get(reverse("quality:quality-report-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acceptance_rate_computed(self):
        report = QualityDailyReport.objects.create(approved_count=112, rejected_count=16)
        self.assertEqual(report.acceptance_rate, 87.5)
