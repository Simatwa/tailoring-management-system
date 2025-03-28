from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from uuid import uuid4
from os import path
from django.core.validators import FileExtensionValidator
from enum import Enum
from datetime import datetime
from django.core.validators import RegexValidator

# Create your models here.


def generate_profile_filepath(instance: "CustomUser", filename: str) -> str:
    custom_filename = str(uuid4()) + path.splitext(filename)[1]
    return f"user_profile/{instance.id}{custom_filename}"


class CustomUser(AbstractUser):
    """Both indiduals and organizations"""

    class UserGender(Enum):
        MALE = "M"
        FEMALE = "F"
        OTHER = "O"

        @classmethod
        def choices(cls) -> list[tuple]:
            return [(key.value, key.name) for key in cls]

    gender = models.CharField(
        verbose_name=_("gender"),
        max_length=10,
        help_text=_("Select one"),
        choices=UserGender.choices(),
        default=UserGender.OTHER.value,
    )

    phone_number = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message=_(
                    "Phone number must be entered in the format: '+254...' or '07...'. Up to 15 digits allowed."
                ),
            )
        ],
        help_text=_("Contact phone number"),
        blank=True,
        null=True,
    )

    location = models.CharField(
        max_length=50, help_text=_("Current location address"), null=True, blank=True
    )

    profile = models.ImageField(
        _("Profile Picture"),
        default="default/user.png",
        upload_to=generate_profile_filepath,
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])],
        blank=True,
        null=True,
    )

    token = models.CharField(
        _("token"),
        help_text=_("Token for validation"),
        null=True,
        blank=True,
        max_length=40,
        unique=True,
    )

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def age(self):
        today = datetime.today().date()
        return (
            today.year
            - self.date_of_birth.year
            - (
                (today.month, today.day)
                < (self.date_of_birth.month, self.date_of_birth.day)
            )
        )

    def __str__(self):
        return self.username


class UserMeasurements(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="measurements",
        verbose_name=_("user"),
    )
    chest = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Chest measurement in inches")
    )
    waist = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Waist measurement in inches")
    )
    hips = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Hips measurement in inches")
    )
    inseam = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Inseam measurement in inches")
    )
    neck = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Neck measurement in inches")
    )
    sleeve_length = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Sleeve length in inches")
    )
    shoulder_width = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Shoulder width in inches")
    )
    thigh = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Thigh measurement in inches")
    )
    calf = models.DecimalField(
        max_digits=5, decimal_places=2, help_text=_("Calf measurement in inches")
    )
    date_created = models.DateTimeField(
        auto_now_add=True, verbose_name=_("date created")
    )
    date_updated = models.DateTimeField(auto_now=True, verbose_name=_("date updated"))

    class Meta:
        verbose_name = _("Measurement")
        verbose_name_plural = _("Measurements")

    def __str__(self):
        return f"Measurements for {self.user.username}"
