package com.blumbit.compras_ventas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PermisoResponse {

    private Integer id;

    private String nombre;

    private String recurso;

    private String accion;
}
