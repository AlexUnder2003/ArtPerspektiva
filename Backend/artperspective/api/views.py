from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
)


from api.serializers import (
    ArtistSerializer,
    PaintingSerializer,
    SimilarPaintingSerializer,
    FavoriteSerializer,
    TagSerializer,
)
from paintings.models import Artist, Favorite, Painting, Tags
from paintings.utils import similar_to


class PaintingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET список и детали картин + экшены для управления лайками и просмотра похожих.
    Создавать/обновлять/удалять картины могут только админы (например, через админ-панель).
    """

    queryset = Painting.objects.all().prefetch_related("tags")
    serializer_class = PaintingSerializer

    @action(
        detail=True, methods=["post"], permission_classes=[IsAuthenticated]
    )
    def favorite(self, request, pk=None):
        """
        POST /paintings/{pk}/favorite/ — поставить лайк (создать Favorite),
        если ещё не был установлен.
        """
        painting = self.get_object()
        fav, created = Favorite.objects.get_or_create(
            user=request.user, painting=painting
        )
        if not created:
            return Response(
                {"detail": "Painting is already liked."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = FavoriteSerializer(fav)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @favorite.mapping.delete
    def unfavorite(self, request, pk=None):
        """
        DELETE /paintings/{pk}/favorite/ — снять лайк.
        """
        deleted, _ = Favorite.objects.filter(
            user=request.user, painting__id=pk
        ).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"])
    def similar(self, request, pk=None):
        """
        GET /paintings/{pk}/similar/ — список похожих картин.
        """
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
    serializer_class = PaintingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Painting.objects.filter(favorite__user=self.request.user)


class ArtistListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ArtistSerializer
    queryset = Artist.objects.all().prefetch_related("paintings")


class TagsListView(generics.ListAPIView):
    serializer_class = TagSerializer
    queryset = Tags.objects.all()
