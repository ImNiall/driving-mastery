from django.http import JsonResponse
from django.views import View


class HealthCheckView(View):
    """Return a simple JSON payload confirming the backend is running."""

    def get(self, request, *args, **kwargs):  # noqa: D401 - Django view signature
        return JsonResponse({"status": "ok", "service": "driving-mastery-api"})


health_check_view = HealthCheckView.as_view()

# Create your views here.
