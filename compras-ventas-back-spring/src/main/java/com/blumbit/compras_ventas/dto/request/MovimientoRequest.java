package com.blumbit.compras_ventas.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

import com.blumbit.compras_ventas.entity.Movimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovimientoRequest {

    @NotNull(message = "El producto es requerido")
    private Integer productoId;

    @NotNull(message = "El almacén es requerido")
    private Integer almacenId;

    @NotNull(message = "La cantidad es requerida")
    @Positive(message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    @NotNull(message = "El tipo de movimiento es requerido")
    private String tipoMovimiento;

    @NotNull(message = "El precio unitario de compra es requerido")
    private BigDecimal precioUnitarioCompra;

    @NotNull(message = "El precio unitario de venta es requerido")
    private BigDecimal precioUnitarioVenta;

    private String observaciones;

    public static Movimiento toEntity(MovimientoRequest movimientoRequest) {
        return Movimiento.builder()
                .cantidad(movimientoRequest.getCantidad())
                .precioUnitarioCompra(movimientoRequest.getPrecioUnitarioCompra())
                .precioUnitarioVenta(movimientoRequest.getPrecioUnitarioVenta())
                .observaciones(movimientoRequest.getObservaciones())
                .build();
    }
}
