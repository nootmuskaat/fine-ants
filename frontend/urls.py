from django.urls import path

from . import views


app_name = "tagtable"
urlpatterns = [
    path("", views.dashboard, name="dashboard"),
]
