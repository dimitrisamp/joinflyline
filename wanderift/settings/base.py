"""
Django settings for wanderift project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""
import json

import dotenv

dotenv.load_dotenv()

import os

from django.contrib.messages import constants as messages

STAGE = os.getenv("STAGE", "production")

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "xoan3p&w(wt2(f5&97u4i$5qks@@vy%6mlu$a=qb4#ddy9l_-l"

ALLOWED_HOSTS = ["0.0.0.0", "127.0.0.1", "localhost", "*"]

# Application definition

INSTALLED_APPS = [
    # 'django_extensions',
    # "suit",
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
    "maintenancemode",
    "rest_framework",
    "django_filters",
    "knox",
    # My apps
    "apps.subscriptions.apps.SubscriptionsConfig",
    "apps.home",
    "apps.account.apps.AccountConfig",
    "apps.booking",
    "apps.oauth",
    "apps.emails",
    "apps.common",
    "anymail",
    "compressor",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "maintenancemode.middleware.MaintenanceModeMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "wanderift.urls"

MAINTENANCE_MODE = (
    os.getenv("MAINTENANCE_MODE").strip().lower() == "true"
    if os.getenv("MAINTENANCE_MODE")
    else False
)

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
                "apps.common.context_processors.common.common_processor",
            ],
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

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "compressor.finders.CompressorFinder",
]

COMPRESS_PRECOMPILERS = (("text/x-scss", "django_libsass.SassCompiler"),)

# graph_models --pydot -a -g -o my_project_visualized.png

MESSAGE_TAGS = {messages.ERROR: "", 40: "danger"}

MEDIA_ROOT = os.path.join(BASE_DIR, "static/images")
MEDIA_URL = "/images/"

LOGIN_REDIRECT_URL = "accounts"
LOGIN_URL = "/sign-in"
RECEIVE_EMAIL = "bookings@joinflyline.com"
RECEIVE_PHONE = "+18105131533"
KIWI_API_KEY = "4TMnq4G90OPMYDAGVHzlP9LQo2hvzzdc"
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
PLANS_DEFINITION_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "plans.json")
PLANS_CONFIG_FILE = os.getenv(
    "PLANS_CONFIG_FILE",
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "plan-stipe.json"),
)
try:
    SUBSCRIPTION_PLANS = json.load(open(PLANS_CONFIG_FILE))
except:
    SUBSCRIPTION_PLANS = {}

try:
    PLAN_DEFINITIONS = json.load(open(PLANS_DEFINITION_FILE))
except:
    PLAN_DEFINITIONS = {}

SENTRY_DSN = "https://a875b98b313142d8afd40797b84f235e@sentry.io/1773547"
SENDGRID_API_KEY = (
    "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"
)

SUBSCRIBER_AIRLINES = {
    "AA",  # American
    "DL",  # Delta
    "UA",  # United
    "WN",  # Southwest
    "B6",  # jetBlue
    "SY",  # Sun Country
}
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

SECRET_LINK_EXPIRATION_SECONDS = 3600

CELERY_BROKER_URL = (os.getenv("REDIS_URL"),)
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL")
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
SITE_URL = os.getenv("SITE_URL", "https://joinflyline.com")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "knox.auth.TokenAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
}

REST_PROXY = {
    'HOST': 'https://kiwicom-prod.apigee.net',
    'AUTH': {
        'user': None,
        'password': None,
        'apikey': KIWI_API_KEY,
    },
}
