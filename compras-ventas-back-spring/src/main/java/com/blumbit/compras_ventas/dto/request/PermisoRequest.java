package com.blumbit.compras_ventas.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PermisoRequest {

    private String nombre;

    private String recurso;

    private String accion;

}
