from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.nombre_comercial)
    super().save(*args, **kwargs)
    
class Negocio(models.Model):
    nombre_comercial = models.CharField(max_length=255)
    propietario = models.ForeignKey(User, on_delete=models.CASCADE)
    moneda = models.CharField(max_length=3, default="USD")
    slug = models.SlugField(unique=True, blank=True, null=True)

    # --- NUEVOS CAMPOS DE PERSONALIZACIÓN ---
    color_principal = models.CharField(max_length=7, default="#3C4623") # Verde Oliva por defecto [cite: 2, 3]
    color_secundario = models.CharField(max_length=7, default="#E8E4D9") # Crema por defecto [cite: 14, 16]
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)

    def __str__(self):
        return self.nombre_comercial

class Categoria(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} ({self.negocio.nombre_comercial})"

class Insumo(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    nombre = models.CharField(max_length=150)
    
    UNIDADES = [
        ('Kg', 'Kilogramos'), ('gr', 'Gramos'),
        ('Lt', 'Litros'), ('ml', 'Mililitros'),
        ('Und', 'Unidades'), ('Paquete', 'Paquete'),
    ]
    unidad_medida = models.CharField(max_length=20, choices=UNIDADES)
    stock_actual = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    stock_minimo_alerta = models.DecimalField(max_digits=12, decimal_places=2, default=5)
    precio_costo = models.DecimalField(max_digits=12, decimal_places=2)

    @property
    def estado_stock(self):
        if self.stock_actual <= 0:
            return "AGOTADO"
        elif self.stock_actual <= self.stock_minimo_alerta:
            return "CRÍTICO"
        return "OK"
    
    def __str__(self):
        return self.nombre
    
class Movimiento(models.Model):
    TIPOS = [('ENTRADA', 'Entrada (Compra/Carga)'), ('SALIDA', 'Salida (Venta/Merma)')]
    
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE, related_name='movimientos')
    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    motivo = models.CharField(max_length=255, blank=True, help_text="Ej: Venta del día, error de carga, etc.")
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.tipo} - {self.insumo.nombre} ({self.cantidad})"