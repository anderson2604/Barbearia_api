package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import br.com.barbeariaFroes.barbeariaFroes_api.model.HorarioDisponivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HorarioDisponivelRepository extends JpaRepository<HorarioDisponivel, Long> {
    
    // Encontra todos os horários disponíveis para um barbeiro específico
    List<HorarioDisponivel> findByBarbeiroId(Long barbeiroId);
    
    // Encontra horários disponíveis para um barbeiro em uma data específica
    List<HorarioDisponivel> findByBarbeiroIdAndData(Long barbeiroId, LocalDate data);

	List<HorarioDisponivel> findByBarbeiroIdAndDisponivelTrue(Long barbeiroId);
}