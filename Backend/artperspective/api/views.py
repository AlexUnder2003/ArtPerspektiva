from rest_framework import viewsets, status
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

    @action(
        detail=True, methods=["post"], permission_classes=[IsAuthenticated]
    )
    def favorite(self, request, pk=None):
        painting = self.get_object()
        fav, created = Favorite.objects.get_or_create(
            user=request.user, painting=painting
        )
        serializer = FavoriteSerializer(fav)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @favorite.mapping.delete
    def unfavorite(self, request, pk=None):
        deleted, _ = Favorite.objects.filter(
            user=request.user, painting__id=pk
        ).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

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


class FavoriteListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /favorites/ — список картин, лайкнутых текущим пользователем.
    """

    serializer_class = PaintingReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Painting.objects.filter(favorite__user=self.request.user)
