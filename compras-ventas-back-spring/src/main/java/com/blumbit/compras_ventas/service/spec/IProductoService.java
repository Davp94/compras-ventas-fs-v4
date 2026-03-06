package com.blumbit.compras_ventas.service.spec;

import java.util.List;

import com.blumbit.compras_ventas.common.PageableRequest;
import com.blumbit.compras_ventas.common.PageableResponse;
import com.blumbit.compras_ventas.dto.request.ProductoFilterCriteria;
import com.blumbit.compras_ventas.dto.request.ProductoRequest;
import com.blumbit.compras_ventas.dto.response.ProductoResponse;

public interface IProductoService {

    PageableResponse<ProductoResponse> getProductosPaginacion(PageableRequest<ProductoFilterCriteria> pageableRequest);
    
    List<ProductoResponse> getProductosByAlmacen(Integer almacenId);

    ProductoResponse createProducto(ProductoRequest productoRequest);
}
