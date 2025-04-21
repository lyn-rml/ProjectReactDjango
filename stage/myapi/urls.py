from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import StageViewSet,StagiaireViewSet,stage_stagiaireViewSet
from .views import SuperviserViewSet,MembreViewSet,sup_stageViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import get_me
router = DefaultRouter()
router.register(r'Stages',StageViewSet)
router.register(r'Membres',MembreViewSet)
router.register(r'Stagiaires',StagiaireViewSet)
router.register(r'Supervisers',SuperviserViewSet)
router.register(r'supstage',sup_stageViewSet)
router.register(r'stagestagiaire',stage_stagiaireViewSet)
# router.register(r'delete-supstage', views.DeletePostViewSet, base_name="delete-supstage")

urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', get_me, name='get_me'),
] 

