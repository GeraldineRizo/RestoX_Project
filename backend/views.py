from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import (
    Negocio, Usuario, CategoriaInsumo, Insumo, 
    HistorialPrecio, MovimientoInventario, ProductoMenu, 
    Receta, SesionCaja, MovimientoCaja
)
from .serializers import (
    NegocioSerializer, UsuarioSerializer, CategoriaInsumoSerializer, 
    InsumoSerializer, HistorialPrecioSerializer, MovimientoInventarioSerializer, 
    ProductoMenuSerializer, RecetaSerializer, SesionCajaSerializer, 
    MovimientoCajaSerializer
)

# --- VISTAS DEL SISTEMA ---

class NegocioViewSet(viewsets.ModelViewSet):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class CategoriaInsumoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaInsumo.objects.all()
    serializer_class = CategoriaInsumoSerializer

class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer

    # Ejemplo de lógica extra: Registrar movimiento al crear insumo
    def perform_create(self, serializer):
        insumo = serializer.save()
        # Aquí podrías disparar la creación de un HistorialPrecio inicial
        HistorialPrecio.objects.create(
            insumo=insumo, 
            precio_compra=insumo.precio_costo_actual
        )

class HistorialPrecioViewSet(viewsets.ModelViewSet):
    queryset = HistorialPrecio.objects.all()
    serializer_class = HistorialPrecioSerializer

class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer

class ProductoMenuViewSet(viewsets.ModelViewSet):
    queryset = ProductoMenu.objects.all()
    serializer_class = ProductoMenuSerializer

class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer

class SesionCajaViewSet(viewsets.ModelViewSet):
    queryset = SesionCaja.objects.all()
    serializer_class = SesionCajaSerializer

class MovimientoCajaViewSet(viewsets.ModelViewSet):
    queryset = MovimientoCaja.objects.all()
    serializer_class = MovimientoCajaSerializer