from django.urls import path, re_path
from . import views

urlpatterns = [
    path('api/contact/',  views.contact,  name='contact_api'),
    path('api/register/', views.register, name='register_api'),
    # Catch-all: serve the React SPA for every non-API route.
    # React Router handles all client-side routing from there.
    # This also fixes /committees/:id returning 404 on hard refresh.
    re_path(r'^(?!api/)(?!media/).*$', views.index, name='spa'),
]
