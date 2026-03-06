package com.blumbit.compras_ventas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import com.blumbit.compras_ventas.entity.Nota;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotaResponse {

    private Integer id;
    private LocalDate fecha;
    private String tipoNota;
    private BigDecimal impuestos;
    private BigDecimal descuentos;
    private String estadoNota;
    private String observaciones;
    private Integer usuarioId;
    private String usuarioNombre;
    private Integer clienteProveedorId;
    private String clienteProveedorRazonSocial;
    private List<MovimientoResponse> movimientos;

    public static NotaResponse fromEntity(Nota nota) {
        return NotaResponse.builder()
                .id(nota.getId())
                .fecha(nota.getFecha())
                .tipoNota(nota.getTipoNota())
                .impuestos(nota.getImpuestos())
                .descuentos(nota.getDescuentos())
                .estadoNota(nota.getEstadoNota())
                .observaciones(nota.getObservaciones())
                .usuarioId(nota.getUsuario() != null ? nota.getUsuario().getId() : null)
                .usuarioNombre(nota.getUsuario() != null ? nota.getUsuario().getNombre() : null)
                .clienteProveedorId(nota.getClienteProveedor() != null ? nota.getClienteProveedor().getId() : null)
                .clienteProveedorRazonSocial(nota.getClienteProveedor() != null ? nota.getClienteProveedor().getRazonSocial() : null)
                .build();
    }
}
