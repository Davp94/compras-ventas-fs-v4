package com.blumbit.compras_ventas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.dto.request.RolRequest;
import com.blumbit.compras_ventas.dto.response.RolDetailResponse;
import com.blumbit.compras_ventas.dto.response.RolResponse;
import com.blumbit.compras_ventas.service.spec.IRolService;


@RestController
@RequestMapping("/rol")
public class RolController {

    @Autowired
    private IRolService rolService;

    @GetMapping
    public List<RolResponse> listarRoles(){
        return rolService.findAllRoles();
    }

    @GetMapping("/{rolId}")
    public RolDetailResponse obtenerRolPorId(@PathVariable Integer rolId){
        return rolService.findRolById(rolId);
    }

    @PostMapping
    public RolResponse crearRol(@RequestBody RolRequest rolRequest){
        return rolService.createRol(rolRequest);
    }

    @PutMapping("/{rolId}")
    public RolResponse actualizarRol(@PathVariable Integer rolId, @RequestBody RolRequest rolRequest){
        return rolService.updateRol(rolId, rolRequest);
    }

    @DeleteMapping("/{id}")
    public void borrarRol(@PathVariable Integer id){
        rolService.deleteById(id);
    }

}
