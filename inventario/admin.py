from django.contrib import admin
from .models import Negocio, Categoria, Insumo, Movimiento

@admin.register(Negocio)
class NegocioAdmin(admin.ModelAdmin):
    list_display = ('nombre_comercial', 'propietario', 'moneda')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'negocio')

@admin.register(Insumo)
class InsumoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'negocio', 'stock_actual', 'unidad_medida')
    list_filter = ('negocio', 'categoria')
@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'insumo', 'tipo', 'cantidad', 'usuario')
    list_filter = ('tipo', 'fecha')