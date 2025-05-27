from api.serializers import (
    ArtistSerializer,
    FavoriteSerializer,
    PaintingSerializer,
    SimilarPaintingSerializer,
    TagSerializer,
)
from django.db.models import Count, Prefetch, Q
from django_filters.rest_framework import DjangoFilterBackend
from paintings.models import Artist, Favorite, Painting, Tags
from paintings.utils import similar_to
from rest_framework import filters, generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response


class PaintingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Painting.objects.filter(archive=False)
    serializer_class = PaintingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = {
        "tags": ["exact"],
    }

    search_fields = ["title", "artist__name"]
    queryset = Painting.objects.all()

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
                {"detail": "Картина уже в избранном."},
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
    queryset = Artist.objects.prefetch_related(
        Prefetch("paintings", queryset=Painting.objects.order_by("-year"))
    )
    serializer_class = ArtistSerializer


class TagsListView(generics.ListAPIView):
    serializer_class = TagSerializer
    queryset = Tags.objects.all()


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaintingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields = {
        "tags": ["exact"],
    }

    def get_queryset(self):
        user = self.request.user

        liked_paintings = Painting.objects.filter(favorite__user=user)

        liked_tag_ids = Tags.objects.filter(
            paintings__in=liked_paintings
        ).values_list("id", flat=True)

        queryset = (
            Painting.objects.all()
            .annotate(
                shared_tags=Count("tags", filter=Q(tags__in=liked_tag_ids))
            )
            .order_by("-shared_tags", "title")
        )

        return queryset
