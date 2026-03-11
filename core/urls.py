from django.contrib import admin
from django.urls import path, include
from django.conf import settings # IMPORTANTE
from django.conf.urls.static import static # IMPORTANTE
from rest_framework.routers import DefaultRouter
from inventario.views import InsumoViewSet, CategoriaViewSet, NegocioViewSet, MovimientoViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'insumos', InsumoViewSet, basename='insumo')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'negocios', NegocioViewSet, basename='negocio')
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Rutas para el Login
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# ESTO ES LO QUE DEBES AGREGAR AL FINAL:
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)