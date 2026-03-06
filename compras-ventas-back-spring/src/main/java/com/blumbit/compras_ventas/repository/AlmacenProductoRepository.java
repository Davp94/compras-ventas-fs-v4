package com.blumbit.compras_ventas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

import com.blumbit.compras_ventas.entity.AlmacenProducto;

public interface AlmacenProductoRepository extends ListCrudRepository<AlmacenProducto, Integer>{

    List<AlmacenProducto> findByAlmacenId(Integer almacenId);

    Optional<AlmacenProducto> findByAlmacen_IdAndProducto_Id(Integer almacenId, Integer productoId);
}
