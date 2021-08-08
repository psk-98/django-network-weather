from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings


from .models import Project
from django.contrib.auth.models import User

# Create your views here.
def index(request):

    return render(request, 'home/index.html')

def content(request):
    if request.method == 'POST':
        name = request.POST['name']
        message = request.POST['message']
        email = "Client email: "
        email = email + request.POST['email']
        full_msg = name + "\n" + message + "\n" + email 
        send_mail("Web lead", full_msg, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)

    return render(request, "home/content.html")



def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            if 'next' in request.POST:
                return redirect(request.POST.get('next'))
            else:
                return HttpResponseRedirect(reverse("home:index"))
        else:
            return render(request, "home/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "home/login.html")

def sign_up(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "home/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            if User.objects.get(username=username):
                return render(request, "accounts/register.html", {
                    "message": "Username already taken."
                })
        login(request, user)
        if 'next' in request.POST:
            return redirect(request.POST.get('next'))
        else:
            return HttpResponseRedirect(reverse("home:index"))
    else:
        return render(request, "home/register.html")

def logout_view(request):
    logout(request)
    if 'next' in request.POST:
        return redirect(request.POST.get('next'))
    else:
        return HttpResponseRedirect(reverse("home:index"))