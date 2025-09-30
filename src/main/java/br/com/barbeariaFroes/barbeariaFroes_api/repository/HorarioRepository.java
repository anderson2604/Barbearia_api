package br.com.barbeariaFroes.barbeariaFroes_api.repository;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    
    // Encontra todos os horários disponíveis para um barbeiro específico
    List<Horario> findByBarbeiroId(Long barbeiroId);
    
    // Encontra horários disponíveis para um barbeiro em uma data específica
    List<Horario> findByBarbeiroIdAndData(Long barbeiroId, LocalDate data);

	List<Horario> findByBarbeiroIdAndDisponivelTrue(Long barbeiroId);
}