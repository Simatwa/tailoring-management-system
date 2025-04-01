from django.db import models
from users.models import CustomUser
from tailoring_ms.utils import EnumWithChoices, generate_document_filepath
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Service(models.Model):
    class ServiceName(EnumWithChoices):
        CUSTOM_SUITS = "Custom Suits"
        WEDDING_ATTIRE = "Wedding Attire"
        ALTERATIONS = "Alterations"
        EMBROIDERY = "Embroidery"
        UNIFORMS = "Uniforms"
        OTHER = "Other"

    name = models.CharField(
        verbose_name=_("Name"),
        max_length=100,
        help_text=_("Service name"),
        choices=ServiceName.choices(),
        unique=True,
    )
    description = models.TextField(
        verbose_name=_("Description"), help_text=_("What about this service?")
    )
    picture = models.ImageField(
        verbose_name=_("Picture"),
        help_text=_("Album photo for the service"),
        default="default/tape-measure-3829506_1920.jpg",
        upload_to=generate_document_filepath,
    )
    starting_price = models.DecimalField(
        verbose_name=_("Starting price"),
        max_digits=8,
        decimal_places=2,
        help_text=_("Starting price in Ksh"),
        default=1000,
    )
    ending_price = models.DecimalField(
        verbose_name=_("Ending price"),
        max_digits=8,
        decimal_places=2,
        help_text=_("Ending price in Ksh"),
        default=15000,
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text=_("Date and time when the service was created")
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text=_("Date and time when the service was created")
    )

    class Meta:
        verbose_name = _("Service")
        verbose_name_plural = _("Services")

    def __str__(self):
        return self.name


class Order(models.Model):
    class OrderUrgency(EnumWithChoices):
        LOW = "Low"
        MEDIUM = "Medium"
        HIGH = "High"

    class MaterialType(EnumWithChoices):
        COTTON = "Cotton"
        SILK = "Silk"
        WOOL = "Wool"
        POLYESTER = "Polyester"
        LINEN = "Linen"
        OTHER = "Other"

    class OrderStatus(EnumWithChoices):
        PENDING = "Pending"
        IN_PROGRESS = "In Progress"
        COMPLETED = "Completed"
        CANCELLED = "Cancelled"

    client = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        help_text=_("The client who placed the order."),
        related_name="orders",
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        verbose_name=_("Service"),
        help_text=_("Order service"),
        related_name="orders",
    )
    details = models.TextField(help_text=_("Order description"))
    material_type = models.CharField(
        max_length=10,
        choices=MaterialType.choices(),
        help_text=_("The type of material required for the order."),
    )
    fabric_required = models.BooleanField(
        default=False,
        help_text=_("Indicates if fabric is required for the order."),
    )
    quantity = models.PositiveIntegerField(
        help_text=_("The quantity of items in the order."),
        default=1,
    )
    reference_image = models.ImageField(
        verbose_name=_("Reference"),
        help_text=_("Reference image for design/inspiration"),
        upload_to=generate_document_filepath,
        null=True,
        blank=True,
    )
    colors = models.CharField(
        verbose_name=_("Colors"),
        max_length=200,
        help_text=_("Desired material color"),
        null=True,
        blank=True,
    )
    urgency = models.CharField(
        max_length=6,
        choices=OrderUrgency.choices(),
        default=OrderUrgency.MEDIUM.value,
        help_text=_("The urgency level of the order."),
    )
    charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_("The total charges of the order in Ksh."),
    )
    charges_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        default=0,
        help_text=_("Amount of the total charges paid in Ksh."),
    )
    status = models.CharField(
        max_length=12,
        choices=OrderStatus.choices(),
        default=OrderStatus.PENDING.value,
        help_text=_("The current status of the order."),
    )
    picture = models.ImageField(
        help_text=_("Photo of the finished clothe."),
        default="default/27002.jpg",
        null=False,
        blank=True,
        upload_to=generate_document_filepath,
    )
    show_in_index = models.BooleanField(
        verbose_name=_("Show in index"),
        default=True,
        help_text=_("Display this order in 'Latest work' section of the website"),
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text=_("Date and time when the order was updated")
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text=_("Date and time when the oder was placed")
    )

    def model_dump(self) -> dict:
        return dict(
            id=self.id,
            service_name=self.service.name,
            quantity=self.quantity,
            charges=self.charges,
            status=self.status,
            picture=self.picture.name,
            details=self.details,
            material_type=self.material_type,
            fabric_required=self.fabric_required,
            reference_image=(
                self.reference_image.name if self.reference_image is not None else None
            ),
            created_at=self.created_at,
            urgency=self.urgency,
            charges_paid=self.charges_paid,
            updated_at=self.updated_at,
        )

    class Meta:
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")

    def __str__(self):
        return f"{self.service.name} by {self.client} on {self.created_at.strftime("%d-%b-%Y")}"

    def delete(self, *args, **kwargs):
        if self.reference_image is not None:
            self.reference_image.delete(save=False)
        super().delete(*args, **kwargs)
