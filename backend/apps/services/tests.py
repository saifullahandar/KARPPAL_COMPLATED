from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import Service


class ServiceAPITests(APITestCase):
    def setUp(self):
        self.service = Service.objects.create(name="Business Consulting", active=True)
        Service.objects.create(name="Hidden Service", active=False)

    def test_public_list_only_active(self):
        response = self.client.get(reverse("services:service-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [s["name"] for s in response.data["results"]]
        self.assertIn("Business Consulting", names)
        self.assertNotIn("Hidden Service", names)

    def test_write_requires_staff(self):
        response = self.client.post(reverse("services:service-list"), {"name": "New Service"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        staff = User.objects.create_user(email="staff@karppal.af", password="StrongPass123", role=User.Role.STAFF)
        self.client.force_authenticate(staff)
        response = self.client.post(reverse("services:service-list"), {"name": "New Service"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
