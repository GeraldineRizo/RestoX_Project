from rest_framework import serializers
from .models import Insumo, Negocio

class InsumoSerializer(serializers.ModelSerializer):
    # Añadimos el campo calculado
    estado_stock = serializers.ReadOnlyField()

    class Meta:
        model = Insumo
        fields = '__all__'
class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        fields = '__all__'