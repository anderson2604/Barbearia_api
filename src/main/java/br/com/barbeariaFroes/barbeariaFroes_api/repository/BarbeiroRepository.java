package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
    UserDetails findByLogin(String login);
    
    @Query("SELECT COUNT(b) > 0 FROM Barbeiro b WHERE b.email = :email AND b.id <> :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
}