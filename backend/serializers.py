from rest_framework import serializers
from .models import (
    Negocio, Usuario, CategoriaInsumo, Insumo, 
    HistorialPrecio, MovimientoInventario, ProductoMenu, 
    Receta, SesionCaja, MovimientoCaja
)

# 1. NEGOCIO
class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        fields = '__all__'

# 2. USUARIO
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'rol', 'negocio']
        extra_kwargs = {'password': {'write_only': True}} # Seguridad: nunca enviar la clave al front

# 3. CATEGORÍA
class CategoriaInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaInsumo
        fields = '__all__'

# 4. INSUMO (El más importante para tu tabla de React)
class InsumoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Insumo
        fields = '__all__'

# 5. HISTORIAL DE PRECIOS
class HistorialPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPrecio
        fields = '__all__'

# 6. MOVIMIENTOS
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.ReadOnlyField(source='insumo.nombre')
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = MovimientoInventario
        fields = '__all__'

# 7. PRODUCTO MENÚ
class ProductoMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoMenu
        fields = '__all__'

# 8. RECETA
class RecetaSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.ReadOnlyField(source='insumo.nombre')

    class Meta:
        model = Receta
        fields = '__all__'

# 9. SESIÓN DE CAJA
class SesionCajaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = SesionCaja
        fields = '__all__'

# 10. MOVIMIENTOS DE CAJA
class MovimientoCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoCaja
        fields = '__all__'