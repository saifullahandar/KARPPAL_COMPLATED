from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class AuthAPITests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user(
            email="staff@karppal.af", password="StrongPass123", role=User.Role.ADMIN,
        )

    def test_login_returns_tokens_and_user(self):
        response = self.client.post(
            reverse("accounts:login"), {"email": "staff@karppal.af", "password": "StrongPass123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "staff@karppal.af")

    def test_login_rejects_wrong_password(self):
        response = self.client.post(
            reverse("accounts:login"), {"email": "staff@karppal.af", "password": "wrong"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_creates_customer(self):
        response = self.client.post(reverse("accounts:register"), {
            "email": "customer@example.com", "password": "AnotherPass123",
            "first_name": "Ali", "last_name": "Ahmadi",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="customer@example.com")
        self.assertEqual(user.role, User.Role.CUSTOMER)
        self.assertFalse(user.is_dashboard_staff)

    def test_me_requires_authentication(self):
        response = self.client.get(reverse("accounts:me"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_profile_when_authenticated(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get(reverse("accounts:me"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "staff@karppal.af")
