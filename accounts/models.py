from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    avatar = models.ImageField(default='profile_pic1.png', blank=True, null=True)
    header =  models.ImageField(default='orange.jpg', blank=True, null=True)
    bio = models.CharField(null=True, blank=True, max_length=256)

    def __str__(self):
        return self.user.username

User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False