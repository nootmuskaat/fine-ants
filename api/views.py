from rest_framework.decorators import api_view
from rest_framework.request import Request as DRFRequest
from rest_framework.response import Response as DRFResponse

from .models import Category
from .serializers import CategorySerializer


@api_view(["GET", "POST"])
def categories(request: DRFRequest) -> DRFResponse:
    if request.method == "GET":
        cats = Category.objects.order_by('name')
        out = [{"name": c.name, "children": [ch.name for ch in c.children.order_by('name')]} for c in cats]
        return DRFResponse(out)
    deserialized = CategorySerializer(data=request.data)
    if not deserialized.is_valid():
        return DRFResponse(deserialized.errors, status=400)
    deserialized.save()
    return DRFResponse(deserialized.validated_data, status=201)
