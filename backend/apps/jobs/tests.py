from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import JobApplication, JobPosting


class JobPostingAPITests(APITestCase):
    def test_only_active_postings_are_public(self):
        JobPosting.objects.create(title="Sales Manager", status=JobPosting.Status.ACTIVE)
        JobPosting.objects.create(title="Closed Role", status=JobPosting.Status.CLOSED)

        response = self.client.get(reverse("jobs:job-posting-list"))
        titles = [j["title"] for j in response.data["results"]]
        self.assertIn("Sales Manager", titles)
        self.assertNotIn("Closed Role", titles)


class JobApplicationAPITests(APITestCase):
    def test_anyone_can_submit_an_application(self):
        response = self.client.post(reverse("jobs:job-application-list"), {
            "first_name": "Ali", "last_name": "Ahmadi", "country": "Afghanistan",
            "phone": "0780194632", "gender": "male",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 1)
        self.assertEqual(JobApplication.objects.get().status, JobApplication.Status.NEW)

    def test_only_staff_can_list_applications(self):
        JobApplication.objects.create(first_name="Ali", last_name="Ahmadi", phone="0780194632")

        response = self.client.get(reverse("jobs:job-application-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        staff = User.objects.create_user(email="staff@karppal.af", password="StrongPass123", role=User.Role.STAFF)
        self.client.force_authenticate(staff)
        response = self.client.get(reverse("jobs:job-application-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
