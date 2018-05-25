from django.db import models

class Flag(models.Model):
  flag = models.CharField(max_length=50)
