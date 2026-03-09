from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models # Importante para el F()
from django.db.models import Sum, F
from django.utils import timezone
from datetime import timedelta
from django.http import HttpResponse
from openpyxl import Workbook

from .models import Insumo, Movimiento, Negocio
from .serializers import InsumoSerializer, NegocioSerializer


class NegocioViewSet(viewsets.ModelViewSet):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer

class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Obtenemos el ID del negocio desde los parámetros de la URL (?negocio=1)
        negocio_id = self.request.query_params.get('negocio')
        
        # Si hay un ID de negocio, filtramos por ese negocio
        if negocio_id:
            return Insumo.objects.filter(negocio_id=negocio_id)
            
        # Si no hay parámetro, devolvemos todo (o puedes dejarlo vacío)
        return Insumo.objects.all()
    
    # --- ACCIÓN 1: STOCK CRÍTICO ---
    @action(detail=False, methods=['get'])
    def stock_critico(self, request):
        # Filtra insumos donde stock <= stock_minimo_alerta
        insumos = self.get_queryset().filter(stock_actual__lte=F('stock_minimo_alerta'))
        serializer = self.get_serializer(insumos, many=True)
        return Response(serializer.data)

    # --- ACCIÓN 2: REPORTE DE MERMAS (Dinero perdido) ---
    @action(detail=False, methods=['get'])
    def reporte_mermas(self, request):
        hace_30_dias = timezone.now() - timedelta(days=30)
        mermas = Movimiento.objects.filter(
            insumo__negocio__propietario=request.user,
            tipo='SALIDA',
            fecha__gte=hace_30_dias
        )
        # Cálculo matemático de pérdida total
        total_perdida = mermas.aggregate(
            total=Sum(F('cantidad') * F('insumo__precio_costo'))
        )['total'] or 0

        return Response({
            "periodo": "Últimos 30 días",
            "total_perdida_monetaria": round(float(total_perdida), 2),
            "cantidad_movimientos": mermas.count(),
            "moneda": "USD"
        })

    # --- ACCIÓN 3: EXPORTAR A EXCEL ---
    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        wb = Workbook()
        ws = wb.active
        ws.title = "Inventario RestoX"

        ws.append(['Producto', 'Stock Actual', 'Unidad', 'Estado', 'Precio Costo'])

        for item in self.get_queryset():
            ws.append([
                item.nombre, 
                item.stock_actual, 
                item.unidad_medida, 
                item.estado_stock, # Viene de la @property de tu models.py
                item.precio_costo
            ])

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        response['Content-Disposition'] = 'attachment; filename="reporte_restox.xlsx"'
        wb.save(response)
        return response