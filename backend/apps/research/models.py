from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.core.i18n import LocalizedModelMixin
from apps.core.models import OrderableModel, SEOFieldsModel, TimeStampedModel
from apps.core.validators import validate_file_size


class ResearchCategory(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    localized_fields = ("name",)

    name = models.CharField(max_length=120, unique=True)
    name_fa = models.CharField("name (Dari)", max_length=120, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta(OrderableModel.Meta):
        verbose_name_plural = "Research Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ResearchArticle(LocalizedModelMixin, SEOFieldsModel, TimeStampedModel):
    localized_fields = ("title", "excerpt", "content")

    category = models.ForeignKey(ResearchCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="articles")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="articles")

    title = models.CharField(max_length=200)
    title_fa = models.CharField("title (Dari)", max_length=200, blank=True)
    title_ps = models.CharField("title (Pashto)", max_length=200, blank=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField(max_length=300, blank=True)
    excerpt_fa = models.CharField("excerpt (Dari)", max_length=300, blank=True)
    excerpt_ps = models.CharField("excerpt (Pashto)", max_length=300, blank=True)
    content = models.TextField()
    content_fa = models.TextField("content (Dari)", blank=True)
    content_ps = models.TextField("content (Pashto)", blank=True)
    featured_image = models.ImageField(upload_to="research/", validators=[validate_file_size])

    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-published_at"]
        indexes = [models.Index(fields=["published", "-published_at"])]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            n = 1
            while ResearchArticle.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base_slug}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)
