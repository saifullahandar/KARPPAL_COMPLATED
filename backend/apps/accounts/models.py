from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.validators import validate_file_size

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user, authenticated by email. Role drives dashboard access level."""

    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", _("Super Admin")
        ADMIN = "admin", _("Admin")
        STAFF = "staff", _("Staff")
        CUSTOMER = "customer", _("Customer")

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True, validators=[validate_file_size])

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email

    @property
    def is_dashboard_staff(self):
        return self.role in {self.Role.SUPER_ADMIN, self.Role.ADMIN, self.Role.STAFF} or self.is_superuser

    @property
    def is_dashboard_admin(self):
        """Elevated dashboard access: user management and company-wide settings.

        Deliberately narrower than is_dashboard_staff — plain 'staff' accounts manage
        day-to-day content (products, research, jobs, ...) but must not manage other users'
        roles or company-wide settings, so this excludes Role.STAFF.
        """
        return self.role in {self.Role.SUPER_ADMIN, self.Role.ADMIN} or self.is_superuser

    def save(self, *args, **kwargs):
        if self.role in {self.Role.SUPER_ADMIN, self.Role.ADMIN, self.Role.STAFF} or self.is_superuser:
            self.is_staff = True
        super().save(*args, **kwargs)
