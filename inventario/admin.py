from django.contrib import admin
from .models import Negocio, Categoria, Insumo
from .models import Movimiento

@admin.register(Negocio)
class NegocioAdmin(admin.ModelAdmin):
    list_display = ('nombre_comercial', 'propietario', 'es_administrador_sistema')
    search_fields = ('nombre_comercial', 'propietario__username')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'negocio')
    list_filter = ('negocio',)

@admin.register(Insumo)
class InsumoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'negocio', 'stock_actual', 'unidad_medida')
    list_filter = ('negocio', 'categoria')

@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('insumo', 'tipo', 'cantidad', 'fecha')
    list_filter = ('tipo', 'fecha', 'insumo__negocio')