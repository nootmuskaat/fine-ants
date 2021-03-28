import logging
from typing import Dict

from rest_framework import serializers as ser

from .models import Category, SubCategory

logger = logging.getLogger(__name__)


class CategorySerializer(ser.Serializer):
    parent = ser.CharField()
    name = ser.CharField()

    def create(self, validated_data: Dict[str, str]) -> SubCategory:
        parent_name = validated_data["parent"]
        cat_name = validated_data["name"]
        try:
            parent = Category.objects.get(name=parent_name)
        except Category.DoesNotExist:
            logger.info("Creating Parent Category %s", parent_name)
            parent = Category.objects.create(name=parent_name)
            parent.save()
        # could raise an IntegrityError
        return SubCategory.objects.create(parent=parent, name=cat_name)
