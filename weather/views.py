from django.shortcuts import render
from django.http import JsonResponse
from .models import Favorite
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import FavoriteSerializer
# Create your views here.
def index(request):

    return render(request, 'weather/index.html')

@api_view(['GET'])
def is_favorite(request):

    favorites = Favorite.objects.filter(user = request.user)
    serializer = FavoriteSerializer(favorites, many = True)

    return Response(serializer.data)

@api_view(['DELETE'])
def remove(request,pk):

    fav = Favorite.objects.get(user = request.user,pk=pk)
    fav.delete()

    return Response("was success")

@csrf_exempt
@api_view(['POST'])
def add(request):
    serializer = FavoriteSerializer(data=request.data)
    print(request)
    if serializer.is_valid():
        serializer.save(user = request.user)
    

    return Response("was success")


