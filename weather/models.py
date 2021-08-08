from django.db import models
from django.conf import settings


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    country = models.CharField(max_length=15)

    def __str__(self):
        return f'{self.user} likes id:{self.pk} {self.name},{self.country}'