from django.contrib import admin

from .models import JobApplication, JobPosting


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ["title", "employment_type", "location", "status", "featured", "posted_at"]
    list_filter = ["employment_type", "status", "featured"]
    search_fields = ["title", "location", "tags"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "job", "phone", "status", "application_date"]
    list_filter = ["status", "gender"]
    search_fields = ["first_name", "last_name", "phone", "country"]
    readonly_fields = ["created_at"]
