package br.com.barbeariaFroes.barbeariaFroes_api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(req -> {
                    req.requestMatchers(HttpMethod.POST, "/api/login").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/clientes/buscar").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/clientes/buscar-com-agendamentos").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/clientes").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/barbeiros").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/barbeiros/**").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/barbeiros/**").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/agendamentos").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/servicos").permitAll();
                    req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    req.requestMatchers("/error").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/agendamentos/pendentes").authenticated();
                    req.requestMatchers(HttpMethod.PUT, "/agendamentos/**").permitAll();
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // Porta padrão do Vite
        configuration.addAllowedMethod("*"); // Permitir todos os métodos (GET, POST, etc.)
        configuration.addAllowedHeader("*"); // Permitir todos os headers
        configuration.setAllowCredentials(true); // Permitir envio de credenciais (cookies, tokens)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}