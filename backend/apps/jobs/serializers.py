from rest_framework import serializers

from apps.core.i18n import LocalizedSerializerMixin, get_request_language

from .models import JobApplication, JobPosting


class JobPostingSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    tag_list = serializers.ListField(child=serializers.CharField(), read_only=True)
    application_count = serializers.IntegerField(source="applications.count", read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            "id", "title", "slug", "employment_type", "location", "tags", "tag_list",
            "description", "requirements", "status", "featured", "posted_at", "closing_date",
            "application_count",
        ]
        read_only_fields = ["slug"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # tag_list is derived from the (now language-resolved) comma-separated tags
        data["tag_list"] = [t.strip() for t in data["tags"].split(",") if t.strip()]
        return data


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            "id", "job", "job_title", "first_name", "last_name", "country", "phone",
            "gender", "application_date", "description", "resume", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def get_job_title(self, obj) -> str:
        if not obj.job:
            return ""
        return obj.job.get_localized("title", get_request_language(self.context.get("request")))
