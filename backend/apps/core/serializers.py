from rest_framework import serializers

from .i18n import LocalizedSerializerMixin
from .models import CompanyInfo, Feature, HeroSlide, Statistic


class CompanyInfoSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = [
            "name", "tagline", "description", "mission", "vision",
            "email", "phone", "whatsapp", "address",
            "facebook_url", "instagram_url", "linkedin_url", "whatsapp_url", "map_url",
            "logo", "favicon", "map_image", "founded_year",
        ]


class HeroSlideSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ["id", "title", "subtitle", "image", "cta_text", "cta_link", "order"]


class StatisticSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = ["id", "icon", "value", "label", "order"]


class FeatureSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ["id", "icon", "title", "text", "order"]
