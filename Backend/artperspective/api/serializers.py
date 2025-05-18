from rest_framework import serializers

from paintings.models import Painting, Favorite, Tags


class PaintingReadSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )

    class Meta:
        model = Painting
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class PaintingWriteSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tags.objects.all()
    )

    class Meta:
        model = Painting
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ["id"]


class SimilarPaintingSerializer(PaintingReadSerializer):
    shared_tags = serializers.IntegerField(read_only=True)

    class Meta(PaintingReadSerializer.Meta):
        pass
