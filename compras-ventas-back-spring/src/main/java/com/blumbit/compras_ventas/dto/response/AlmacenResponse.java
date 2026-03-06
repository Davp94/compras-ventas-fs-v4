package com.blumbit.compras_ventas.dto.response;

import com.blumbit.compras_ventas.entity.Almacen;
import com.blumbit.compras_ventas.entity.Sucursal;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class AlmacenResponse {
    private Integer id;

    private String nombre;

    private String codigo;

    private String descripcion;

    private String direccion;

    private String telefono;

    private String ciudad;

    public static AlmacenResponse fromEntity(Almacen almacen) {
        return AlmacenResponse.builder()
                .id(almacen.getId())
                .nombre(almacen.getNombre())
                .codigo(almacen.getCodigo())
                .descripcion(almacen.getDescripcion())
                .direccion(almacen.getDireccion())
                .telefono(almacen.getTelefono())
                .ciudad(almacen.getCiudad())
                .build();
    }
}
