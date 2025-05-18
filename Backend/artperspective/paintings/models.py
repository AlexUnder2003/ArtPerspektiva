from django.db import models


class Tags(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Painting(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    year = models.IntegerField()
    image = models.ImageField(upload_to="paintings/")
    description = models.TextField()
    tags = models.ManyToManyField(
        "Tags",
        through="PaintingTag",
        related_name="paintings",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} by {self.artist}"


class PaintingTag(models.Model):
    painting = models.ForeignKey("Painting", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tags", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("painting", "tag")
        indexes = [models.Index(fields=["tag", "painting"])]


class Favorite(models.Model):
    user = models.ForeignKey(
        "users.ArtPerspectiveUser", on_delete=models.CASCADE
    )
    painting = models.ForeignKey(Painting, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "painting"], name="unique_favorite"
            )
        ]
        verbose_name = "Избранное"
        verbose_name_plural = "Избранные картины"

    def __str__(self):
        return f"{self.user.username} - {self.painting.title}"
