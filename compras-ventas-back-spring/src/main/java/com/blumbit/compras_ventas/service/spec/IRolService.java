package com.blumbit.compras_ventas.service.spec;

import java.util.List;

import com.blumbit.compras_ventas.dto.request.RolRequest;
import com.blumbit.compras_ventas.dto.response.RolDetailResponse;
import com.blumbit.compras_ventas.dto.response.RolResponse;

public interface IRolService {

    List<RolResponse> findAllRoles();

    RolDetailResponse findRolById(Integer id);

    RolResponse findRolByNombre(String nombre);

    RolResponse createRol(RolRequest rol);

    RolResponse updateRol(Integer id, RolRequest rol);

    void deleteById(Integer id);
    
}
