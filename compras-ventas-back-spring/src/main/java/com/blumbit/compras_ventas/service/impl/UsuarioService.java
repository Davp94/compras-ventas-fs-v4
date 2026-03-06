package com.blumbit.compras_ventas.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.dto.request.UsuarioRequest;
import com.blumbit.compras_ventas.dto.response.UsuarioResponse;
import com.blumbit.compras_ventas.entity.Persona;
import com.blumbit.compras_ventas.entity.Rol;
import com.blumbit.compras_ventas.entity.Usuario;
import com.blumbit.compras_ventas.repository.PersonaRepository;
import com.blumbit.compras_ventas.repository.RolRepository;
import com.blumbit.compras_ventas.repository.UsuarioRepository;
import com.blumbit.compras_ventas.service.spec.IUsuarioService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PersonaRepository personaRepository;

    private final RolRepository rolRepository;

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PersonaRepository personaRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.personaRepository = personaRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UsuarioResponse> findAllUsuarios() {
        try{
            return usuarioRepository.findAll().stream().map(usuario -> {
                Persona persona = personaRepository.findByUsuario_Id(usuario.getId())
                    .orElseThrow(()-> new RuntimeException("Persona no encontrada para el usuario con ID: " + usuario.getId()));
                return UsuarioResponse.fromEntityUsuario(usuario, persona);
            }).collect(Collectors.toList());
        } catch (Exception e){
            log.error("Error al obtener los usuarios: {}", e.getMessage());
            throw e;
        }   
    }

    @Override
    public UsuarioResponse findUsuarioById(Integer id) {
        try {
             Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Usuari no encontrado con ID: " + id));
          return UsuarioResponse.fromEntityUsuario(usuario, usuario.getPersona());  
        } catch (Exception e) {
            log.error("Error al obtener el usuario con id: {}", id);
            throw e;
        }
    }

    @Override
    public UsuarioResponse createUsuario(UsuarioRequest usuarioRequest) {
        try {
            Usuario usuarioToCreate = UsuarioRequest.toEntityUsuario(usuarioRequest);
            //TODO add generator to username
            usuarioToCreate.setNombre(usuarioRequest.getCorreo());
            if(usuarioToCreate.getNombre().length() > 50){
                throw new RuntimeException("El nombre de usuario no puede tener más de 50 caracteres");
            }
            //add roles to usuario
            List<Rol> roles = rolRepository.findAllById(usuarioRequest.getRoles());
            if(roles.isEmpty()){
                throw new RuntimeException("No se encontraron roles para los IDs proporcionados");
            }
            usuarioToCreate.setRoles(roles);
            usuarioToCreate.setPassword(passwordEncoder.encode(usuarioRequest.getPassword()));
            Usuario usuarioCreated = usuarioRepository.save(usuarioToCreate);
            Persona personaToCreate = UsuarioRequest.toEntityPersona(usuarioRequest);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            personaToCreate.setFechaNacimiento(LocalDate.parse(usuarioRequest.getFechaNacimiento(), formatter));
            personaToCreate.setUsuario(usuarioCreated);
            return UsuarioResponse
            .fromEntityUsuario(usuarioCreated, personaRepository.save(personaToCreate));
        } catch (Exception e) {
            log.error("Error al crear el usuario: {}", e);
            throw e;
        }
    }

    @Override
    public UsuarioResponse updateUsuario(Integer id, UsuarioRequest usuarioRequest) {
       try {
        Usuario usuarioRetrieved = usuarioRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuarioRetrieved.setCorreo(usuarioRequest.getCorreo());
        usuarioRetrieved.setPassword(usuarioRequest.getPassword());
        usuarioRetrieved.setNombre(usuarioRequest.getCorreo());    
        Persona personaRetrieved = personaRepository.findById(usuarioRetrieved.getPersona().getId())
            .orElseThrow(()-> new RuntimeException("Persona no encontrada para el usuario con ID: " + id));
        personaRetrieved.setNombres(usuarioRequest.getNombres());
        personaRetrieved.setApellidos(usuarioRequest.getApellidos());
        personaRetrieved.setFechaNacimiento(LocalDate.parse(usuarioRequest.getFechaNacimiento()));
        personaRetrieved.setTelefono(usuarioRequest.getTelefono());
        personaRetrieved.setDireccion(usuarioRequest.getDireccion());
        return UsuarioResponse.fromEntityUsuario(usuarioRepository.save(usuarioRetrieved), personaRepository.save(personaRetrieved));
       } catch (Exception e) {
         throw new RuntimeException("Usuario o persona no encontrado");
       }
    }

    @Override
    public void deleteById(Integer id) {
        try {
          usuarioRepository.deleteById(id);  
        } catch (Exception e) {
            throw e;
        }
    }

}
