from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import ContactMessage


class ContactMessageAPITests(APITestCase):
    def test_anyone_can_submit_a_message(self):
        response = self.client.post(reverse("contact:contact-message-list"), {
            "name": "Ali Ahmadi", "email": "ali@example.com", "subject": "Hello", "message": "Hi there",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.get().status, ContactMessage.Status.NEW)

    def test_requires_email_or_phone(self):
        response = self.client.post(reverse("contact:contact-message-list"), {
            "name": "Ali Ahmadi", "message": "Hi there",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_staff_can_view_inbox(self):
        ContactMessage.objects.create(name="Ali", email="ali@example.com", message="Hi")

        response = self.client.get(reverse("contact:contact-message-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        staff = User.objects.create_user(email="staff@karppal.af", password="StrongPass123", role=User.Role.STAFF)
        self.client.force_authenticate(staff)
        response = self.client.get(reverse("contact:contact-message-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
