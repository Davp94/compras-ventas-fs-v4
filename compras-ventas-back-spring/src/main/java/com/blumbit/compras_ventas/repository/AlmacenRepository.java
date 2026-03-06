package com.blumbit.compras_ventas.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import com.blumbit.compras_ventas.entity.Almacen;

public interface AlmacenRepository extends ListCrudRepository<Almacen, Integer> {

    List<Almacen> findBySucursalId(Integer sucursalId);
}
