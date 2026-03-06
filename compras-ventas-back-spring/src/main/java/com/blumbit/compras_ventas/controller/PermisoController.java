package com.blumbit.compras_ventas.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.dto.request.PermisoRequest;
import com.blumbit.compras_ventas.dto.response.PermisoResponse;
import com.blumbit.compras_ventas.service.spec.IPermisoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/permiso")
public class PermisoController {

    @Autowired
    private IPermisoService permisoService;

    @GetMapping
    public List<PermisoResponse> getPermisos() {
        return permisoService.findAllPermisos();
    }

    @PostMapping
    public PermisoResponse createPermiso(@RequestBody PermisoRequest permisoRequest) {
        return permisoService.createPermiso(permisoRequest);
    }
    
}
