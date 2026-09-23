from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CompanyInfo, Feature, HeroSlide, Statistic
from .validators import validate_file_size


class CompanyInfoAPITests(APITestCase):
    def test_company_info_is_public_and_singleton(self):
        CompanyInfo.objects.create(name="Karppal Test")
        url = reverse("core:company-info")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Karppal Test")

    def test_company_info_auto_creates_when_missing(self):
        url = reverse("core:company-info")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CompanyInfo.objects.count(), 1)


class HomepageContentAPITests(APITestCase):
    def test_only_active_items_are_returned(self):
        HeroSlide.objects.create(title="Visible", image="x.jpg", active=True)
        HeroSlide.objects.create(title="Hidden", image="y.jpg", active=False)
        Statistic.objects.create(value="15+", label="Years", active=True)
        Feature.objects.create(title="Quality", text="Controlled quality", active=True)

        slides = self.client.get(reverse("core:hero-slides"))
        stats = self.client.get(reverse("core:statistics"))
        features = self.client.get(reverse("core:features"))

        self.assertEqual(len(slides.data), 1)
        self.assertEqual(slides.data[0]["title"], "Visible")
        self.assertEqual(len(stats.data), 1)
        self.assertEqual(len(features.data), 1)


class FileSizeValidatorTests(TestCase):
    @override_settings(MAX_UPLOAD_SIZE_MB=1)
    def test_rejects_files_over_the_limit(self):
        oversized = SimpleUploadedFile("big.jpg", b"x" * (2 * 1024 * 1024))
        with self.assertRaises(ValidationError):
            validate_file_size(oversized)

    @override_settings(MAX_UPLOAD_SIZE_MB=1)
    def test_allows_files_within_the_limit(self):
        small = SimpleUploadedFile("small.jpg", b"x" * 1024)
        validate_file_size(small)  # should not raise
