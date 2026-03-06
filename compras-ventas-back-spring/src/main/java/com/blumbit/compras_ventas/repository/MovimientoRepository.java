package com.blumbit.compras_ventas.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.blumbit.compras_ventas.entity.Movimiento;

@Repository
public interface MovimientoRepository extends ListCrudRepository<Movimiento, Integer> {

}
