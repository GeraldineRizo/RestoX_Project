from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. IDENTIDAD DEL NEGOCIO (EL TENANT)
class Negocio(models.Model):
    nombre = models.CharField(max_length=100)
    rif_nit = models.CharField(max_length=25, blank=True, null=True)
    moneda_base = models.CharField(max_length=10, default='USD')
    color_primario = models.CharField(max_length=7, default='#A3E635')
    color_secundario = models.CharField(max_length=7, default='#1a1c14')
    modo_oscuro = models.BooleanField(default=True)

    class Meta:
        db_table = 'negocios'

    def __str__(self):
        return self.nombre

# 2. USUARIOS DEL SISTEMA (SAAS COMPATIBLE)
class Usuario(AbstractUser):
    """
    Hereda de AbstractUser para obtener:
    - username, password (hasheado), email, is_staff, is_active, date_joined.
    """
    ROLES = (
        ('Admin_SaaS', 'Administrador del Sistema'),
        ('Dueño', 'Dueño de Negocio'),
        ('Admin_Negocio', 'Administrador de Local'),
        ('Cajero', 'Cajero / Empleado'),
    )
    
    rol = models.CharField(max_length=20, choices=ROLES, default='Cajero')
    # null=True permite que TÚ como SuperAdmin no estés atado a un negocio específico inicialmente
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='usuarios', null=True, blank=True)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return f"{self.username} ({self.rol})"

# 3. ORGANIZACIÓN DE INVENTARIO
class CategoriaInsumo(models.Model):
    nombre = models.CharField(max_length=100)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='categorias')

    class Meta:
        db_table = 'categoria_insumos'

    def __str__(self):
        return self.nombre

# 4. ARTÍCULOS E INSUMOS
class Insumo(models.Model):
    nombre = models.CharField(max_length=150)
    tipo = models.CharField(max_length=30, default='Insumo')
    unidad_medida = models.CharField(max_length=10)
    stock_actual = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    stock_minimo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_costo_actual = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    categoria = models.ForeignKey(CategoriaInsumo, on_delete=models.SET_NULL, null=True, blank=True)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='insumos')

    class Meta:
        db_table = 'insumos'

# 5. CONTROL DE COSTOS HISTÓRICOS
class HistorialPrecio(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE, related_name='historial_precios')
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE) # Denormalización para SaaS
    precio_compra = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'historial_precios'

# 6. TRAZABILIDAD DE STOCK
class MovimientoInventario(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=20) # 'Entrada', 'Salida', 'Ajuste'
    cantidad = models.DecimalField(max_digits=12, decimal_places=2)
    motivo = models.CharField(max_length=255, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE) # Denormalización para SaaS
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimientos_inventario'

# 7. MENÚ DE VENTAS
class ProductoMenu(models.Model):
    nombre = models.CharField(max_length=150)
    precio_venta = models.DecimalField(max_digits=12, decimal_places=2)
    requiere_preparacion = models.BooleanField(default=False)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='productos')

    class Meta:
        db_table = 'productos_menu'

# 8. RECETAS
class Receta(models.Model):
    producto = models.ForeignKey(ProductoMenu, on_delete=models.CASCADE, related_name='recetas')
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE) # Denormalización para SaaS
    cantidad_necesaria = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = 'recetas'

# 9. CONTROL DE CAJA
class SesionCaja(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    monto_apertura = models.DecimalField(max_digits=12, decimal_places=2)
    monto_cierre = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=20, default='Abierta')
    fecha_apertura = models.DateTimeField(auto_now_add=True)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='sesiones_caja')

    class Meta:
        db_table = 'sesiones_caja'

# 10. MOVIMIENTOS DE DINERO
class MovimientoCaja(models.Model):
    sesion = models.ForeignKey(SesionCaja, on_delete=models.CASCADE, related_name='movimientos')
    tipo_movimiento = models.CharField(max_length=20)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimientos_caja'