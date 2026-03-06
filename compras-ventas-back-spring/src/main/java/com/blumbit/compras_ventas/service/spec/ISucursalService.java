package com.blumbit.compras_ventas.service.spec;

import java.util.List;

import com.blumbit.compras_ventas.dto.response.AlmacenResponse;
import com.blumbit.compras_ventas.dto.response.SucursalResponse;

public interface ISucursalService {

    List<SucursalResponse> getAllSucursales();

    List<AlmacenResponse> getAlmacenesBySucursal(Integer sucursalId);
}
