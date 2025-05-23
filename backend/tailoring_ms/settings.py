"""
Django settings for Hospital_ms project.

Generated by 'django-admin startproject' using Django 5.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
import dotenv
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.templatetags.static import static

dotenv.load_dotenv()

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "SECRET_KEY", "django-insecure-r5#6f#%e5m@d1wc#&7(pxa_kxdwk!_qmki)f7g=!l37sjo*kv_"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "0") == "1"

ALLOWED_HOSTS = [host.strip() for host in os.getenv("ALLOWED_HOSTS", "*").split(",")]


# Application definition

INSTALLED_APPS = [
    # "jazzmin",
    "unfold",  # before django.contrib.admin
    "unfold.contrib.filters",  # optional, if special filters are needed
    "unfold.contrib.forms",  # optional, if special form elements are needed
    "unfold.contrib.inlines",  # optional, if special inlines are needed
    "unfold.contrib.import_export",  # optional, if django-import-export package is used
    # "unfold.contrib.guardian",  # optional, if django-guardian package is used
    # "unfold.contrib.simple_history",  # optional, if django-simple-history package is used
    "import_export",
    "corsheaders",
    "users.apps.UsersConfig",
    "tailoring.apps.TailoringConfig",
    "external.apps.ExternalConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
]

ROOT_URLCONF = "tailoring_ms.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "tailoring_ms.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

try:
    import pymysql

    pymysql.install_as_MySQLdb()
except ImportError:
    # Still okay maybe other engines are set.
    pass

DATABASES = {
    "default": {
        "ENGINE": os.getenv("DATABASE_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.getenv("DATABASE_NAME", BASE_DIR / "db.sqlite3"),
        "USER": os.getenv("DATABASE_USER", "developer"),
        "PASSWORD": os.getenv("DATABASE_PASSWORD", "development"),
        "HOST": os.getenv("DATABASE_HOST", "localhost"),
        "PORT": os.getenv("DATABASE_PORT", "3306"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Email configuration

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = os.getenv(
    "EMAIL_HOST", "smtp.gmail.com"
)  # Replace with your email provider's SMTP server
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))  # or 25 for non-TLS
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", True)  # Use TLS encryption
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")  # Your full email address
EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_HOST_PASSWORD"
)  # Your email password or app-specific password
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")  # Optional: default sender email


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = os.getenv("TIME_ZONE", "Africa/Nairobi")

USE_I18N = True

USE_TZ = True


LANGUAGES = (
    ("de", _("German")),
    ("en", _("English")),
    ("fr", _("French")),
    ("sw", _("Swahili")),
)

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost.*",
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"

files_root = BASE_DIR / "files"

STATIC_ROOT = files_root / "static"

MEDIA_URL = "/media/"

MEDIA_ROOT = files_root / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.CustomUser"

FRONTEND_DIR = (
    # None
    BASE_DIR
    / "../frontend/dist.ready"
    # Path("/home/smartwa/Projects/tms/project/dist")  #
)

SITE_NAME = os.getenv("SITE_NAME", "Tailoring MS")

SITE_ADDRESS = os.getenv("SITE_ADDRESS", "http://localhost:8000")

UNFOLD = {
    "SITE_TITLE": SITE_NAME,
    "SITE_HEADER": f"{SITE_NAME}",
    "SITE_SUBHEADER": "TMS",
    "SITE_DROPDOWN": [
        {
            "icon": "support_agent",
            "title": _("Support"),
            "link": "https://github.com/Simatwa/tailoring-management-system",
        },
        {
            "icon": "language",
            "title": _("Index"),
            "link": "/",
        },
        # ...
    ],
    "SITE_URL": "/",
    "SITE_ICON--": lambda request: static(
        "tailoring/img/logo.png"
    ),  # both modes, optimise for 32px height
    "SITE_LOGO--": lambda request: static(
        "tailoring/img/logo.png"
    ),  # both modes, optimise for 32px height
    "SITE_SYMBOL": "content_cut",  # symbol from icon set
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "64x64",
            "type": "image/png",
            "href": lambda request: static("tailoring/img/logo.png"),
        },
    ],
    "SHOW_COUNTS": True,
    "SHOW_HISTORY": True,  # show/hide "History" button, default: True
    "SHOW_VIEW_ON_SITE": True,  # show/hide "View on site" button, default: True
    "SHOW_BACK_BUTTON": True,  # show/hide "Back" button on changeform in header, default: False
    "SHOW_LANGUAGES": True,
    # "ENVIRONMENT": "sample_app.environment_callback", # environment name in header
    # "ENVIRONMENT_TITLE_PREFIX": "sample_app.environment_title_prefix_callback", # environment name prefix in title tag
    # "DASHBOARD_CALLBACK": "sample_app.dashboard_callback",
    # "THEME": "dark", # Force theme: "dark" or "light". Will disable theme switcher
    "LOGIN": {
        "image": lambda request: "/media/default/threads-5547529_1920.jpg",
        # "redirect_after": lambda request: reverse_lazy("admin:APP_MODEL_changelist"),
    },
    "STYLES": [
        # lambda request: static("css/style.css"),
    ],
    "SCRIPTS": [
        # lambda request: static("js/script.js"),
    ],
    "BORDER_RADIUS": "6px",
    "COLORS": {
        "base": {
            "50": "249 250 251",
            "100": "243 244 246",
            "200": "229 231 235",
            "300": "209 213 219",
            "400": "156 163 175",
            "500": "107 114 128",
            "600": "75 85 99",
            "700": "55 65 81",
            "800": "31 41 55",
            "900": "17 24 39",
            "950": "3 7 18",
        },
        "primary": {
            "50": "250 245 255",
            "100": "243 232 255",
            "200": "233 213 255",
            "300": "216 180 254",
            "400": "192 132 252",
            "500": "168 85 247",
            "600": "147 51 234",
            "700": "126 34 206",
            "800": "107 33 168",
            "900": "88 28 135",
            "950": "59 7 100",
        },
        "font": {
            "subtle-light": "var(--color-base-500)",  # text-base-500
            "subtle-dark": "var(--color-base-400)",  # text-base-400
            "default-light": "var(--color-base-600)",  # text-base-600
            "default-dark": "var(--color-base-300)",  # text-base-300
            "important-light": "var(--color-base-900)",  # text-base-900
            "important-dark": "var(--color-base-100)",  # text-base-100
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇬🇧",
                "fr": "🇫🇷",
                "de": "🇧🇪",
                "sw": "🇰🇪",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,  # Search in applications and models names
        "show_all_applications": True,  # Dropdown with all applications and models
        "navigation": [
            {
                "title": _("Navigation"),
                "separator": True,  # Top border
                "collapsible": False,  # Collapsible group of links
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",  # Supported icon set: https://fonts.google.com/icons
                        "link": reverse_lazy("admin:index"),
                        # "badge": "sample_app.badge_callback",
                        "permission": lambda request: request.user.is_staff,
                    },
                ],
            },
            {
                "title": _("Users & Groups"),
                "separator": True,  # Top border
                "collapsible": True,  # Collapsible group of links
                "items": [
                    {
                        "title": _("Users"),
                        "icon": "manage_accounts",  # Supported icon set: https://fonts.google.com/icons
                        "link": reverse_lazy("admin:users_customuser_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                    {
                        "title": _("Groups"),
                        "icon": "group",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                ],
            },
            {
                "title": _("Tailoring"),
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": _("Services"),
                        "icon": "linked_services",
                        "link": reverse_lazy("admin:tailoring_service_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                    {
                        "title": _("Orders"),
                        "icon": "orders",
                        "link": reverse_lazy("admin:tailoring_order_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                ],
            },
            {
                "title": _("External"),
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": _("Abouts"),
                        "icon": "info",
                        "link": reverse_lazy("admin:external_about_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                    {
                        "title": _("Feedbacks"),
                        "icon": "chat",
                        "link": reverse_lazy(
                            "admin:external_servicefeedback_changelist"
                        ),
                        "permission": lambda request: request.user.is_staff,
                    },
                    {
                        "title": _("Messages"),
                        "icon": "mark_email_unread",
                        "link": reverse_lazy("admin:external_message_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                    {
                        "title": _("FAQs"),
                        "icon": "live_help",
                        "link": reverse_lazy("admin:external_faq_changelist"),
                        "permission": lambda request: request.user.is_staff,
                    },
                ],
            },
        ],
    },
    "TABS": [],
}
