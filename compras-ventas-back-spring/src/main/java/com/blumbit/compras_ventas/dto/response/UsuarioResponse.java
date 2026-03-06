package com.blumbit.compras_ventas.dto.response;

import java.time.format.DateTimeFormatter;
import java.util.List;

import com.blumbit.compras_ventas.entity.Persona;
import com.blumbit.compras_ventas.entity.Usuario;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioResponse {

    private Integer id;

    private String nombre;

    private String correo;

    private String nombres;

    private String apellidos;

    private String fechaNacimiento;

    private String telefono;

    private String direccion;

    private List<Integer> roles;

    public static UsuarioResponse fromEntityUsuario(Usuario usuario, Persona persona) {
        return UsuarioResponse.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .correo(usuario.getCorreo())
            .nombres(persona.getNombres())
            .apellidos(persona.getApellidos())
            .fechaNacimiento(persona.getFechaNacimiento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            .telefono(persona.getTelefono())
            .direccion(persona.getDireccion())
            .roles(usuario.getRoles().stream().map(rol -> rol.getId()).toList())
            .build();
    }
}
