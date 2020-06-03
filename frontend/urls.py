from django.urls import path

from . import views


app_name = "tagtable"
urlpatterns = [
    path("accounts", views.accounts, name="accounts"),
    path("categories", views.categories, name="categories"),
    path("import", views.import_file, name="import"),
    path("profile", views.profile, name="profile"),
    path("reports", views.reports, name="reports"),
    path("", views.dashboard, name="dashboard"),
]
