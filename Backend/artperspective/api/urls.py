from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import (
    ArtistListViewSet,
    FavoriteListViewSet,
    PaintingViewSet,
    RecommendationViewSet,
    TagsListView,
)


router = DefaultRouter()

router.register("paintings", PaintingViewSet, basename="painting")
router.register("favorites", FavoriteListViewSet, basename="favorite")
router.register("artists", ArtistListViewSet, basename="author")
router.register(
    "recommendations", RecommendationViewSet, basename="recommendation"
)


urlpatterns = [
    path("tags/", TagsListView.as_view(), name="tags")
] + router.urls
