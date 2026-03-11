from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from .models import Insumo, Categoria, Negocio, Movimiento
from .serializers import InsumoSerializer, CategoriaSerializer, NegocioSerializer, MovimientoSerializer

class NegocioViewSet(viewsets.ModelViewSet):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer
    permission_classes = [IsAuthenticated]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

class InsumoViewSet(viewsets.ModelViewSet):
    serializer_class = InsumoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        negocio_id = self.request.query_params.get('negocio')
        if negocio_id:
            return Insumo.objects.filter(negocio_id=negocio_id)
        return Insumo.objects.all()

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        insumo_id = request.data.get('insumo')
        tipo = request.data.get('tipo')
        cantidad_raw = request.data.get('cantidad')
        negocio_id = request.data.get('negocio')

        try:
            # La clave para evitar el error anterior es Decimal(str(...))
            cantidad = Decimal(str(cantidad_raw))
            insumo = Insumo.objects.get(id=insumo_id)
            
            if tipo == 'S':
                if insumo.stock_actual < cantidad:
                    return Response({"error": "Stock insuficiente"}, status=status.HTTP_400_BAD_REQUEST)
                insumo.stock_actual -= cantidad
            else:
                insumo.stock_actual += cantidad
            
            insumo.save()

            # Guardar el registro del movimiento
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Insumo.DoesNotExist:
            return Response({"error": "Insumo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)