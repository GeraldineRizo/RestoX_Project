from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    Negocio, Usuario, CategoriaInsumo, Insumo, 
    HistorialPrecio, MovimientoInventario, ProductoMenu, 
    Receta, SesionCaja, MovimientoCaja
)
from .serializers import (
    CustomTokenObtainPairSerializer, # Importado para el login
    NegocioSerializer, UsuarioSerializer, CategoriaInsumoSerializer, 
    InsumoSerializer, HistorialPrecioSerializer, MovimientoInventarioSerializer, 
    ProductoMenuSerializer, RecetaSerializer, SesionCajaSerializer, 
    MovimientoCajaSerializer
)

# ==========================================
# 0. VISTA DE AUTENTICACIÓN (LOGIN)
# ==========================================
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint de login que devuelve el token con el payload
    personalizado (rol, negocio_id, etc.)
    """
    serializer_class = CustomTokenObtainPairSerializer

# ==========================================
# MIXIN DE AISLAMIENTO SAAS (SENIOR REUSABILITY)
# ==========================================
class TenantAwareViewSet(viewsets.ModelViewSet):
    """
    Mixin para asegurar que cada ViewSet solo devuelva datos
    pertenecientes al negocio del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si eres Admin_SaaS (Tú), puedes ver todo. 
        # Si no, solo lo de tu negocio.
        if user.rol == 'Admin_SaaS':
            return self.queryset
        return self.queryset.filter(negocio=user.negocio)

    def perform_create(self, serializer):
        # Asigna automáticamente el negocio del usuario al crear cualquier registro
        serializer.save(negocio=self.request.user.negocio)

# ==========================================
# 1. VISTAS DEL SISTEMA (REFRACTORIZADAS)
# ==========================================

class NegocioViewSet(viewsets.ModelViewSet):
    """
    Solo accesible por el Admin_SaaS para crear nuevos negocios.
    """
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.rol == 'Admin_SaaS':
            return Negocio.objects.all()
        return Negocio.objects.filter(id=self.request.user.negocio.id)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'Admin_SaaS':
            return Usuario.objects.all()
        return Usuario.objects.filter(negocio=user.negocio)

class CategoriaInsumoViewSet(TenantAwareViewSet):
    queryset = CategoriaInsumo.objects.all()
    serializer_class = CategoriaInsumoSerializer

class InsumoViewSet(TenantAwareViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer

    def perform_create(self, serializer):
        # Lógica Senior: Transacción atómica implícita al guardar
        insumo = serializer.save(negocio=self.request.user.negocio)
        HistorialPrecio.objects.create(
            insumo=insumo,
            negocio=self.request.user.negocio,
            precio_compra=insumo.precio_costo_actual
        )

class HistorialPrecioViewSet(TenantAwareViewSet):
    queryset = HistorialPrecio.objects.all()
    serializer_class = HistorialPrecioSerializer

class MovimientoInventarioViewSet(TenantAwareViewSet):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer

    def perform_create(self, serializer):
        # Registramos quién hizo el movimiento físicamente
        serializer.save(
            usuario=self.request.user,
            negocio=self.request.user.negocio
        )

class ProductoMenuViewSet(TenantAwareViewSet):
    queryset = ProductoMenu.objects.all()
    serializer_class = ProductoMenuSerializer

class RecetaViewSet(TenantAwareViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer

class SesionCajaViewSet(TenantAwareViewSet):
    queryset = SesionCaja.objects.all()
    serializer_class = SesionCajaSerializer

    def perform_create(self, serializer):
        serializer.save(
            usuario=self.request.user,
            negocio=self.request.user.negocio
        )

class MovimientoCajaViewSet(viewsets.ModelViewSet):
    """
    Nota: Se filtra a través de la sesión, que ya está filtrada por negocio.
    """
    queryset = MovimientoCaja.objects.all()
    serializer_class = MovimientoCajaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MovimientoCaja.objects.filter(sesion__negocio=self.request.user.negocio)