#!/bin/sh

echo "⏳ Aștept $DB_HOST:$DB_PORT..."
/wait-for-it.sh "$DB_HOST" "$DB_PORT" --timeout=60 --strict -- echo "✅ DB e gata"

echo "🧩 Migrez baza de date..."
python manage.py migrate --noinput

echo "📥 Creez UserType-uri de bază..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from api.models import UserType
for name in ['Proprietar', 'Administrator', 'Agent']:
    UserType.objects.get_or_create(type=name)
"

echo "👤 Creez superuser..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth import get_user_model
from api.models import UserType
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    role = UserType.objects.get(type='Administrator')
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123',
        user_type=role
    )
"

echo "🚀 Pornesc serverul..."
exec python manage.py runserver 0.0.0.0:8000
