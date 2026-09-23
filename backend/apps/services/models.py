from django.db import models
from django.utils.text import slugify

from apps.core.i18n import LocalizedModelMixin
from apps.core.models import SEOFieldsModel, TimeStampedModel


class Service(LocalizedModelMixin, SEOFieldsModel, TimeStampedModel):
    localized_fields = ("name", "short_description", "description")

    name = models.CharField(max_length=120)
    name_fa = models.CharField("name (Dari)", max_length=120, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    icon = models.CharField(max_length=10, default="💼", help_text="An emoji shown on the service card.")
    short_description = models.CharField(max_length=255, blank=True)
    short_description_fa = models.CharField("short description (Dari)", max_length=255, blank=True)
    short_description_ps = models.CharField("short description (Pashto)", max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)
    featured = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            n = 1
            while Service.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base_slug}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)
