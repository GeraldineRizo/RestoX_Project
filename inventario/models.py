from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify



class Negocio(models.Model):
    propietario = models.ForeignKey(User, on_delete=models.CASCADE) # Permitir varios negocios por usuario si hace falta
    nombre_comercial = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    moneda = models.CharField(max_length=3, default="USD")
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    color_principal = models.CharField(max_length=7, default="#3C4623") # Ideal para Arví
    color_secundario = models.CharField(max_length=7, default="#E8E4D9")
    es_administrador_sistema = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre_comercial)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre_comercial

class Categoria(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='categorias')
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} ({self.negocio.nombre_comercial})"

class Insumo(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='insumos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
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

    def __str__(self):
        return f"{self.nombre} - {self.negocio.nombre_comercial}"

class Movimiento(models.Model):
    TIPOS = (
        ('E', 'Entrada (Compra/Carga)'),
        ('S', 'Salida (Venta/Desperdicio)'),
    )
    
    insumo = models.ForeignKey('Insumo', on_delete=models.CASCADE, related_name='movimientos')
    tipo = models.CharField(max_length=1, choices=TIPOS)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    motivo = models.CharField(max_length=255, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # Quién lo hizo

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.insumo.nombre} ({self.cantidad})"