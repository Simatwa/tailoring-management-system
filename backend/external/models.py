from django.db import models
from django.utils.translation import gettext_lazy as _
from enum import Enum
from tailoring_ms.utils import generate_document_filepath, EnumWithChoices
from django.utils import timezone

# Create your models here.


class About(models.Model):
    name = models.CharField(
        max_length=40, help_text="The brand name", default="Tailoring MS"
    )
    short_name = models.CharField(
        max_length=30, help_text="Brand abbreviated name", default="TMS"
    )
    slogan = models.TextField(
        help_text=_("Brands's slogan"),
        default="Experience the art of custom tailoring with precision and style.",
    )
    details = models.TextField(
        help_text=_("Brand details"),
        default="Welcome to Tailoing MS. We are committed to providing the best tailoring services.",
        null=False,
        blank=False,
    )
    address = models.CharField(
        max_length=200,
        help_text=_("Business address"),
        default="123 Fashion Street, Meru - Kenya",
    )

    founded_in = models.DateField(
        help_text=_("Date when the business was founded"), default=timezone.now
    )
    email = models.EmailField(
        max_length=50,
        help_text="Website's admin email",
        null=True,
        blank=True,
        default="admin@tailorinms.com",
    )
    phone_number = models.CharField(
        max_length=50,
        help_text="Business' hotline number",
        null=True,
        blank=True,
        default="0200000000",
    )
    facebook = models.URLField(
        max_length=100,
        help_text=_("Business' Facebook profile link"),
        null=True,
        blank=True,
        default="https://www.facebook.com/",
    )
    twitter = models.URLField(
        max_length=100,
        help_text=_("Business' X (formerly Twitter) profile link"),
        null=True,
        blank=True,
        default="https://www.x.com/",
    )
    linkedin = models.URLField(
        max_length=100,
        help_text=_("Business' Facebook profile link"),
        null=True,
        blank=True,
        default="https://www.linkedin.com/",
    )
    instagram = models.URLField(
        max_length=100,
        help_text=_("Business' Instagram profile link"),
        null=True,
        blank=True,
        default="https://www.instagram.com/",
    )
    tiktok = models.URLField(
        max_length=100,
        help_text=_("Business' Tiktok profile link"),
        null=True,
        blank=True,
        default="https://www.tiktok.com/",
    )
    youtube = models.URLField(
        max_length=100,
        help_text=_("Business' Youtube profile link"),
        null=True,
        blank=True,
        default="https://www.youtube.com/",
    )
    logo = models.ImageField(
        help_text=_("Hospital logo  (preferrably 64*64px png)"),
        upload_to=generate_document_filepath,
        default="default/logo.png",
    )
    wallpaper = models.ImageField(
        help_text=_("Hospital wallpaper image"),
        upload_to=generate_document_filepath,
        default="default/threads-5547529_1920.jpg",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the business' details was created"),
    )

    def __str__(self):
        return self.name


class ServiceFeedback(models.Model):
    class FeedbackRate(EnumWithChoices):
        EXCELLENT = "Excellent"
        GOOD = "Good"
        AVERAGE = "Average"
        POOR = "Poor"
        TERRIBLE = "Terrible"

    class SenderRole(EnumWithChoices):
        EXECUTIVE = "Business Executive"
        REGULAR_CLIENT = "Regular Client"
        WEDDING_CLIENT = "Wedding Client"

    sender = models.ForeignKey(
        "users.CustomUser", on_delete=models.CASCADE, help_text=_("Feedback sender")
    )
    message = models.TextField(help_text=_("Response body"))
    rate = models.CharField(
        max_length=15, choices=FeedbackRate.choices(), help_text=_("Feedback rating")
    )
    role = models.CharField(
        max_length=40,
        help_text=_("Sender's role/category"),
        choices=SenderRole.choices(),
        default=SenderRole.REGULAR_CLIENT.value,
    )
    show_in_index = models.BooleanField(
        default=True,
        help_text=_("Display this feedback in website's testimonials section."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
    )

    class Meta:
        verbose_name = _("Feedback")
        verbose_name_plural = _("Feedbacks")

    def __str__(self):
        return f"{self.rate} feedback from {self.sender}"


class Message(models.Model):
    sender = models.CharField(
        verbose_name=_("Sender"),
        max_length=50,
        help_text=_("Sender's name"),
    )
    email = models.EmailField(
        verbose_name=_("Email"), max_length=80, help_text=_("Sender's email address")
    )
    body = models.TextField(verbose_name=_("Message"), help_text=_("Message body"))
    is_read = models.BooleanField(
        verbose_name=_("Is read"), help_text=_("Message read status")
    )
    created_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Created at"),
        help_text=_("Date and time when message was received."),
    )

    def __str__(self):
        return f"from {self.sender} at {self.created_at.strftime("%d-%b-%Y %H:%M:%S")}"


class FAQ(models.Model):
    question = models.CharField(
        verbose_name=_("Question"), max_length=100, help_text=_("The question")
    )
    answer = models.TextField(
        verbose_name=_("Answer"), help_text=_("Answer to the question")
    )
    is_shown = models.BooleanField(
        verbose_name="Is shown", help_text=_("Show this FAQ in website"), default=True
    )
    created_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Created at"),
        help_text=_("Date and time when FAQ was received."),
    )

    def __str__(self):
        return self.question
