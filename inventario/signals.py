from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Movimiento

@receiver(post_save, sender=Movimiento)
def actualizar_stock(sender, instance, created, **kwargs):
    if created:
        insumo = instance.insumo
        if instance.tipo == 'ENTRADA':
            insumo.stock_actual += instance.cantidad
        else:
            insumo.stock_actual -= instance.cantidad
        insumo.save()