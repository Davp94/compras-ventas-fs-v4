package com.blumbit.compras_ventas.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.common.PageableRequest;
import com.blumbit.compras_ventas.common.PageableResponse;
import com.blumbit.compras_ventas.dto.request.ProductoFilterCriteria;
import com.blumbit.compras_ventas.dto.request.ProductoRequest;
import com.blumbit.compras_ventas.dto.response.ProductoResponse;
import com.blumbit.compras_ventas.service.spec.IProductoService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final IProductoService productoService;

    @GetMapping("/paginacion")
    @PreAuthorize("hasAuthority('ROL_ADMIN') or hasAuthority('ROL_USER') or hasAuthority('VER_PRODUCTOS')")
    public ResponseEntity<PageableResponse<ProductoResponse>> getProductosPaginacion(
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(defaultValue = "0") Integer pageNumber,
        @RequestParam(defaultValue = "id") String sortField,
        @RequestParam(defaultValue = "asc") String sortOrder,
        @RequestParam(required = false) String filterValue,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String descripcion,
        @RequestParam(required = false) String codigoBarra,
        @RequestParam(required = false) String marca,
        @RequestParam(required = false) String nombreCategoria,
        @RequestParam(required = false) Integer almacenId) {

           ProductoFilterCriteria criteria = ProductoFilterCriteria.builder()
            .nombre(nombre)
            .descripcion(descripcion)
            .codigoBarra(codigoBarra)
            .marca(marca)
            .nombreCategoria(nombreCategoria)
            .almacenId(almacenId)
            .build();
           PageableRequest<ProductoFilterCriteria> pageableRequest = PageableRequest.<ProductoFilterCriteria>builder()
            .pageNumber(pageNumber)
            .pageSize(pageSize)
            .sortField(sortField)
            .sortOrder(sortOrder)
            .criterials(criteria)
            .filterValue(filterValue)
            .build(); 
        return ResponseEntity.ok(productoService.getProductosPaginacion(pageableRequest));
    }

    @GetMapping("/almacen/{id}")
    public ResponseEntity<List<ProductoResponse>> getProductosByAlmacen(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.getProductosByAlmacen(id));
    }
    
    @PostMapping()
    public ResponseEntity<ProductoResponse> createProducto(@ModelAttribute ProductoRequest productoRequest) {
        
        return ResponseEntity.ok(productoService.createProducto(productoRequest));
    }
    
    
}
