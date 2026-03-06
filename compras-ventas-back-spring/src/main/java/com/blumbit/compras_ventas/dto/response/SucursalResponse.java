package com.blumbit.compras_ventas.dto.response;

import com.blumbit.compras_ventas.entity.Sucursal;

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
public class SucursalResponse {
    private Integer id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String ciudad;

    public static SucursalResponse fromEntity(Sucursal sucursal) {
        return SucursalResponse.builder()
                .id(sucursal.getId())
                .nombre(sucursal.getNombre())
                .direccion(sucursal.getDireccion())
                .telefono(sucursal.getTelefono())
                .ciudad(sucursal.getCiudad())
                .build();
    }
}
