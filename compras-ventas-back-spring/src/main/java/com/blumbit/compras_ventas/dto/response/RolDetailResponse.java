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
public class RolDetailResponse {
    private Integer id;
    private String nombre;
    private String descripcion;
    private List<Integer> permisos;

    public static RolDetailResponse fromEntity(Rol rol, List<Integer> permisosIds) {
        return RolDetailResponse.builder()
                .descripcion(rol.getDescripcion())
                .nombre(rol.getNombreCompleto())
                .permisos(permisosIds)
                .build();
    }
}
