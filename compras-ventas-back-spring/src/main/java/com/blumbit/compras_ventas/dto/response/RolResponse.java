package com.blumbit.compras_ventas.dto.response;

import java.util.List;

import com.blumbit.compras_ventas.entity.Rol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RolResponse {
    private Integer id;
    private String nombre;
    private String descripcion;

    public static RolResponse fromEntity(Rol rol) {
        return RolResponse.builder()
                .id(rol.getId())
                .descripcion(rol.getDescripcion())
                .nombre(rol.getNombreCompleto())
                .build();
    }
}
