package com.blumbit.compras_ventas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.blumbit.compras_ventas.entity.Nota;

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
public class NotaRequest {

    @NotBlank(message = "El tipo de nota es requerido")
    @Pattern(regexp = "^(Compra|Venta)$", message = "El tipo de movimiento debe ser 'Compra' o 'Venta'")
    private String tipoNota;

    private BigDecimal impuestos;

    private BigDecimal descuentos;

    private String observaciones;

    @NotNull(message = "El usuario es requerido")
    private Integer usuarioId;

    @NotNull(message = "El cliente/proveedor es requerido")
    private Integer clienteProveedorId;

    private List<MovimientoRequest> movimientos;

    public static Nota toEntity(NotaRequest notaRequest) {
        return Nota.builder()
                .tipoNota(notaRequest.getTipoNota())
                .impuestos(notaRequest.getImpuestos())
                .descuentos(notaRequest.getDescuentos())
                .observaciones(notaRequest.getObservaciones())
                .fecha(LocalDate.now())
                .build();
    }
}
