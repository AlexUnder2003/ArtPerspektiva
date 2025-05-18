from django.db import models


class Tags(models.Model):
    name = models.CharField(
        max_length=255, unique=True, verbose_name="Название тега"
    )

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.name


class Artist(models.Model):
    name = models.CharField(max_length=255, verbose_name="Имя художника")
    bio = models.TextField(verbose_name="Биография")
    image = models.ImageField(upload_to="artists/", verbose_name="Изображение")

    class Meta:
        verbose_name = "Художник"
        verbose_name_plural = "Художники"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Painting(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")
    artist = models.ForeignKey(
        Artist, on_delete=models.CASCADE, verbose_name="Художник"
    )
    year = models.IntegerField(verbose_name="Год создания")
    image = models.ImageField(
        upload_to="paintings/", verbose_name="Изображение"
    )
    description = models.TextField(verbose_name="Описание")
    tags = models.ManyToManyField(
        "Tags",
        through="PaintingTag",
        related_name="paintings",
        blank=True,
        verbose_name="Теги",
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Дата обновления"
    )
    archive = models.BooleanField(default=False, verbose_name="В архиве")

    class Meta:
        verbose_name = "Картина"
        verbose_name_plural = "Картины"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.artist}"


class PaintingTag(models.Model):
    painting = models.ForeignKey(
        "Painting", on_delete=models.CASCADE, verbose_name="Картина"
    )
    tag = models.ForeignKey(
        "Tags", on_delete=models.CASCADE, verbose_name="Тег"
    )

    class Meta:
        unique_together = ("painting", "tag")
        indexes = [models.Index(fields=["tag", "painting"])]
        verbose_name = "Тег картины"
        verbose_name_plural = "Теги картин"

    def __str__(self):
        return f"{self.painting.title} — {self.tag.name}"


class Favorite(models.Model):
    user = models.ForeignKey(
        "users.ArtPerspectiveUser",
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
    )
    painting = models.ForeignKey(
        Painting, on_delete=models.CASCADE, verbose_name="Картина"
    )

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
