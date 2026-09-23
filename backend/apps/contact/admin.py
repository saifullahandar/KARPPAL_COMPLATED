from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "phone", "subject", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["name", "email", "phone", "subject", "message"]
    readonly_fields = ["name", "email", "phone", "subject", "message", "created_at"]
