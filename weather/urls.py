from django.urls import path

from . import views

app_name = 'weather'

urlpatterns = [
    path('',views.index, name='index'),
    path("is_favorite", views.is_favorite, name='is_favorite'),
    path("remove/<str:pk>", views.remove, name='remove'),
    path("add", views.add, name='add'),
]