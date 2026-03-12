from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NegocioViewSet, UsuarioViewSet, CategoriaInsumoViewSet, 
    InsumoViewSet, HistorialPrecioViewSet, MovimientoInventarioViewSet, 
    ProductoMenuViewSet, RecetaViewSet, SesionCajaViewSet, MovimientoCajaViewSet
)

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
    path('', include(router.urls)),
]