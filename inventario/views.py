from rest_framework import viewsets, permissions
from .models import Insumo, Categoria, Negocio
from .serializers import InsumoSerializer, CategoriaSerializer, NegocioSerializer

class InsumoViewSet(viewsets.ModelViewSet):
    serializer_class = InsumoSerializer
    # Mantenemos AllowAny solo para esta fase de pruebas
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # 1. Si el usuario no está logueado, devolvemos todo para que React no falle
        if not user.is_authenticated:
            return Insumo.objects.all()

        # 2. Si es superusuario, ve absolutamente todo
        if user.is_superuser:
            return Insumo.objects.all()
            
        # 3. FILTRO CRÍTICO: 
        # Si el usuario es normal, filtramos por el propietario del negocio
        # Asegúrate de que en tu modelo Insumo el campo se llame 'negocio'
        return Insumo.objects.filter(negocio__propietario=user)

    def perform_create(self, serializer):
        # Evitamos errores si el usuario es AnonymousUser
        if not self.request.user.is_authenticated:
            serializer.save()
            return

        try:
            # Buscamos el negocio del usuario actual
            negocio = Negocio.objects.get(propietario=self.request.user)
            serializer.save(negocio=negocio)
        except Negocio.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Tu usuario no tiene un negocio asignado en el Admin.")
            
class CategoriaViewSet(viewsets.ModelViewSet):
    """
    Vista para manejar las categorías de cada negocio.
    """
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Categoria.objects.all()
        return Categoria.objects.filter(negocio__propietario=self.request.user)

    def perform_create(self, serializer):
        negocio = Negocio.objects.get(propietario=self.request.user)
        serializer.save(negocio=negocio)

class NegocioViewSet(viewsets.ModelViewSet):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si eres superusuario, ves todo
        if user.is_superuser:
            return Negocio.objects.all()
        
        # IMPORTANTE: Verifica si en tu modelo pusiste 'propietario' o 'user'
        # Si el error 500 vuelve, cambia 'propietario' por 'usuario' o 'user'
        return Negocio.objects.filter(propietario=user)