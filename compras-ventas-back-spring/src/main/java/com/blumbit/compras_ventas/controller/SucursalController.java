package com.blumbit.compras_ventas.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.dto.response.AlmacenResponse;
import com.blumbit.compras_ventas.dto.response.SucursalResponse;
import com.blumbit.compras_ventas.service.spec.ISucursalService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping("/sucursal")
public class SucursalController {

    private final ISucursalService sucursalService;

    @GetMapping()
    public ResponseEntity<List<SucursalResponse>> findAllSucursales() {
        return ResponseEntity.ok(sucursalService.getAllSucursales());
    }

    @GetMapping("/almacen/{sucursalId}")
    public ResponseEntity<List<AlmacenResponse>> findAlmacenesBySucursal(@PathVariable Integer sucursalId) {
        return ResponseEntity.ok(sucursalService.getAlmacenesBySucursal(sucursalId));
    }
    
    
}
