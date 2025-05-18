from django.db.models import Count, Q

from paintings.models import Painting


def similar_to(painting):
    tag_ids = painting.tags.values_list("id", flat=True)
    return (
        Painting.objects.filter(tags__in=tag_ids)  # есть общий тег
        .exclude(pk=painting.pk)  # кроме самой картины
        .annotate(
            shared_tags=Count(
                "tags", filter=Q(tags__in=tag_ids)  # считаем ТОЛЬКО общие
            )
        )
        .distinct()
        .order_by("-shared_tags", "title")
    )
