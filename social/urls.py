from django.urls import path

from . import views


urlpatterns = [
    path('',views.index, name='index'),
    path('allposts', views.all_posts, name='all_posts'),
    path('following', views.following, name='following'),
    path('newpost', views.new_post, name='new_post'), 
    path('userposts/<str:pk>', views.user_posts, name='user_posts'), 
    path('likedposts/<str:pk>', views.liked_posts, name='liked_posts'), 
    path('updatepost/<str:pk>', views.update_post, name='update_post'), 
    path('deletepost/<str:pk>', views.delete_post, name='delete_post'), 
    path('post/<str:pk>', views.post, name='post'),
    
    path('followers/<str:pk>', views.followers, name='followers'),
    path('follow/<str:pk>', views.follow, name='follow'),
    path('unfollow/<str:pk>', views.unfollow, name='unfollow'),
    path('dofollow/<str:pk>', views.do_follow, name='do_follow'),

    path('like/<str:pk>', views.like, name='like'),
    path('unlike/<str:pk>', views.unlike, name='unlike'),

    path('profile/<str:pk>', views.profile, name='profile'),
    path('updateuser', views.update_user, name="updateuser"),
    path('updateprofile', views.update_profile, name="updateprofile"),

    path('get_comment/<str:pk>', views.get_comment, name='get_comment'),
    path('comments/<str:pk>', views.comments, name='comments'),
    path('comment/<str:pk>', views.comment, name='comment'),
    path('deletecomment/<str:pk>', views.delete_comment, name='delete_comment'),
    path('likecomment/<str:pk>', views.like_com, name='like_com'),
    path('unlikecomment/<str:pk>', views.unlike_com, name='unlike_com'),
]