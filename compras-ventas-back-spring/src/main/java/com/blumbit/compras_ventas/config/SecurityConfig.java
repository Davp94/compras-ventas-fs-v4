package com.blumbit.compras_ventas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.blumbit.compras_ventas.auth.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;

    private final JwtAuthenticationFilter jwtFilter;

    //@Order(1)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        try {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/login").permitAll()
                    .requestMatchers("/health").permitAll()
                    .requestMatchers("/auth/register").permitAll()
                    .requestMatchers("/ciudades").permitAll()
                    .requestMatchers("/v3/api-docs").permitAll()
                    .requestMatchers("/v3/api-docs/**").permitAll()
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers("/productos").hasAnyAuthority("VER_PRODUCTOS", "CREAR_PRODUCTO")
                    .requestMatchers("/productos/paginacion", "/productos/paginacion/**").hasAuthority("ROL_ADMIN")
                    .requestMatchers("/notas", "/notas/**").hasAuthority("ROL_CAJERO")
                    .anyRequest().authenticated()
                )
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
            return http.build();
        } catch (Exception e) {
            throw new RuntimeException("Error configuring security filter chain", e);
        }
    }

    // @Order(2)
    // @Bean
    // public SecurityFilterChain securityFilterChain2(HttpSecurity http) {
    //     try {
    //         http
    //             .csrf(csrf -> csrf.disable())
    //             .authorizeHttpRequests(auth -> auth
    //                 .requestMatchers("/auth/login").permitAll()
    //                 .requestMatchers("/auth/register").permitAll()
    //                 .requestMatchers("/ciudades").permitAll()
    //                 .anyRequest().authenticated()
    //             )
    //             .cors(Customizer.withDefaults())
    //             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    //             .authenticationProvider(authenticationProvider);
    //         return http.build();
    //     } catch (Exception e) {
    //         throw new RuntimeException("Error configuring security filter chain", e);
    //     }
    // }
}
