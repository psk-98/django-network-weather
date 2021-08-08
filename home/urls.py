from django.urls import path

from . import views

app_name = 'home'

urlpatterns = [
    path("", views.index, name="index"),
    path("content", views.content, name="content"),
    path('login', views.login_view, name="login"),
    path("register", views.sign_up, name="sign_up"),
    path("logout", views.logout_view, name="logout"),
]