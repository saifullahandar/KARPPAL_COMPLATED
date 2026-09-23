from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import Category, Product


TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def tiny_image():
    return SimpleUploadedFile("test.gif", TINY_GIF, content_type="image/gif")


class ProductAPITests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Dairy")
        self.active_product = Product.objects.create(
            category=self.category, name="Milk", image=tiny_image(), status=Product.Status.ACTIVE,
        )
        self.inactive_product = Product.objects.create(
            category=self.category, name="Discontinued Cheese", image=tiny_image(), status=Product.Status.INACTIVE,
        )
        self.staff = User.objects.create_user(email="staff@karppal.af", password="StrongPass123", role=User.Role.ADMIN)

    def test_public_list_only_shows_active_products(self):
        response = self.client.get(reverse("products:product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [p["name"] for p in response.data["results"]]
        self.assertIn("Milk", names)
        self.assertNotIn("Discontinued Cheese", names)

    def test_staff_sees_inactive_products_too(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get(reverse("products:product-list"))
        names = [p["name"] for p in response.data["results"]]
        self.assertIn("Discontinued Cheese", names)

    def test_retrieve_by_slug(self):
        response = self.client.get(reverse("products:product-detail", kwargs={"slug": self.active_product.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Milk")

    def test_anonymous_cannot_create_product(self):
        response = self.client.post(reverse("products:product-list"), {
            "category_id": self.category.id, "name": "New", "image": tiny_image(),
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_staff_can_create_product(self):
        self.client.force_authenticate(self.staff)
        response = self.client.post(reverse("products:product-list"), {
            "category_id": self.category.id, "name": "Yogurt", "image": tiny_image(),
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(slug="yogurt").exists())

    def test_filter_by_category_slug(self):
        other_category = Category.objects.create(name="Cosmetics")
        Product.objects.create(category=other_category, name="Musk Oil", image=tiny_image())

        response = self.client.get(reverse("products:product-list"), {"category": "dairy"})
        names = [p["name"] for p in response.data["results"]]
        self.assertIn("Milk", names)
        self.assertNotIn("Musk Oil", names)
