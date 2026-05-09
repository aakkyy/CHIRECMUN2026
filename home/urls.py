from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('faq/', views.index, name='faq'),
    path('faq', views.index, name='faq_noslash'),
    path('team/', views.index, name='team'),
    path('team', views.index, name='team_noslash'),
    path('committees/', views.index, name='committees'),
    path('committees', views.index, name='committees_noslash'),
    path('guidelines/', views.index, name='guidelines'),
    path('guidelines', views.index, name='guidelines_noslash'),
    path('schedule/', views.index, name='schedule'),
    path('schedule', views.index, name='schedule_noslash'),
]
