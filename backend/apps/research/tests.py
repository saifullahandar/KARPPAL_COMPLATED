from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ResearchArticle, ResearchCategory


TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def tiny_image():
    return SimpleUploadedFile("test.gif", TINY_GIF, content_type="image/gif")


class ResearchAPITests(APITestCase):
    def test_only_published_articles_are_public(self):
        ResearchArticle.objects.create(title="Published", content="...", featured_image=tiny_image(), published=True)
        ResearchArticle.objects.create(title="Draft", content="...", featured_image=tiny_image(), published=False)

        response = self.client.get(reverse("research:research-article-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [a["title"] for a in response.data["results"]]
        self.assertIn("Published", titles)
        self.assertNotIn("Draft", titles)

    def test_slug_is_generated_and_unique(self):
        a1 = ResearchArticle.objects.create(title="Karppal Research", content="...", featured_image=tiny_image())
        a2 = ResearchArticle.objects.create(title="Karppal Research", content="...", featured_image=tiny_image())
        self.assertEqual(a1.slug, "karppal-research")
        self.assertNotEqual(a1.slug, a2.slug)

    def test_detail_lookup_by_slug(self):
        article = ResearchArticle.objects.create(title="Detail Lookup", content="Body", featured_image=tiny_image())
        response = self.client.get(reverse("research:research-article-detail", kwargs={"slug": article.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Body")

    def test_unpublished_article_detail_is_not_public(self):
        article = ResearchArticle.objects.create(title="Hidden", content="...", featured_image=tiny_image(), published=False)
        response = self.client.get(reverse("research:research-article-detail", kwargs={"slug": article.slug}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_cannot_create_article(self):
        category = ResearchCategory.objects.create(name="Agriculture")
        response = self.client.post(
            reverse("research:research-article-list"),
            {"title": "New", "content": "...", "category_id": category.id},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_search_and_category_filter(self):
        category = ResearchCategory.objects.create(name="Livestock")
        ResearchArticle.objects.create(title="Dairy yield study", content="...", featured_image=tiny_image(), category=category)
        ResearchArticle.objects.create(title="Unrelated topic", content="...", featured_image=tiny_image())

        response = self.client.get(reverse("research:research-article-list"), {"search": "Dairy"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(reverse("research:research-article-list"), {"category": category.slug})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
