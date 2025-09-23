package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
    UserDetails findByLogin(String login);
}