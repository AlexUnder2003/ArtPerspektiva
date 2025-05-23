from django.contrib.sitemaps import Sitemap
from paintings.models import Painting, Artist


class PaintingSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Painting.objects.all()

    def location(self, obj):
        return f"/detail/{obj.id}"


class ArtistSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Artist.objects.all()

    def location(self, obj):
        return f"/artist/{obj.id}"
