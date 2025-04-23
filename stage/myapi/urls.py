from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import get_me
router = DefaultRouter()
router.register(r'Stages',ProjectViewSet)
router.register(r'Membres',MembreViewSet)
router.register(r'Stagiaires',StagiaireViewSet)
router.register(r'Supervisers',SuperviserViewSet)
router.register(r'supstage',supervisor_internshipViewSet)
router.register(r'stagestagiaire',internshipViewSet)
router.register(r'persons', PersonViewSet)
# router.register(r'delete-supstage', views.DeletePostViewSet, base_name="delete-supstage")

urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', get_me, name='get_me'),
] 

