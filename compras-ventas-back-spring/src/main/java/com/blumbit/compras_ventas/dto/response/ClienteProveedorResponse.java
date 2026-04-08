package com.blumbit.compras_ventas.dto.response;

import com.blumbit.compras_ventas.entity.ClienteProveedor;

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
public class ClienteProveedorResponse {

    private Integer id;
    private String razonSocial;
    private String nroIdentificacion;
    private String telefono;
    private String correo;
    private String direccion;

    public static ClienteProveedorResponse fromEntity(ClienteProveedor clienteProveedor){
        return ClienteProveedorResponse.builder()
        .id(clienteProveedor.getId())
        .correo(clienteProveedor.getCorreo())
        .direccion(clienteProveedor.getDireccion())
        .nroIdentificacion(clienteProveedor.getNroIdentificacion())
        .razonSocial(clienteProveedor.getRazonSocial())
        .telefono(clienteProveedor.getTelefono())
        .build();
    }

}
