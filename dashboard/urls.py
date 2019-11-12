from django.urls import path, include
from .views import *
urlpatterns = [
    path('', DashboardView.as_view(), name="dashboard"),
    path('login', LoginView.as_view(), name="admin-login"),
]