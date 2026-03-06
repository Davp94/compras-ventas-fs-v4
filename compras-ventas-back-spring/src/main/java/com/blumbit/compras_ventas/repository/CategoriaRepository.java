package com.blumbit.compras_ventas.repository;

import org.springframework.data.repository.ListCrudRepository;

import com.blumbit.compras_ventas.entity.Categoria;

public interface CategoriaRepository extends ListCrudRepository<Categoria, Integer>{

    
}
