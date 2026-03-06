package com.blumbit.compras_ventas.service.spec;

import java.util.List;

import com.blumbit.compras_ventas.dto.request.NotaRequest;
import com.blumbit.compras_ventas.dto.request.MovimientoRequest;
import com.blumbit.compras_ventas.dto.response.NotaResponse;
import com.blumbit.compras_ventas.dto.response.MovimientoResponse;

public interface INotaService {


    List<NotaResponse> getAllNotas();

    byte[] createNota(NotaRequest notaRequest);

}
