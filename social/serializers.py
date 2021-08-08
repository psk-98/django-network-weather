from django.db.models import fields
from rest_framework import serializers
from .models import Post, Follow, Comment
from django.contrib.auth.models import User

# filter the user info passed
class PostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField("get_comments")
    
    class Meta:
        model = Post
        depth = 1
        fields = '__all__'
    
    def get_comments(self, post_object):
        return Comment.objects.filter(post=post_object).count()
    
class LikeSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Post
        depth = 1
        fields = ['id']

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.SerializerMethodField("get_follower")
    followe = serializers.SerializerMethodField("get_followe")
    
    class Meta:
        model = Follow
        fields = ['follower', 'followe']

    def get_followe(self, follow_object):
        user = User.objects.get(id=follow_object.following.id)
        serializer = ProfileSerializer(user)
        return serializer.data

    def get_follower(self, follow_object):
        user = User.objects.get(id=follow_object.user.id)
        serializer = ProfileSerializer(user)
        return serializer.data

class FollowersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields ='__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        depth = 2
        fields = ['id', 'body', 'created', 'created', 'author', 'like']

class LikeCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['id']

