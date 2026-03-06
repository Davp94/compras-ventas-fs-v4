package com.blumbit.compras_ventas.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.blumbit.compras_ventas.entity.Nota;

@Repository
public interface NotaRepository extends ListCrudRepository<Nota, Integer> {

}
