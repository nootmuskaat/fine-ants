from django.shortcuts import render


def dashboard(request):
    return render(request, "frontend/dashboard.html")

def accounts(request):
    return render(request, "frontend/accounts.html")

def categories(request):
    return render(request, "frontend/categories.html")

def import_file(request):
    return render(request, "frontend/import.html")

def profile(request):
    return render(request, "frontend/profile.html")

def reports(request):
    return render(request, "frontend/reports.html")
