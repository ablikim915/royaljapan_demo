from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .healthz import get_health_status


@require_http_methods(["GET"])
def healthz_view(request):
    data = get_health_status()
    return JsonResponse(data, status=200)