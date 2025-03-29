from django.contrib import admin
from tailoring.models import Service, Order
from django.utils.translation import gettext_lazy as _

# Register your models here.


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):

    def pending_orders(self, obj: Service) -> int:
        return obj.orders.filter(status=Order.OrderStatus.PENDING.value).count()

    def completed_orders(self, obj: Service) -> int:
        return obj.orders.filter(status=Order.OrderStatus.COMPLETED.value).count()

    def in_progress_orders(self, obj: Service) -> int:
        return obj.orders.filter(status=Order.OrderStatus.IN_PROGRESS.value).count()

    pending_orders.short_description = _("Pending Orders")
    completed_orders.short_description = _("Completed Orders")
    in_progress_orders.short_description = _("In Progress Orders")
    list_display = (
        "name",
        "pending_orders",
        "in_progress_orders",
        "completed_orders",
        "starting_price",
    )
    list_filter = ("created_at",)
    search_fields = ("name",)
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "description",
                )
            },
        ),
        (_("Prices"), {"fields": ("starting_price", "ending_price")}),
        (_("Media & Date"), {"fields": ("picture", "created_at")}),
    )
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "client",
        "service",
        "quantity",
        "urgency",
        "charges",
        "charges_paid",
        "status",
        "fabric_required",
    )
    search_fields = ("client__username",)
    list_filter = (
        "client__username",
        "service__name",
        "urgency",
        "status",
        "fabric_required",
    )
    fieldsets = (
        (_("Client Information"), {"fields": ("client",)}),
        (
            _("Order Details"),
            {
                "fields": (
                    "service",
                    "details",
                    "material_type",
                    "fabric_required",
                    "quantity",
                    "urgency",
                )
            },
        ),
        (_("Preferences"), {"fields": ("reference_image", "colors")}),
        (_("Cost Information"), {"fields": ("charges", "charges_paid")}),
        (_("Status and Picture"), {"fields": ("status", "picture")}),
        (
            _("Publicity & Date"),
            {"fields": ("show_in_index", "created_at", "updated_at")},
        ),
    )

    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
