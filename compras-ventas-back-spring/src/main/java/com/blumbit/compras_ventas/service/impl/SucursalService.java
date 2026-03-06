package com.blumbit.compras_ventas.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.dto.response.AlmacenResponse;
import com.blumbit.compras_ventas.dto.response.SucursalResponse;
import com.blumbit.compras_ventas.repository.AlmacenRepository;
import com.blumbit.compras_ventas.repository.SucursalRepository;
import com.blumbit.compras_ventas.service.spec.ISucursalService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SucursalService implements ISucursalService{

    private final SucursalRepository sucursalRepository;

    private final AlmacenRepository almacenRepository;

    @Override
    public List<SucursalResponse> getAllSucursales() {
        return sucursalRepository.findAll().stream().map(SucursalResponse::fromEntity).toList();
    }

    @Override
    public List<AlmacenResponse> getAlmacenesBySucursal(Integer sucursalId) {
       return almacenRepository.findBySucursalId(sucursalId).stream().map(AlmacenResponse::fromEntity).toList();
    }

}
