from rest_framework import serializers
from .models import Insumo, Negocio, Categoria, Movimiento

class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        # En lugar de '__all__', vamos a poner los campos explícitos 
        # para que Django no tenga dudas:
        fields = ['id', 'nombre_comercial', 'slug', 'logo', 'color_principal', 'propietario']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre'] # En lugar de '__all__', ponemos los campos a mano

class InsumoSerializer(serializers.ModelSerializer):
    # Campos extra para que React reciba datos legibles
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    estado_stock = serializers.ReadOnlyField()

    class Meta:
        model = Insumo
        # Al usar '__all__' (como un string, sin comas extras), 
        # Django incluye automáticamente todos los campos de tu modelo Insumo.
        fields = '__all__'
        
        # Evitamos que el negocio se pueda editar manualmente desde la API
        read_only_fields = ['negocio']

    def to_representation(self, instance):
        """
        Este método asegura que 'categoria_nombre' aparezca en el JSON
        incluso cuando usamos '__all__'.
        """
        ret = super().to_representation(instance)
        ret['categoria_nombre'] = instance.categoria.nombre if instance.categoria else None
        return ret
class MovimientoSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.ReadOnlyField(source='insumo.nombre')
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Movimiento
        fields = ['id', 'insumo', 'insumo_nombre', 'tipo', 'cantidad', 'motivo', 'fecha', 'usuario_nombre']