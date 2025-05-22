from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers


from paintings.models import Artist, Painting, Favorite, Tags

User = get_user_model()


class ArtUserSerializer(UserSerializer):
    avatar = Base64ImageField(required=False)

    class Meta(UserSerializer.Meta):
        model = User
        fields = UserSerializer.Meta.fields + (
            "avatar",
            "first_name",
            "last_name",
        )


class PaintingSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )
    artist = serializers.SlugRelatedField(read_only=True, slug_field="name")
    artist_id = serializers.PrimaryKeyRelatedField(
        source="artist", read_only=True
    )
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Painting
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_is_favorite(self, obj):
        request = self.context.get("request")
        if request is None or request.user.is_anonymous:
            return False
        return Favorite.objects.filter(
            painting=obj, user=request.user
        ).exists()


class FavoriteSerializer(serializers.ModelSerializer):
    pass

    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ["id"]


class SimilarPaintingSerializer(PaintingSerializer):
    shared_tags = serializers.IntegerField(read_only=True)

    class Meta(PaintingSerializer.Meta):
        pass


class ArtistSerializer(serializers.ModelSerializer):
    paintings = PaintingSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tags
        fields = "__all__"
