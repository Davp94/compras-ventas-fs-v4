package com.blumbit.compras_ventas.repository;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

import com.blumbit.compras_ventas.entity.Persona;

public interface PersonaRepository extends ListCrudRepository<Persona, Integer>{

    Optional<Persona> findByUsuario_Id(Integer usuarioId);
}
