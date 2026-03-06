package com.blumbit.compras_ventas.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.blumbit.compras_ventas.entity.Sucursal;

@Repository
public interface SucursalRepository extends ListCrudRepository<Sucursal, Integer> {

}