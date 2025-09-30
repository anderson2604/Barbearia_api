package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // Busca agendamentos pendentes por ID do barbeiro
    List<Agendamento> findByBarbeiroIdAndStatus(Long barbeiroId, StatusAgendamento status);

    // Busca agendamentos confirmados por ID do barbeiro
    //List<Agendamento> findByBarbeiroIdAndStatus(Long barbeiroId, StatusAgendamento status);

    // Busca agendamentos confirmados atrasados (dataHora anterior ao horário atual)
    List<Agendamento> findByBarbeiroIdAndStatusAndDataHoraLessThan(Long barbeiroId, StatusAgendamento status, LocalDateTime dataHora);

    // Método opcional para buscar agendamentos futuros (pode ser usado no frontend)
    @Query("SELECT a FROM Agendamento a WHERE a.barbeiro.id = :barbeiroId AND a.status = :status AND a.dataHora >= :dataHora")
    List<Agendamento> findByBarbeiroIdAndStatusAndDataHoraGreaterThanEqual(
        @Param("barbeiroId") Long barbeiroId,
        @Param("status") StatusAgendamento status,
        @Param("dataHora") LocalDateTime dataHora
    );
}