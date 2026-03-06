package com.blumbit.compras_ventas.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.auth.dto.AuthRequest;
import com.blumbit.compras_ventas.auth.dto.AuthResponse;
import com.blumbit.compras_ventas.entity.Usuario;
import com.blumbit.compras_ventas.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${application.jwt.access-token-expiration}")
    private Long expiration;

    private final JwtService jwtService;

    private final UsuarioRepository usuarioRepository;

    private final AuthenticationManager authenticationManager;

    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword(), null));

            Usuario usuario = usuarioRepository.findByNombre(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String accessToken = jwtService.generateAccessToken(usuario);
            String refreshToken = jwtService.generateRefreshToken(usuario);            
            return AuthResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .identifier(usuario.getId())
                    .expiration(expiration)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error de autenticación: " + e.getMessage());
        }
    }

    public AuthResponse refreshToken(String authentication) {
        try {
            
            if(authentication == null || !authentication.startsWith("Bearer ")){
                throw new RuntimeException("Token inválido");
            }

            String token = authentication.substring(7);
            String username = jwtService.extractUsername(token);
            Usuario usuario = usuarioRepository.findByNombre(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            if(!jwtService.isTokenValid(token, usuario)){
                throw new RuntimeException("Token inválido o expirado");
            }
            String accessToken = jwtService.generateAccessToken(usuario);
            // String refreshToken = jwtService.generateRefreshToken(usuario);            
            return AuthResponse.builder()
                    .token(accessToken)
                    .identifier(usuario.getId())
                    .expiration(expiration)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error de autenticación: " + e.getMessage());
        }
    }
}
