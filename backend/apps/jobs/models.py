from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.core.i18n import LocalizedModelMixin
from apps.core.models import TimeStampedModel
from apps.core.validators import validate_file_size


class JobPosting(LocalizedModelMixin, TimeStampedModel):
    localized_fields = ("title", "location", "tags", "description", "requirements")

    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", "Full Time"
        PART_TIME = "part_time", "Part Time"
        REMOTE = "remote", "Remote"
        CONTRACT = "contract", "Contract"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        CLOSED = "closed", "Closed"

    title = models.CharField(max_length=150)
    title_fa = models.CharField("title (Dari)", max_length=150, blank=True)
    title_ps = models.CharField("title (Pashto)", max_length=150, blank=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME)
    location = models.CharField(max_length=120, blank=True)
    location_fa = models.CharField("location (Dari)", max_length=120, blank=True)
    location_ps = models.CharField("location (Pashto)", max_length=120, blank=True)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated, e.g. 'Kabul, 3+ years, Sales'")
    tags_fa = models.CharField("tags (Dari)", max_length=255, blank=True)
    tags_ps = models.CharField("tags (Pashto)", max_length=255, blank=True)

    description = models.TextField(blank=True)
    description_fa = models.TextField("description (Dari)", blank=True)
    description_ps = models.TextField("description (Pashto)", blank=True)
    requirements = models.TextField(blank=True)
    requirements_fa = models.TextField("requirements (Dari)", blank=True)
    requirements_ps = models.TextField("requirements (Pashto)", blank=True)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    featured = models.BooleanField(default=False)

    posted_at = models.DateTimeField(default=timezone.now)
    closing_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-posted_at"]
        indexes = [models.Index(fields=["status", "-posted_at"])]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            n = 1
            while JobPosting.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base_slug}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(",") if t.strip()]


class JobApplication(TimeStampedModel):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWED = "reviewed", "Reviewed"
        SHORTLISTED = "shortlisted", "Shortlisted"
        REJECTED = "rejected", "Rejected"
        HIRED = "hired", "Hired"

    job = models.ForeignKey(JobPosting, on_delete=models.SET_NULL, null=True, blank=True, related_name="applications")

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Afghanistan")
    phone = models.CharField(max_length=30)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    application_date = models.DateField(default=timezone.localdate)
    description = models.TextField(blank=True, help_text="Cover note / additional details from the applicant.")
    resume = models.FileField(
        upload_to="job_applications/resumes/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["pdf", "doc", "docx"]), validate_file_size],
    )

    status = models.CharField(max_length=15, choices=Status.choices, default=Status.NEW)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.job or 'General application'}"
