from django.contrib import admin
from .models import (
    Negocio, Usuario, CategoriaInsumo, Insumo, 
    HistorialPrecio, MovimientoInventario, ProductoMenu, 
    Receta, SesionCaja, MovimientoCaja
)

@admin.register(Negocio)
class NegocioAdmin(admin.ModelAdmin):
    # Campos actualizados: nombre, rif_nit, moneda_base
    list_display = ('id', 'nombre', 'rif_nit', 'moneda_base')
    search_fields = ('nombre', 'rif_nit')

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'rol', 'negocio')
    list_filter = ('rol', 'negocio')

@admin.register(CategoriaInsumo)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'negocio')
    list_filter = ('negocio',)

@admin.register(Insumo)
class InsumoAdmin(admin.ModelAdmin):
    # Campos actualizados: tipo, stock_actual, precio_costo_actual
    list_display = ('nombre', 'tipo', 'unidad_medida', 'stock_actual', 'precio_costo_actual', 'negocio')
    list_filter = ('tipo', 'negocio', 'categoria')
    search_fields = ('nombre',)

@admin.register(MovimientoInventario)
class MovimientoAdmin(admin.ModelAdmin):
    # Campos actualizados: tipo_movimiento, usuario, fecha
    list_display = ('insumo', 'tipo_movimiento', 'cantidad', 'usuario', 'fecha')
    list_filter = ('tipo_movimiento', 'fecha')

@admin.register(ProductoMenu)
class ProductoMenuAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_venta', 'requiere_preparacion', 'negocio')
    list_filter = ('negocio', 'requiere_preparacion')

@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ('producto', 'insumo', 'cantidad_necesaria')

@admin.register(SesionCaja)
class SesionCajaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'monto_apertura', 'estado', 'fecha_apertura')
    list_filter = ('estado', 'negocio')

# Registros simples para el resto
admin.site.register(HistorialPrecio)
admin.site.register(MovimientoCaja)