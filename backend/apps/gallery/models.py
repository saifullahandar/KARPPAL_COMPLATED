from django.db import models
from django.utils.text import slugify

from apps.core.i18n import LocalizedModelMixin
from apps.core.models import OrderableModel, TimeStampedModel
from apps.core.validators import validate_file_size


class GalleryCategory(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    localized_fields = ("name",)

    name = models.CharField(max_length=120, unique=True)
    name_fa = models.CharField("name (Dari)", max_length=120, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta(OrderableModel.Meta):
        verbose_name_plural = "Gallery Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class GalleryItem(LocalizedModelMixin, TimeStampedModel):
    localized_fields = ("title", "description")

    category = models.ForeignKey(
        GalleryCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="items",
    )
    title = models.CharField(max_length=150)
    title_fa = models.CharField("title (Dari)", max_length=150, blank=True)
    title_ps = models.CharField("title (Pashto)", max_length=150, blank=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)
    image = models.ImageField(upload_to="gallery/", validators=[validate_file_size])
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title
