from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Negocio, Usuario, CategoriaInsumo, Insumo, 
    HistorialPrecio, MovimientoInventario, ProductoMenu, 
    Receta, SesionCaja, MovimientoCaja
)

# ==========================================
# 0. JWT CUSTOMIZADO (Para el Login)
# ==========================================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extiende el token para incluir datos del usuario y negocio
    directamente en el payload del JWT.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos claims personalizados al token
        token['username'] = user.username
        token['rol'] = user.rol
        token['negocio_id'] = user.negocio.id if user.negocio else None
        return token

# ==========================================
# 1. NEGOCIO & USUARIO
# ==========================================
class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'email', 'rol', 'negocio']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False}
        }

    def create(self, validated_data):
        # Senior Tip: Usamos create_user para hashear la contraseña correctamente
        user = Usuario.objects.create_user(**validated_data)
        return user

# ==========================================
# 2. INVENTARIO (Contexto SaaS)
# ==========================================
class CategoriaInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaInsumo
        fields = '__all__'

class InsumoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    
    class Meta:
        model = Insumo
        fields = '__all__'

class HistorialPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPrecio
        fields = '__all__'

class MovimientoInventarioSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.ReadOnlyField(source='insumo.nombre')
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = MovimientoInventario
        fields = '__all__'

# ==========================================
# 3. MENÚ Y RECETAS
# ==========================================
class ProductoMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoMenu
        fields = '__all__'

class RecetaSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.ReadOnlyField(source='insumo.nombre')

    class Meta:
        model = Receta
        fields = '__all__'

# ==========================================
# 4. CAJA Y FINANZAS
# ==========================================
class SesionCajaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = SesionCaja
        fields = '__all__'

class MovimientoCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoCaja
        fields = '__all__'