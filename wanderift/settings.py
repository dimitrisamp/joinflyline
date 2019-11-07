"""
Django settings for wanderift project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""
import dotenv

dotenv.load_dotenv()

import os

from django.contrib.messages import constants as messages

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

STAGE = os.getenv("STAGE", "production")

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "xoan3p&w(wt2(f5&97u4i$5qks@@vy%6mlu$a=qb4#ddy9l_-l"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["0.0.0.0", "127.0.0.1", "localhost", "*"]

# Application definition

INSTALLED_APPS = [
    # 'django_extensions',
    "suit",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    # 3rd party libs
    "spurl",
    "django_extensions",
    # My apps
    "apps.construction",
    "apps.subscriptions.apps.SubscriptionsConfig",
    "apps.payments",
    "apps.home",
    "apps.results",
    "apps.corporate",
    "apps.account",
    "apps.booking",
    "apps.oauth",
    "apps.info",
    "apps.emails",
    "apps.common",
    "anymail",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "wanderift.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "apps.common.context_processors.user.user_processor",
            ],
            "libraries": {
                "airlines": "apps.results.templatetags.airlines",
                "aircons": "apps.results.templatetags.airline_icons",
                "comparison": "apps.results.templatetags.comparison",
                "return_flight": "apps.results.templatetags.return_flight",
                "departure_flight": "apps.results.templatetags.departure_flight",
            },
        },
    }
]

# django-suits
SUIT_CONFIG = {
    # header
    "ADMIN_NAME": "Django Suit",
    "HEADER_DATE_FORMAT": "l, j. F Y",
    "HEADER_TIME_FORMAT": "H:i",
    # forms
    "SHOW_REQUIRED_ASTERISK": True,  # Default True
    "CONFIRM_UNSAVED_CHANGES": True,  # Default True
    # menu
    "SEARCH_URL": "/admin/auth/user/",
    "MENU_ICONS": {"sites": "icon-leaf", "auth": "icon-lock"},
    "MENU_OPEN_FIRST_CHILD": True,  # Default True
    "MENU_EXCLUDE": ("auth.group",),
    "MENU": (
        "sites",
        {"app": "auth", "icon": "icon-lock", "models": ("user", "group")},
        {
            "label": "Settings",
            "icon": "icon-cog",
            "models": ("auth.user", "auth.group"),
        },
        {"label": "Support", "icon": "icon-question-sign", "url": "/support/"},
    ),
    # misc
    "LIST_PER_PAGE": 15,
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("POSTGRES_HOST"),
        "PORT": os.getenv("POSTGRES_PORT", 5432),
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = False

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_ROOT = ""

STATIC_URL = "/static/"

STATICFILES_DIRS = (os.path.join("static"),)

# graph_models --pydot -a -g -o my_project_visualized.png

MESSAGE_TAGS = {messages.ERROR: "", 40: "danger"}

MEDIA_ROOT = os.path.join(BASE_DIR, "static/images")
MEDIA_URL = "/images/"

LOGIN_REDIRECT_URL = "accounts"
LOGIN_URL = "/sign-in"
RECEIVE_EMAIL = "bookings@wanderift.com"
RECEIVE_PHONE = "+18105131533"
KIWI_API_KEY = "4TMnq4G90OPMYDAGVHzlP9LQo2hvzzdc"
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
SENTRY_DSN = "https://a875b98b313142d8afd40797b84f235e@sentry.io/1773547"

if STAGE == "production":
    sentry_sdk.init(dsn=SENTRY_DSN, integrations=[DjangoIntegration()])
    DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    GS_BUCKET_NAME = "joinflyline"
    GS_DEFAULT_ACL = "publicRead"
    GS_CACHE_CONTROL = "max-age=120"
    MEDIA_ROOT = "media"
    DEBUG = False

SITE_TITLE = "Wanderift | Airline Travel Subscription | Save on Retail Flights"
SUBSCRIBER_AIRLINES = {
    "AA",  # American
    "DL",  # Delta
    "UA",  # United
    "WN",  # Southwest
    "B6",  # jetBlue
    "SY",  # Sun Country
}
SENDGRID_API_KEY = (
    "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"
)
PRICE_LIMIT_SUBSCRIBER = 350

SITEMAP_FILE = os.path.join(BASE_DIR, "wanderift", "sitemap.xml")
ROBOTS_TXT = os.path.join(BASE_DIR, "wanderift", "robots.txt")

DATE_FORMAT = "m/d/Y"
DATE_INPUT_FORMATS = ["%Y-%m-%d", "%m/%d/%Y"]

ANYMAIL = {
    "SENDGRID_API_KEY": "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"
}

SENDGRID_API_URL = "https://api.sendgrid.com/v3/"
EMAIL_BACKEND = "anymail.backends.sendgrid.EmailBackend"
DEFAULT_FROM_EMAIL = "noreply@joinflyline.com"
SERVER_EMAIL = "noreply@joinflyline.com"

SECRET_LINK_EXPIRATION_SECONDS=3600

SITE_URL = os.getenv('SITE_URL', 'https://joinflyline.com')
