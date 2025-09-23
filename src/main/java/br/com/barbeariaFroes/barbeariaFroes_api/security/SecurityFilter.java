package br.com.barbeariaFroes.barbeariaFroes_api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Log para debug
        System.out.println("Request Path: " + path + ", Method: " + method);

        // Ignorar filtro para rotas públicas
        if (path.startsWith("/api/login") || 
            path.startsWith("/clientes") || 
            path.startsWith("/barbeiros") || 
            path.startsWith("/agendamentos") ||
            path.startsWith("/servicos") ||
            path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Para rotas protegidas, exigir token (implementar quando necessário)
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            // Implementar validação de token JWT aqui
            // Exemplo: String jwt = token.replace("Bearer ", "");
            // validarToken(jwt);
            // SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, authorities));
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }
}