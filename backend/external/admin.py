from django.contrib import admin
from external.models import About, ServiceFeedback, Message, FAQ
from django.utils.translation import gettext_lazy as _

# Register your models here.


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ("name", "short_name", "founded_in", "updated_at")
    fieldsets = (
        (None, {"fields": ("name", "short_name", "slogan", "details", "address")}),
        (
            _("History"),
            {"fields": ("founded_in",)},
        ),
        (
            _("Contact"),
            {
                "fields": (
                    "phone_number",
                    "email",
                )
            },
        ),
        (
            _("Social Media"),
            {
                "fields": (
                    "facebook",
                    "twitter",
                    "linkedin",
                    "instagram",
                    "tiktok",
                    "youtube",
                )
            },
        ),
        (
            _("Media"),
            {"fields": ("logo", "wallpaper")},
        ),
        (_("Timestamps"), {"fields": ("updated_at", "created_at")}),
    )
    readonly_fields = ("updated_at", "created_at")


@admin.register(ServiceFeedback)
class ServiceFeedbackAdmin(admin.ModelAdmin):
    list_display = ("sender", "rate", "show_in_index", "sender_role", "created_at")
    search_fields = ("sender__username", "message")
    list_filter = ("rate", "show_in_index", "updated_at", "created_at")
    list_editable = ("show_in_index",)
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("sender", "message")}),
        (_("Details"), {"fields": ("sender_role", "rate")}),
        (_("Timestamps"), {"fields": ("updated_at", "created_at")}),
    )
    readonly_fields = ("updated_at", "created_at")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("sender", "message")
    list_editable = ("is_read",)
    ordering = ("-created_at",)
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "sender",
                    "email",
                    "body",
                )
            },
        ),
        (_("Status & Date"), {"fields": ("is_read", "created_at")}),
    )
    readonly_fields = ("created_at",)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_shown", "created_at")
    list_filter = ("is_shown", "created_at")
    search_fields = ("question", "answer")
    list_editable = ("is_shown",)
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("question", "answer")}),
        (_("Status & Date"), {"fields": ("is_shown", "created_at")}),
    )
    readonly_fields = ("created_at",)
