from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import GalleryCategory, GalleryItem


TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def tiny_image():
    return SimpleUploadedFile("test.gif", TINY_GIF, content_type="image/gif")


class GalleryAPITests(APITestCase):
    def test_only_active_items_public(self):
        GalleryItem.objects.create(title="Visible", image=tiny_image(), active=True)
        GalleryItem.objects.create(title="Hidden", image=tiny_image(), active=False)

        response = self.client.get(reverse("gallery:gallery-item-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item["title"] for item in response.data["results"]]
        self.assertIn("Visible", titles)
        self.assertNotIn("Hidden", titles)

    def test_category_slug_filter_returns_matching_items(self):
        matching = GalleryCategory.objects.create(name="Production Facility")
        other = GalleryCategory.objects.create(name="Team Events")
        GalleryItem.objects.create(title="Facility Shot", image=tiny_image(), category=matching)
        GalleryItem.objects.create(title="Team Shot", image=tiny_image(), category=other)

        response = self.client.get(reverse("gallery:gallery-item-list"), {"category": matching.slug})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item["title"] for item in response.data["results"]]
        self.assertEqual(titles, ["Facility Shot"])

    def test_category_filter_with_invalid_slug_returns_empty_not_error(self):
        GalleryItem.objects.create(title="Some Item", image=tiny_image())

        response = self.client.get(reverse("gallery:gallery-item-list"), {"category": "does-not-exist"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_no_category_filter_returns_all_active_items(self):
        category = GalleryCategory.objects.create(name="Facility")
        GalleryItem.objects.create(title="In Category", image=tiny_image(), category=category)
        GalleryItem.objects.create(title="No Category", image=tiny_image())

        response = self.client.get(reverse("gallery:gallery-item-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_featured_filter_still_works_alongside_category_fix(self):
        GalleryItem.objects.create(title="Featured", image=tiny_image(), featured=True)
        GalleryItem.objects.create(title="Not Featured", image=tiny_image(), featured=False)

        response = self.client.get(reverse("gallery:gallery-item-list"), {"featured": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item["title"] for item in response.data["results"]]
        self.assertEqual(titles, ["Featured"])

    def test_search_still_works(self):
        GalleryItem.objects.create(title="Cheese Production Line", image=tiny_image())
        GalleryItem.objects.create(title="Unrelated", image=tiny_image())

        response = self.client.get(reverse("gallery:gallery-item-list"), {"search": "Cheese"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
