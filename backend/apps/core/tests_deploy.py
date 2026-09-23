import shutil
import tempfile
from pathlib import Path

from django.test import TestCase, override_settings

from apps.accounts.models import User


class HealthCheckTests(TestCase):
    def test_healthz_is_open_and_needs_no_login(self):
        response = self.client.get("/healthz/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b"ok")


class MediaAccessTests(TestCase):
    """Public CMS imagery is open; private uploads only reach signed-in dashboard staff."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.media_root = tempfile.mkdtemp()
        for folder, name in (("gallery", "pic.gif"), ("job_applications/resumes", "cv.pdf"), ("avatars", "me.png")):
            target = Path(cls.media_root, folder)
            target.mkdir(parents=True)
            (target / name).write_bytes(b"data")
        cls._override = override_settings(MEDIA_ROOT=cls.media_root)
        cls._override.enable()

    @classmethod
    def tearDownClass(cls):
        cls._override.disable()
        shutil.rmtree(cls.media_root, ignore_errors=True)
        super().tearDownClass()

    def test_public_folder_is_served_to_anonymous_visitors(self):
        response = self.client.get("/media/gallery/pic.gif")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(b"".join(response.streaming_content), b"data")

    def test_private_uploads_hidden_from_anonymous_visitors(self):
        self.assertEqual(self.client.get("/media/job_applications/resumes/cv.pdf").status_code, 404)
        self.assertEqual(self.client.get("/media/avatars/me.png").status_code, 404)

    def test_private_uploads_hidden_from_customers(self):
        customer = User.objects.create_user(email="c@test.local", password="pw-12345-abc", role=User.Role.CUSTOMER)
        self.client.force_login(customer)
        self.assertEqual(self.client.get("/media/job_applications/resumes/cv.pdf").status_code, 404)

    def test_private_uploads_open_to_dashboard_staff(self):
        staff = User.objects.create_user(email="s@test.local", password="pw-12345-abc", role=User.Role.STAFF)
        self.client.force_login(staff)
        response = self.client.get("/media/job_applications/resumes/cv.pdf")
        self.assertEqual(response.status_code, 200)
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertIn("no-store", response["Cache-Control"])

    def test_path_traversal_and_missing_files_are_404(self):
        self.assertEqual(self.client.get("/media/gallery/../avatars/me.png").status_code, 404)
        self.assertEqual(self.client.get("/media/gallery/nothing.gif").status_code, 404)
        self.assertEqual(self.client.get("/media/gallery/").status_code, 404)
