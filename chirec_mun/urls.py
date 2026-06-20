from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.decorators.cache import cache_control
from django.views.static import serve

# Cache media files for 30 days in browser
cached_serve = cache_control(max_age=2592000, public=True, immutable=True)(serve)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    # Serve media files with long-lived cache headers
    re_path(r'^media/(?P<path>.*)$', cached_serve, {'document_root': settings.MEDIA_ROOT}),
]
