package com.blumbit.compras_ventas.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.blumbit.compras_ventas.entity.Permiso;

@Repository
public interface PermisoRepository extends ListCrudRepository<Permiso, Integer> {

}
