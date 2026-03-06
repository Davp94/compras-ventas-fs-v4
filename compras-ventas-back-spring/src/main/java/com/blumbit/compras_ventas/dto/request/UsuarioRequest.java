package com.blumbit.compras_ventas.dto.request;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.blumbit.compras_ventas.entity.Persona;
import com.blumbit.compras_ventas.entity.Usuario;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRequest {

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    @Size(max = 100, message = "El correo debe tener maximo 100 caracteres")
    private String correo;
    
    @NotBlank(message = "El password es obligatorio")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$",
        message = "El password debe tener 8 a 16 digitos con minusculas mayusculas y al menos un numero y caracter especial"
    )
    private String password;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres deben tener máximo 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos deben tener máximo 100 caracteres")
    private String apellidos;

    @Pattern(
        regexp = "^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[012])/\\d{4}$",
        message = "La fecha de nacimiento debe estar en formato dd/MM/yyyy"
    )
    private String fechaNacimiento;

    @Size(max = 50, message = "El género debe tener máximo 50 caracteres")
    @NotBlank(message = "El género es obligatorio")
    private String genero;

    @Size(max = 100, message = "El teléfono debe tener máximo 100 caracteres")
    private String telefono;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotBlank(message = "La nacionalidad es obligatoria")
    @Size(max = 100, message = "La nacionalidad debe tener máximo 100 caracteres")
    private String nacionalidad;

    @NotEmpty(message = "Debe asignar al menos un rol al usuario")
    private List<Integer> roles;

    public static Usuario toEntityUsuario(UsuarioRequest usuarioRequest){
        return Usuario.builder()
        .correo(usuarioRequest.getCorreo())
        .password(usuarioRequest.getPassword())
        .build();
    }

    public static Persona toEntityPersona(UsuarioRequest usuarioRequest){
        return Persona.builder()
        .nombres(usuarioRequest.getNombres())
        .apellidos(usuarioRequest.getApellidos())
        //.fechaNacimiento(LocalDate.parse(usuarioRequest.getFechaNacimiento()))
        .genero(usuarioRequest.getGenero())
        .telefono(usuarioRequest.getTelefono())
        .direccion(usuarioRequest.getDireccion())
        .nacionalidad(usuarioRequest.getNacionalidad())
        .build();
    }

}
