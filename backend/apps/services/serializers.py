from rest_framework import serializers

from apps.core.i18n import LocalizedSerializerMixin

from .models import Service


class ServiceSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "icon", "short_description", "description",
            "featured", "active", "order", "meta_title", "meta_description",
        ]
        read_only_fields = ["slug"]
