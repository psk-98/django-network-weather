from django.shortcuts import render
from django.contrib.auth.models import User

from .models import Post, Follow, Comment

from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PostSerializer, FollowSerializer, CommentSerializer, FollowersSerializer
from accounts.serializers import UserSerializer, ProfileSerializer
from accounts.models import Profile

# Create your views here.
def index(request):
    return render(request, 'network/index.html')

@api_view(['GET'])
def all_posts(request):
    print(request)
    posts = Post.objects.order_by('-created').all()
    serializer = PostSerializer(posts, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def post(request, pk):
    print(request)
    post = Post.objects.get(pk=pk)
    serializer = PostSerializer(post, many=False)

    return Response(serializer.data)

@api_view(['GET'])
def user_posts(request, pk):
    print(request)
    user = User.objects.get(pk=pk)
    posts = Post.objects.filter(author=user).order_by('-created')
    serializer = PostSerializer(posts, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def liked_posts(request, pk):
    user = User.objects.get(pk=pk)
    posts = user.likes.all()
    serializer = PostSerializer(posts, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def new_post(request):
    #print(request.data)
    serializer = PostSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if serializer.is_valid(raise_exception = True):
        serializer.save(author = request.user)
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_post(request, pk):
    if Post.objects.filter(pk=pk,author=request.user).count == 0:
        post = Post.objects.get(pk=pk,author=request.user)
        serializer = PostSerializer(instance=post, data=request.data)
    
        if serializer.is_valid():
            serializer.save()

        return Response("was success")
    else:
        return Response("cant update post that is not yours")

@api_view(['DELETE'])
def delete_post(request,pk):

    post = Post.objects.get(author=request.user, pk=pk)
    post.delete()

    return Response("was success")

#profile
@api_view(['POST'])
def update_user(request):
    user = request.user
    serializer = UserSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer._errors)

@api_view(['POST'])
def update_profile(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    print(request.data)
    serializer = ProfileSerializer(instance=profile, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer._errors)

@api_view(['GET'])
def profile(request, pk):
    print(request)
    user = User.objects.get(pk=pk)

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)

##follow

@api_view(['GET'])
def following(request):
    user = request.user
    user_follows = Follow.objects.filter(user=user).values('following')  
    user_posts = Post.objects.filter(author=user).all()
    posts = Post.objects.filter(author__in=user_follows).order_by('-created')
    combined = user_posts | posts
    combined_sorted = combined.distinct().order_by('-created')
    serializer = PostSerializer(combined_sorted, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def followers(request, pk):
    user = User.objects.get(pk=pk)
    followers = Follow.objects.filter(following=user)
    serializer = FollowersSerializer(followers, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def follow(request, pk):
    following = User.objects.get(pk=pk)
    f = Follow(user=request.user, following=following)
    f.save()

    return Response("was success")

@api_view(['POST'])
def unfollow(request, pk):
    following = User.objects.get(pk=pk)
    Follow.objects.get(user=request.user, following=following).delete()

    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def do_follow(request,pk):
    following = User.objects.get(pk=pk)
    if Follow.objects.filter(user=request.user, following=following).count() == 1:
        follow = True
    else:
        follow = False

    return Response(follow)


#likes

@api_view(['POST'])
def like(request,pk):
    post = Post.objects.get(pk=pk)
    post.like.add(request.user)

    return Response("was success")

@api_view(['DELETE'])
def unlike(request,pk):
    post = Post.objects.get(pk=pk)
    post.like.remove(request.user)

    return Response("was success")





##comments

@api_view(['GET'])
def get_comment(request, pk):
    comment = Comment.objects.get(pk=pk)
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def comments(request, pk):
    post = Post.objects.get(pk=pk)
    comments = Comment.objects.filter(post=post)
    serializer = CommentSerializer(comments, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def comment(request,pk):
    post = Post.objects.get(pk=pk)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user,post=post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_comment(request,pk):
    comment = Comment.objects.get(author=request.user, pk=pk)
    comment.delete()

    return Response("was success")

@api_view(['POST'])
def like_com(request,pk):
    comment = Comment.objects.get(pk=pk)
    comment.like.add(request.user)

    return Response("was success")

@api_view(['DELETE'])
def unlike_com(request,pk):
    comment = Comment.objects.get(pk=pk)
    comment.like.remove(request.user)

    return Response("was success")