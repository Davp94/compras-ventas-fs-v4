package com.blumbit.compras_ventas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.blumbit.compras_ventas.entity.Rol;

@Repository
public interface RolRepository extends ListCrudRepository<Rol, Integer>{

    //query methods
    Optional<Rol> findByNombreCompleto(String nombre); //select * from rol where nombre like ?nombre

    //sql nativo
    @Query(value = "select * from rol where nombre like '?1'", nativeQuery = true)
    Optional<Rol> findRolPorNombre(String nombre);

    //JPQL
    // @Query(value = "select Rol from Rol where nombreCompleto like '?1'")
    // Optional<Rol> findRolPorNombreJpql(String nombre);
}
