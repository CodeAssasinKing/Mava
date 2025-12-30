from django.urls import path
from .views import *


app_name = 'core'


urlpatterns = [
    path("", index, name="index"),
    path("special/", special, name="special"),
    path("services/", services, name="services"),
    path("customs/", customs, name="customs"),
    path("contact/", contacts, name="contacts"),
    path("procurement/", procurement, name="procurement")
]


