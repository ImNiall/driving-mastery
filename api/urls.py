from django.urls import path

from .views import health_check_view

app_name = "api"

urlpatterns = [
    path("health/", health_check_view, name="health"),
]
