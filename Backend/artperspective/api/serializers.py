from rest_framework import serializers

from paintings.models import Painting, Favorite


class PaintingSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )

    class Meta:
        model = Painting
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


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
