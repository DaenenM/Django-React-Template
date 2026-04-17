import os
from pathlib import Path

# BASE_DIR is the root of the backend folder (one level above this file).
# Used to build absolute file paths like BASE_DIR / 'db.sqlite3'.
BASE_DIR = Path(__file__).resolve().parent.parent

# os.environ.get(key, default) reads the value from the .env file (or system environment).
# If the variable isn't set, the default value is used instead.

# SECRET_KEY is used by Django to sign cookies, sessions, and tokens. Keep it secret in production.
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me-in-production')

# DEBUG=True shows detailed error pages. Always set to False in production.
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS lists domains Django will serve. Prevents HTTP Host header attacks.
# The env var is a comma-separated string, so we split it into a list.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


INSTALLED_APPS = [
    'django.contrib.admin',        # /admin/ dashboard
    'django.contrib.auth',         # Django's built-in user/session auth system
    'django.contrib.contenttypes', # tracks all model types (required by many Django internals)
    'django.contrib.sessions',     # server-side session storage
    'django.contrib.messages',     # one-time flash messages
    'django.contrib.staticfiles',  # serves CSS/JS/images
    'rest_framework',              # Django REST Framework — adds @api_view, Response, etc.
    'corsheaders',                 # allows the React frontend (different port) to call our API
    'api',                         # our app — contains views.py, urls.py, firebase.py
]

# MIDDLEWARE is a list of functions that process every request and response in order.
# Think of it as a pipeline — each middleware can inspect, modify, or reject the request.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',              # must be first — adds CORS headers to responses
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',          # protects against cross-site request forgery
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'  # tells Django where to find the top-level URL patterns

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Django still needs a relational database even though we use Firestore for app data.
# It's used for Django's own tables: sessions, admin, auth (if you use Django users).
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True   # enables Django's translation framework
USE_TZ = True     # stores datetimes as UTC in the database

STATIC_URL = 'static/'

# CORS — Cross-Origin Resource Sharing.
# Browsers block requests from one origin (localhost:5173) to another (localhost:8000) by default.
# Listing the React dev server here tells the browser it's allowed.
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://localhost:3000'
).split(',')

# REST Framework global settings.
# AllowAny means all API endpoints are publicly accessible by default.
# To protect an endpoint, call verify_firebase_token() inside the view function.
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}
