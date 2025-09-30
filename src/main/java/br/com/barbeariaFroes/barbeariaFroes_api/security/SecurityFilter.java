package br.com.barbeariaFroes.barbeariaFroes_api.security;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Log para debug
        System.out.println("Request Path: " + path + ", Method: " + method);

        // Ignorar filtro para rotas públicas
        if (path.startsWith("/api/login") ||
            path.startsWith("/clientes") ||
            path.startsWith("/barbeiros") ||
            path.startsWith("/servicos") ||
            path.startsWith("/error") ||
            (path.startsWith("/agendamentos") && method.equals("POST"))){
            filterChain.doFilter(request, response);
            return;
        }

        // Validar token para rotas protegidas (incluindo PUT /agendamentos/**)
        String token = recoverToken(request);
        if (token != null) {
            try {
                // Validar token JWT e extrair o subject (login)
                String login = tokenService.validarToken(token);
                if (!login.isEmpty()) {
                    // Buscar barbeiro no banco de dados
                    Barbeiro barbeiro = (Barbeiro) barbeiroRepository.findByLogin(login);
                    if (barbeiro != null) {
                        // Configurar autenticação no Spring Security
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(barbeiro, null, barbeiro.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        return;
                    }
                } else {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.replace("Bearer ", "");
        }
        return null;
    }
}