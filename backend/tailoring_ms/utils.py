from enum import Enum

from os import path

from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta


def generate_document_filepath(instance, filename: str) -> str:
    filename, extension = path.splitext(filename)
    return f"{instance.__class__.__name__.lower()}/{filename}_{instance.id or ''}{extension}"


def send_email(subject: str, message: str, recipient: str, html_message: str = None):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient],
        fail_silently=(settings.DEBUG == False),  # Silent in production
        html_message=html_message,
    )


def get_expiry_datetime(minutes: float = 30) -> datetime:
    return timezone.now() + timedelta(minutes=minutes)


class EnumWithChoices(Enum):

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
