from decouple import config
from django.core.management.base import BaseCommand

from apps.accounts.models import User


class Command(BaseCommand):
    help = "Creates (or updates) a super-admin user from DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD in .env"

    def add_arguments(self, parser):
        parser.add_argument(
            "--if-missing",
            action="store_true",
            help="Do nothing if the user already exists (used on every container boot, so a "
            "password changed later in the dashboard is not reset by the next deploy).",
        )

    def handle(self, *args, **options):
        email = config("DJANGO_SUPERUSER_EMAIL", default="admin@karppal.af")
        password = config("DJANGO_SUPERUSER_PASSWORD", default=None)

        if not password:
            self.stderr.write(self.style.ERROR("DJANGO_SUPERUSER_PASSWORD is not set in .env"))
            return

        if options["if_missing"] and User.objects.filter(email=email).exists():
            self.stdout.write(f"Super admin {email} already exists; leaving it unchanged.")
            return

        user, created = User.objects.get_or_create(email=email, defaults={"role": User.Role.SUPER_ADMIN})
        user.role = User.Role.SUPER_ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} super admin: {email}"))
