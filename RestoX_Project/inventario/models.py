from django.db import models
from django.contrib.auth.models import User

# Para que RestoX sea un SaaS, cada usuario es un "Negocio" independiente
class Negocio(models.Model):
    propietario = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre_comercial = models.CharField(max_length=150)
    moneda = models.CharField(max_length=10, default="USD")

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
    # Unidades que usabas en tu código anterior
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
        return self.nombre