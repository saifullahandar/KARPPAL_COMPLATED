from django.db import models
from django.utils.text import slugify

from apps.core.i18n import LocalizedModelMixin
from apps.core.models import OrderableModel, SEOFieldsModel, TimeStampedModel
from apps.core.validators import validate_file_size


class Category(LocalizedModelMixin, OrderableModel, TimeStampedModel):
    localized_fields = ("name", "description")

    name = models.CharField(max_length=120, unique=True)
    name_fa = models.CharField("name (Dari)", max_length=120, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True, validators=[validate_file_size])

    class Meta(OrderableModel.Meta):
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(LocalizedModelMixin, SEOFieldsModel, TimeStampedModel):
    localized_fields = ("name", "short_description", "description", "tag1", "tag2")

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    name = models.CharField(max_length=150)
    name_fa = models.CharField("name (Dari)", max_length=150, blank=True)
    name_ps = models.CharField("name (Pashto)", max_length=150, blank=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    short_description_fa = models.CharField("short description (Dari)", max_length=255, blank=True)
    short_description_ps = models.CharField("short description (Pashto)", max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)

    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=8, default="AFN")

    image = models.ImageField(upload_to="products/", validators=[validate_file_size])
    tag1 = models.CharField(max_length=40, blank=True)
    tag1_fa = models.CharField("tag 1 (Dari)", max_length=40, blank=True)
    tag1_ps = models.CharField("tag 1 (Pashto)", max_length=40, blank=True)
    tag2 = models.CharField(max_length=40, blank=True)
    tag2_fa = models.CharField("tag 2 (Dari)", max_length=40, blank=True)
    tag2_ps = models.CharField("tag 2 (Pashto)", max_length=40, blank=True)

    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]
        indexes = [
            models.Index(fields=["status", "featured"]),
            models.Index(fields=["category", "status"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            n = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base_slug}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)


class ProductImage(LocalizedModelMixin, models.Model):
    localized_fields = ("alt_text",)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="products/gallery/", validators=[validate_file_size])
    alt_text = models.CharField(max_length=150, blank=True)
    alt_text_fa = models.CharField("alt text (Dari)", max_length=150, blank=True)
    alt_text_ps = models.CharField("alt text (Pashto)", max_length=150, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} image #{self.pk}"


class ProductSpecification(LocalizedModelMixin, models.Model):
    localized_fields = ("key", "value")

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specifications")
    key = models.CharField(max_length=80)
    key_fa = models.CharField("key (Dari)", max_length=80, blank=True)
    key_ps = models.CharField("key (Pashto)", max_length=80, blank=True)
    value = models.CharField(max_length=200)
    value_fa = models.CharField("value (Dari)", max_length=200, blank=True)
    value_ps = models.CharField("value (Pashto)", max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.key}: {self.value}"
