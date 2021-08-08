from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250)
    url = models.URLField(blank=True,null=True)
    image = models.ImageField(blank=True,null=True)

    def __str__(self):
        return f"{self.name}"