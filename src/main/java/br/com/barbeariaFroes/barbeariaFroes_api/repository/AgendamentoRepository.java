package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByBarbeiroIdAndStatus(Long barbeiroId, StatusAgendamento status);
}