from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from api.serializers import (
    PaintingReadSerializer,
    PaintingWriteSerializer,
    SimilarPaintingSerializer,
    FavoriteSerializer,
)
from paintings.models import Favorite, Painting
from paintings.utils import similar_to


class PaintingViewSet(viewsets.ModelViewSet):
    queryset = Painting.objects.all().prefetch_related("tags")
    serializer_class = PaintingReadSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PaintingWriteSerializer
        return PaintingReadSerializer

    @action(detail=True, methods=["get"])
    def similar(self, request, pk=None):
        painting = self.get_object()
        qs = similar_to(painting)
        page = self.paginate_queryset(qs)

        serializer = SimilarPaintingSerializer(
            page if page is not None else qs,
            many=True,
            context={"request": request},
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
