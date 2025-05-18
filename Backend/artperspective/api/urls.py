from rest_framework.routers import DefaultRouter
from api.views import PaintingViewSet


router = DefaultRouter()

router.register(r"paintings", PaintingViewSet, basename="painting")

urlpatterns = router.urls
