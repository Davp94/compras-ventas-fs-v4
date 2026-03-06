package com.blumbit.compras_ventas.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.dto.request.PermisoRequest;
import com.blumbit.compras_ventas.dto.response.PermisoResponse;
import com.blumbit.compras_ventas.entity.Permiso;
import com.blumbit.compras_ventas.repository.PermisoRepository;
import com.blumbit.compras_ventas.service.spec.IPermisoService;

@Service
public class PermisoService implements IPermisoService {

    @Autowired
    private PermisoRepository permisoRepository;

    @Override
    public List<PermisoResponse> findAllPermisos() {

        List<Permiso> permisosRetrieved = permisoRepository.findAll();
        List<PermisoResponse> permisosResponse = new ArrayList<>();
        for (Permiso permiso : permisosRetrieved) {
            PermisoResponse permisoResponse = new PermisoResponse();
            permisoResponse.setId(permiso.getId());
            permisoResponse.setNombre(permiso.getNombre());
            permisoResponse.setAccion(permiso.getAccion());
            permisoResponse.setRecurso(permiso.getRecurso());
            permisosResponse.add(permisoResponse);
        }
        return permisosResponse;
    }

    @Override
    public PermisoResponse findPermisoById(Integer id) {
        Permiso permisoRetrieved = permisoRepository.findById(id).get();
        PermisoResponse permisoResponse = new PermisoResponse();
        permisoResponse.setId(permisoRetrieved.getId());
        permisoResponse.setNombre(permisoRetrieved.getNombre());
        permisoResponse.setAccion(permisoRetrieved.getAccion());
        permisoResponse.setRecurso(permisoRetrieved.getRecurso());
        return permisoResponse;
    }

    @Override
    public PermisoResponse createPermiso(PermisoRequest permisoRequest) {
        Permiso permisoToCreate = new Permiso();
        permisoToCreate.setNombre(permisoRequest.getNombre());
        permisoToCreate.setAccion(permisoRequest.getAccion());
        permisoToCreate.setRecurso(permisoRequest.getRecurso());
        Permiso permisoSaved = permisoRepository.save(permisoToCreate);
        PermisoResponse permisoResponse = new PermisoResponse();
        permisoResponse.setId(permisoSaved.getId());
        permisoResponse.setNombre(permisoSaved.getNombre());
        permisoResponse.setAccion(permisoSaved.getAccion());
        permisoResponse.setRecurso(permisoSaved.getRecurso());
        return permisoResponse;
    }

}
