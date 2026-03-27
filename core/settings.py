from pathlib import Path
import os
from datetime import timedelta

# Estructura de directorios base
BASE_DIR = Path(__file__).resolve().parent.parent

# SEGURIDAD: En producción, esto debe venir de una variable de entorno
SECRET_KEY = 'django-insecure-7cm42$vupg7b^hl2=fkyf*b^dcbf2*r@yq&=lyv5n!8y$x2v1f' 

DEBUG = True # Cambiar a False en producción

ALLOWED_HOSTS = []

# DEFINICIÓN DEL MODELO DE USUARIO CUSTOM (Etapa 1 SaaS)
# Esto le dice a Django y a JWT que usen tu tabla 'usuarios' con 'rol' y 'negocio'
AUTH_USER_MODEL = 'backend.Usuario'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Librerías externas
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt', # Añadido para manejo de tokens
    
    # Tu aplicación
    'backend', 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Prioridad para peticiones desde React
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls' #

# CONFIGURACIÓN DRF & SIMPLE JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', # Cerramos el sistema por defecto
    ),
}

# Configuración detallada de JWT para máxima seguridad SaaS
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True, # Seguridad: cambia el refresh token en cada uso
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

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

WSGI_APPLICATION = 'core.wsgi.application' #

# Base de datos local
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Validación de contraseñas (Estándar de Django)
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# INTERNACIONALIZACIÓN (Configurado para tu región)
LANGUAGE_CODE = 'es-ve' 
TIME_ZONE = 'America/Caracas'
USE_I18N = True
USE_TZ = True

# ARCHIVOS ESTÁTICOS
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CONFIGURACIÓN CORS (React App)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True