from django.db import models
from django.conf import settings

# Create your models here.

#change on user delete
class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.CharField(max_length=280, blank=False, null=False)
    created = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True,
                                  null=True, related_name="likes")
    
    def __str__(self):
        return f"{self.id} {self.author} posted {self.body}"

class Follow(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    following = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE ,
                                    related_name="followers" ,null=True, blank=True)

    def __str__(self):
        return f"{self.user} follows {self.following}"
    
    def is_valid_follow(self):
       return self.user != self.following

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,blank=True,null=True)
    body = models.CharField(max_length=280, blank=False, null=False)
    created = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True,
                                   null=True, related_name="com_likes")
    post = models.ForeignKey(Post,on_delete=models.CASCADE, blank=True,
                                  null=True)
    def __str__(self):
        return f"{self.id} {self.author} posted {self.body}"