# django-react

## Recreation Steps

Create directory
```
mkdir django-react && cd $_
```

Create virtual environment
```
pipenv --three
```

Install django and drf
```
pipenv install django djangorestframework
```

Start env shell
```
pipenv shell
```

Start project
```
django-admin startproject vanilla
```

Start flag-checker app
```
cd vanilla
django-admin startapp flagChecker
```

Change `vanilla/settings.py` to
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'flagChecker', # adding the flagChecker app
]
```

Change `flagChecker/models.py` to
```
from django.db import models

class Flag(models.Model):
  flag = models.CharField(max_length=50)
```

Model in place, create migration and migrate
```
python manage.py makemigrations flagChecker
python manage.py migrate
```

Create serializers 
```
touch flagChecker/serializers.py
```

Change `flagChecker/serializers.py` to
```
from rest_framework import serializers
from flagChecker.models import Flag     

class FlagSerializer(serializers.ModelSerializer):
  class Meta:
    model = Flag
    fields = '__all__'
```

Change `flagChecker/views.py` to
```
from django.shortcuts import render
from flagChecker.models import Flag
from flagChecker.serializers import FlagSerializer
from rest_framework import generics

class FlagCreate(generics.ListCreateAPIView):
  queryset = Flag.objects.all()
  serializer_class = FlagSerializer
```

Change `vanilla/urls.py` to
```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
  path('admin/', admin.site.urls),
]

urlpatterns = [
  path('', include('flagChecker.urls')),
]
```

Configure URL mapping by creating `urls.py` in app
```
touch flagChecker/urls.py
```

Change `flagChecker/urls.py` to
```
from django.urls import path
from . import views

urlpatterns = [
  path('api/flags/', views.FlagCreate.as_view() ),
]
```

Change `vanilla/settings/py` to
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'flagChecker', # adding the flagChecker app
    'rest_framework', # enable rest framework
]
```

Now run `python manage.py runserver` and browse to http://localhost:8000/api/flags/ to see the browseable API.


Create fixtures for temp data
```
mkdir flagChecker/fixtures
touch flagChecker/fixtures/flags.json
```

Change `flagChecker/fixtures/flags.json` to
```
[
  {
    "model": "flagChecker.flag",
    "pk": "1",
    "fields": {
      "flag": "testflag"
    }
  }
]
```

Load data
```
python manage.py loaddata flags
```

Run again and should be able to see temp data
```
python manage.py runserver
```

Browse to http://localhost:8000/api/flags/ 
