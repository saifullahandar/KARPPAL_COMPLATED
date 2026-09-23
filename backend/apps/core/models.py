from django.db import models

from .i18n import LocalizedModelMixin
from .validators import validate_file_size


class TimeStampedModel(models.Model):
    """Abstract base adding created_at / updated_at to any model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrderableModel(models.Model):
    """Abstract base for content that is manually re-orderable and can be toggled active."""

    order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first.")
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class SEOFieldsModel(models.Model):
    """Abstract base for optional per-page SEO metadata."""

    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)

    class Meta:
        abstract = True


class CompanyInfo(LocalizedModelMixin, TimeStampedModel):
    """Singleton row holding editable company/about information shown across the site."""

    localized_fields = ("name", "tagline", "description", "mission", "vision", "address")

    name = models.CharField(max_length=150, default="Karppal")
    name_fa = models.CharField("name (Dari)", max_length=150, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=150, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    tagline_fa = models.CharField("tagline (Dari)", max_length=255, blank=True)
    tagline_ps = models.CharField("tagline (Pashto)", max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)
    mission = models.TextField(blank=True)
    mission_fa = models.TextField("mission (Dari)", blank=True)
    mission_ps = models.TextField("mission (Pashto)", blank=True)
    vision = models.TextField(blank=True)
    vision_fa = models.TextField("vision (Dari)", blank=True)
    vision_ps = models.TextField("vision (Pashto)", blank=True)

    email = models.EmailField(default="info@karppal.af")
    phone = models.CharField(max_length=30, default="+93 780 194 632")
    whatsapp = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, default="Afghanistan, Kabul, Industrial Parks")
    address_fa = models.CharField("address (Dari)", max_length=255, blank=True)
    address_ps = models.CharField("address (Pashto)", max_length=255, blank=True)

    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    map_url = models.URLField(blank=True)

    logo = models.ImageField(upload_to="company/", blank=True, null=True, validators=[validate_file_size])
    favicon = models.ImageField(upload_to="company/", blank=True, null=True, validators=[validate_file_size])
    map_image = models.ImageField(upload_to="company/", blank=True, null=True, validators=[validate_file_size])

    founded_year = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Company Information"
        verbose_name_plural = "Company Information"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HeroSlide(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    """A slide on the homepage hero/slider."""

    localized_fields = ("title", "subtitle", "cta_text")

    title = models.CharField(max_length=200, blank=True)
    title_fa = models.CharField("title (Dari)", max_length=200, blank=True)
    title_ps = models.CharField("title (Pashto)", max_length=200, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    subtitle_fa = models.CharField("subtitle (Dari)", max_length=255, blank=True)
    subtitle_ps = models.CharField("subtitle (Pashto)", max_length=255, blank=True)
    image = models.ImageField(upload_to="hero_slides/", validators=[validate_file_size])
    cta_text = models.CharField(max_length=60, blank=True)
    cta_text_fa = models.CharField("cta text (Dari)", max_length=60, blank=True)
    cta_text_ps = models.CharField("cta text (Pashto)", max_length=60, blank=True)
    cta_link = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title or f"Slide {self.pk}"


class Statistic(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    """An achievement / stat card shown on the homepage (e.g. '15+ Years Experience')."""

    localized_fields = ("label",)

    icon = models.CharField(max_length=50, default="bi-trophy", help_text="Bootstrap Icons class name.")
    value = models.CharField(max_length=30, help_text="e.g. 15+, 2.000+, 98%")
    label = models.CharField(max_length=120)
    label_fa = models.CharField("label (Dari)", max_length=120, blank=True)
    label_ps = models.CharField("label (Pashto)", max_length=120, blank=True)

    def __str__(self):
        return f"{self.value} {self.label}"


class Feature(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    """A homepage feature/benefit card (e.g. 'Standard Production')."""

    localized_fields = ("title", "text")

    icon = models.CharField(max_length=50, default="bi-gem", help_text="Bootstrap Icons class name.")
    title = models.CharField(max_length=120)
    title_fa = models.CharField("title (Dari)", max_length=120, blank=True)
    title_ps = models.CharField("title (Pashto)", max_length=120, blank=True)
    text = models.CharField(max_length=255)
    text_fa = models.CharField("text (Dari)", max_length=255, blank=True)
    text_ps = models.CharField("text (Pashto)", max_length=255, blank=True)

    def __str__(self):
        return self.title
