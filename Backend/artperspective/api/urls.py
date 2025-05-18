from rest_framework.routers import DefaultRouter
from api.views import FavoriteViewSet, PaintingViewSet


router = DefaultRouter()

router.register("paintings", PaintingViewSet, basename="painting")
router.register("favorites", FavoriteViewSet, basename="favorite")

urlpatterns = router.urls
