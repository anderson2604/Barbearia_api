package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Horario;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    
    // Encontra todos os horários disponíveis para um barbeiro específico
    List<Horario> findByBarbeiroIdOrderByDataAscHoraAsc(Long barbeiroId);
    
    List<Horario> findByBarbeiroId(Long barbeiroId);
    
    List<Horario> findByBarbeiroIdAndData(Long barbeiroId, LocalDate data);

    List<Horario> findByBarbeiroIdAndDisponivelTrue(Long barbeiroId);
    
    // Método para buscar horários disponíveis a partir de hoje
    @Query("SELECT h FROM Horario h LEFT JOIN Agendamento a ON a.barbeiro.id = h.barbeiro.id " +
    	       "AND a.dataHora = CAST((h.data || ' ' || h.hora) AS TIMESTAMP) " +
    	       "WHERE h.barbeiro.id = :barbeiroId AND h.disponivel = true " +
    	       "AND (h.data > :dataAtual OR (h.data = :dataAtual AND h.hora >= :horaAtual)) " +
    	       "AND (a.id IS NULL OR a.status NOT IN (br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento.PENDENTE, br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento.CONFIRMADO)) " +
    	       "ORDER BY h.data ASC, h.hora ASC")
    	List<Horario> findByBarbeiroIdAndDataHoraGreaterThanEqual(
    	    @Param("barbeiroId") Long barbeiroId,
    	    @Param("dataAtual") LocalDate dataAtual,
    	    @Param("horaAtual") LocalTime horaAtual
    	);
}