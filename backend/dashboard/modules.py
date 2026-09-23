"""Registers every model that should be manageable from the Bootstrap dashboard.

Imported once by DashboardConfig.ready() — see apps.py.
"""
from apps.accounts.models import User
from apps.contact.models import ContactMessage
from apps.core.models import CompanyInfo, Feature, HeroSlide, Statistic
from apps.exports.models import ExportShipment
from apps.gallery.models import GalleryCategory, GalleryItem
from apps.jobs.models import JobApplication, JobPosting
from apps.products.models import Category, Product, ProductImage, ProductSpecification
from apps.research.models import ResearchArticle, ResearchCategory
from apps.quality.models import QualityDailyReport, QualityScore
from apps.services.models import Service

from .forms import DashboardUserForm
from .registry import DashboardModule, register

# ---------------------------------------------------------------------------
# Website Content
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="heroslide", model=HeroSlide, label="Hero Slides", group="Website Content", icon="bi-images",
    list_display=("title", "subtitle", "order", "active"),
    form_fields=("title", "subtitle", "image", "cta_text", "cta_link", "order", "active"),
    search_fields=("title", "subtitle"), ordering=("order",),
))
register(DashboardModule(
    slug="statistic", model=Statistic, label="Homepage Statistics", group="Website Content", icon="bi-graph-up",
    list_display=("value", "label", "icon", "order", "active"),
    form_fields=("icon", "value", "label", "order", "active"),
    search_fields=("label",), ordering=("order",),
))
register(DashboardModule(
    slug="feature", model=Feature, label="Homepage Features", group="Website Content", icon="bi-star",
    list_display=("title", "text", "icon", "order", "active"),
    form_fields=("icon", "title", "text", "order", "active"),
    search_fields=("title", "text"), ordering=("order",),
))

# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="category", model=Category, label="Product Categories", group="Products", icon="bi-tags",
    list_display=("name", "slug", "order", "active"),
    form_fields=("name", "description", "image", "order", "active"),
    search_fields=("name",), ordering=("order",),
))
register(DashboardModule(
    slug="product", model=Product, label="Products", group="Products", icon="bi-box-seam",
    list_display=("name", "category", "price", "status", "featured", "order"),
    form_fields=(
        "category", "name", "short_description", "description", "price", "currency",
        "image", "tag1", "tag2", "status", "featured", "order", "meta_title", "meta_description",
    ),
    search_fields=("name", "short_description"), ordering=("order",),
))
register(DashboardModule(
    slug="productimage", model=ProductImage, label="Product Gallery Images", group="Products", icon="bi-card-image",
    list_display=("product", "alt_text", "order"),
    form_fields=("product", "image", "alt_text", "order"),
    search_fields=("alt_text",),
))
register(DashboardModule(
    slug="productspecification", model=ProductSpecification, label="Product Specifications", group="Products", icon="bi-list-check",
    list_display=("product", "key", "value", "order"),
    form_fields=("product", "key", "value", "order"),
    search_fields=("key", "value"),
))

# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="service", model=Service, label="Services", group="Services", icon="bi-gear",
    list_display=("name", "icon", "featured", "active", "order"),
    form_fields=("name", "icon", "short_description", "description", "featured", "active", "order", "meta_title", "meta_description"),
    search_fields=("name", "short_description"), ordering=("order",),
))

# ---------------------------------------------------------------------------
# Jobs
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="jobposting", model=JobPosting, label="Job Postings", group="Jobs", icon="bi-briefcase",
    list_display=("title", "employment_type", "location", "status", "featured", "posted_at"),
    form_fields=("title", "employment_type", "location", "tags", "description", "requirements", "status", "featured", "closing_date"),
    search_fields=("title", "location", "tags"),
))
register(DashboardModule(
    slug="jobapplication", model=JobApplication, label="Job Applications", group="Jobs", icon="bi-person-lines-fill",
    list_display=("first_name", "last_name", "job", "phone", "status", "application_date"),
    form_fields=("job", "first_name", "last_name", "country", "phone", "gender", "description", "resume", "status"),
    search_fields=("first_name", "last_name", "phone", "country"),
    allow_add=False,
))

# ---------------------------------------------------------------------------
# Research
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="researchcategory", model=ResearchCategory, label="Research Categories", group="Research", icon="bi-bookmark",
    list_display=("name", "slug", "order", "active"),
    form_fields=("name", "order", "active"),
    search_fields=("name",), ordering=("order",),
))
register(DashboardModule(
    slug="researcharticle", model=ResearchArticle, label="Research Articles", group="Research", icon="bi-file-earmark-text",
    list_display=("title", "category", "published", "featured", "published_at"),
    form_fields=(
        "category", "title", "excerpt", "content", "featured_image",
        "featured", "published", "published_at", "meta_title", "meta_description",
    ),
    search_fields=("title", "excerpt", "content"),
))

# ---------------------------------------------------------------------------
# Gallery
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="gallerycategory", model=GalleryCategory, label="Gallery Categories", group="Gallery", icon="bi-folder",
    list_display=("name", "slug", "order", "active"),
    form_fields=("name", "order", "active"),
    search_fields=("name",), ordering=("order",),
))
register(DashboardModule(
    slug="galleryitem", model=GalleryItem, label="Gallery Images", group="Gallery", icon="bi-images",
    list_display=("title", "category", "featured", "active", "order"),
    form_fields=("category", "title", "description", "image", "featured", "order", "active"),
    search_fields=("title", "description"),
))

# ---------------------------------------------------------------------------
# Quality Control
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="qualitydailyreport", model=QualityDailyReport, label="Daily QC Reports", group="Quality Control", icon="bi-clipboard-check",
    list_display=("date", "samples_count", "approved_count", "rejected_count", "acceptance_rate"),
    form_fields=("date", "samples_count", "in_review_count", "issues_count", "approved_count", "rejected_count", "avg_review_hours", "notes"),
    search_fields=(), ordering=("-date",),
))
register(DashboardModule(
    slug="qualityscore", model=QualityScore, label="QC Score Items", group="Quality Control", icon="bi-percent",
    list_display=("report", "score_type", "label", "percentage", "order"),
    form_fields=("report", "score_type", "label", "percentage", "order"),
    search_fields=("label",),
))

# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="exportshipment", model=ExportShipment, label="Export Shipments", group="Export", icon="bi-truck",
    list_display=("invoice_number", "destination_country", "amount", "currency", "status", "shipped_at"),
    form_fields=("invoice_number", "destination_country", "amount", "currency", "status", "shipped_at", "notes"),
    search_fields=("invoice_number", "destination_country"),
))

# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="contactmessage", model=ContactMessage, label="Contact Messages", group="Messages", icon="bi-envelope",
    list_display=("name", "email", "phone", "subject", "status", "created_at"),
    form_fields=("status",),
    search_fields=("name", "email", "phone", "subject", "message"),
    allow_add=False,
))

# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
register(DashboardModule(
    slug="user", model=User, label="Users", group="Users", icon="bi-people",
    list_display=("email", "first_name", "last_name", "role", "is_active"),
    form_fields=("email", "first_name", "last_name", "phone", "role", "avatar", "is_active"),
    search_fields=("email", "first_name", "last_name"),
    form_class=DashboardUserForm,
    admin_only=True,
))

# ---------------------------------------------------------------------------
# Settings (singleton CompanyInfo is edited via its own dedicated view, not
# this generic list/CRUD registry — see dashboard.views.CompanyInfoUpdateView)
# ---------------------------------------------------------------------------
COMPANY_INFO_MODEL = CompanyInfo
