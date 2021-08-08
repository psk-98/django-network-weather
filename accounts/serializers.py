from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from social.models import Comment, Follow
from social.serializers import CommentSerializer, FollowSerializer, LikeSerializer, LikeCommentSerializer
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'avatar', 'header']
  
class UserSerializer(serializers.ModelSerializer):
    follows = serializers.SerializerMethodField('get_following')
    followers = serializers.SerializerMethodField('get_followers')
    profile = serializers.SerializerMethodField('get_profile')
    liked = serializers.SerializerMethodField('posts_liked')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'follows', 
                'followers' ,'profile', 'date_joined', 'liked']
    
    def get_following(self, user_object):
        Folowing = Follow.objects.filter(user=user_object).all()
        serializer = FollowSerializer(Folowing, many=True)
        return serializer.data
    
    def get_followers(self, user_object):
        Folowing = Follow.objects.filter(following=user_object).all()
        serializer = FollowSerializer(Folowing, many=True)
        return serializer.data

    def get_profile(self, user_object):
        profile = Profile.objects.get(user=user_object)
        serializer = ProfileSerializer(profile)
        return serializer.data

    def posts_liked(self, user_object):
        user = User.objects.get(pk = user_object.pk)
        posts = user.likes.all()
        serializer = LikeSerializer(posts, many=True) 
        return serializer.data

    


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")