package com.blumbit.compras_ventas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import com.blumbit.compras_ventas.entity.Movimiento;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovimientoResponse {

    private Integer id;
    private Integer notaId;
    private Integer productoId;
    private String productoNombre;
    private Integer almacenId;
    private Integer cantidad;
    private String tipoMovimiento;
    private BigDecimal precioUnitarioCompra;
    private BigDecimal precioUnitarioVenta;
    private String observaciones;

    public static MovimientoResponse fromEntity(Movimiento movimiento) {
        return MovimientoResponse.builder()
                .id(movimiento.getId())
                .notaId(movimiento.getNota() != null ? movimiento.getNota().getId() : null)
                .productoId(movimiento.getProducto() != null ? movimiento.getProducto().getId() : null)
                .productoNombre(movimiento.getProducto() != null ? movimiento.getProducto().getNombre() : null)
                .almacenId(movimiento.getAlmacen() != null ? movimiento.getAlmacen().getId() : null)
                .cantidad(movimiento.getCantidad())
                .tipoMovimiento(movimiento.getTipoMovimiento().toString())
                .precioUnitarioCompra(movimiento.getPrecioUnitarioCompra())
                .precioUnitarioVenta(movimiento.getPrecioUnitarioVenta())
                .observaciones(movimiento.getObservaciones())
                .build();
    }
}
