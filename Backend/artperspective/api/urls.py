from rest_framework.routers import DefaultRouter
from api.views import FavoriteListViewSet, PaintingViewSet


router = DefaultRouter()

router.register("paintings", PaintingViewSet, basename="painting")
router.register("favorites", FavoriteListViewSet, basename="favorite")

urlpatterns = router.urls
