from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.decorators.cache import cache_control
from django.views.static import serve
from django.http import HttpResponse

# Cache media files for 30 days in browser
cached_serve = cache_control(max_age=2592000, public=True, immutable=True)(serve)

def google_site_verification(request):
    return HttpResponse(
        'google-site-verification: google8ade69d851487984.html',
        content_type='text/html'
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('google8ade69d851487984.html', google_site_verification),
    path('', include('home.urls')),
    # Serve media files with long-lived cache headers
    re_path(r'^media/(?P<path>.*)$', cached_serve, {'document_root': settings.MEDIA_ROOT}),
]
