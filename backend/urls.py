from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,  # Nuestra vista de login personalizada
    NegocioViewSet, 
    UsuarioViewSet, 
    CategoriaInsumoViewSet, 
    InsumoViewSet, 
    HistorialPrecioViewSet, 
    MovimientoInventarioViewSet, 
    ProductoMenuViewSet, 
    RecetaViewSet, 
    SesionCajaViewSet, 
    MovimientoCajaViewSet
)

# Configuración del Router para ViewSets
router = DefaultRouter()
router.register(r'negocios', NegocioViewSet, basename='negocio')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'categorias', CategoriaInsumoViewSet, basename='categoria')
router.register(r'insumos', InsumoViewSet, basename='insumo')
router.register(r'historial-precios', HistorialPrecioViewSet, basename='historial-precio')
router.register(r'movimientos-inventario', MovimientoInventarioViewSet, basename='movimiento-inventario')
router.register(r'productos-menu', ProductoMenuViewSet, basename='producto-menu')
router.register(r'recetas', RecetaViewSet, basename='receta')
router.register(r'sesiones-caja', SesionCajaViewSet, basename='sesion-caja')
router.register(r'movimientos-caja', MovimientoCajaViewSet, basename='movimiento-caja')

urlpatterns = [
    # 1. ENDPOINTS DE AUTENTICACIÓN (JWT)
    # Este es el que usarás en tu componente Login.js
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Este sirve para obtener un nuevo Access Token usando el Refresh Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 2. RUTAS DE LA API (CRUDs)
    path('', include(router.urls)),
]