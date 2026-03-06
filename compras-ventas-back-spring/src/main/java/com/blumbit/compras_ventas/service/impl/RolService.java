package com.blumbit.compras_ventas.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.dto.request.RolRequest;
import com.blumbit.compras_ventas.dto.response.RolDetailResponse;
import com.blumbit.compras_ventas.dto.response.RolResponse;
import com.blumbit.compras_ventas.entity.Rol;
import com.blumbit.compras_ventas.repository.PermisoRepository;
import com.blumbit.compras_ventas.repository.RolRepository;
import com.blumbit.compras_ventas.service.spec.IRolService;

@Service
public class RolService implements IRolService {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Override
    public List<RolResponse> findAllRoles() {
        return rolRepository.findAll().stream()
                .map(rol -> RolResponse.fromEntity(rol))
                .collect(Collectors.toList());
    }

    @Override
    public RolDetailResponse findRolById(Integer id) {
        Rol rolRetrieved = rolRepository.findById(id).get();
        return RolDetailResponse
                .fromEntity(rolRetrieved, rolRetrieved.getPermisos().stream().map(p -> p.getId()).toList());
    }

    @Override
    public RolResponse findRolByNombre(String nombre) {
        return RolResponse.fromEntity(rolRepository.findByNombreCompleto(nombre).get());
    }

    @Override
    public RolResponse createRol(RolRequest rol) {

        Rol rolToCreate = RolRequest.toEntity(rol);
        rolToCreate.setPermisos(rol.getPermisos().stream()
                .map(permisoId -> permisoRepository.findById(permisoId).get())
                .collect(Collectors.toList()));

        return RolResponse.fromEntity(rolRepository.save(rolToCreate));
    }

    @Override
    public RolResponse updateRol(Integer id, RolRequest rol) {
        Rol rolRetrieved = rolRepository.findById(id).get();
        rolRetrieved.setNombreCompleto(rol.getNombre());
        rolRetrieved.setDescripcion(rol.getDescripcion());
        rolRetrieved.setPermisos(rol.getPermisos().stream()
                .map(permisoId -> permisoRepository.findById(permisoId).get())
                .collect(Collectors.toList()));
        return RolResponse.fromEntity(rolRepository.save(rolRetrieved));
    }

    @Override
    public void deleteById(Integer id) {
        rolRepository.deleteById(id);
    }

}
