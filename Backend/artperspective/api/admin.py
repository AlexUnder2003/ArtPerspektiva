from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from paintings.models import Artist, Tags, Painting, PaintingTag, Favorite

User = get_user_model()
typ = PaintingTag


class PaintingTagInline(admin.TabularInline):
    model = PaintingTag
    extra = 1


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Painting)
class PaintingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "artist",
        "year",
        "archive",
        "created_at",
        "updated_at",
    )
    list_filter = ("artist", "year", "archive", "tags")
    search_fields = ("title", "artist", "description")
    inlines = [PaintingTagInline]
    readonly_fields = ("created_at", "updated_at")


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "painting")
    list_filter = ("user", "painting")
    search_fields = ("user__username", "painting__title")


@admin.register(User)
class ArtPerspectiveUserAdmin(UserAdmin):
    pass
