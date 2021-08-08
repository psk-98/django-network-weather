from django.urls import path ,include
from .api import RegisterAPI, LoginAPI, UserAPI, UpdateProfileAPI, UpdateUserAPI, GetUserAPI
from knox import views as knox_views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/profile/<str:user_id>', GetUserAPI.as_view()),
    path('api/auth/updateprofile', UpdateProfileAPI.as_view()),
    path('api/auth/updateuser', UpdateUserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutAllView.as_view(), name='knox_logout')
]
