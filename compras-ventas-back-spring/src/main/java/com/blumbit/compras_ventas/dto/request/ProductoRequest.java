package com.blumbit.compras_ventas.dto.request;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import com.blumbit.compras_ventas.entity.Producto;

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
public class ProductoRequest {

    private String nombre;
    private String descripcion;
    private BigDecimal precioVentaActual;
    private String marca;
    private MultipartFile file; //base64->File
    private Integer categoriaId;

    public static Producto toEntity(ProductoRequest productoRequest){
        return Producto.builder()
            .nombre(productoRequest.getNombre())
            .descripcion(productoRequest.getDescripcion())
            .precioVentaActual(productoRequest.getPrecioVentaActual())
            .marca(productoRequest.getMarca())
            .build();
    }

}
