package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.DadosAgendamentoClienteDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Cliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Horario;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Servico;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.AgendamentoRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ClienteRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.HorarioRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ServicoRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository repository;
    
    @Autowired
    private BarbeiroRepository barbeiroRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @GetMapping("/pendentes")
    public ResponseEntity<List<Agendamento>> listarPendentes(@AuthenticationPrincipal Barbeiro barbeiroLogado) {
        var agendamentosPendentes = repository.findByBarbeiroIdAndStatus(barbeiroLogado.getId(), StatusAgendamento.PENDENTE);
        return ResponseEntity.ok(agendamentosPendentes);
    }
    
    @GetMapping("/confirmados")
    public ResponseEntity<List<Agendamento>> listarConfirmados(@AuthenticationPrincipal Barbeiro barbeiroLogado) {
        var agendamentosConfirmados = repository.findByBarbeiroIdAndStatus(barbeiroLogado.getId(), StatusAgendamento.CONFIRMADO);
        return ResponseEntity.ok(agendamentosConfirmados);
    }
    
    @GetMapping("/atrasados")
    public ResponseEntity<List<Agendamento>> listarAtrasados(@AuthenticationPrincipal Barbeiro barbeiroLogado) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime dataHoraZero = agora.toLocalDate().atStartOfDay();
        var agendamentosAtrasados = repository.findByBarbeiroIdAndStatusAndDataHoraBetween(
                barbeiroLogado.getId(), 
                StatusAgendamento.CONFIRMADO, 
                dataHoraZero,
                agora);
        return ResponseEntity.ok(agendamentosAtrasados);
    }

    @PutMapping("/{id}/confirmar")
    @Transactional
    public ResponseEntity<Agendamento> confirmar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
                    agendamento.setStatus(StatusAgendamento.CONFIRMADO);
                    return ResponseEntity.ok(repository.save(agendamento));
                })
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }

    @PutMapping("/{id}/cancelar")
    @Transactional
    public ResponseEntity<Agendamento> cancelar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
    /*                LocalDateTime agora = LocalDateTime.now();
                    if (agendamento.getDataHora().isBefore(agora)) {
                        throw new IllegalArgumentException("Não é possível cancelar um agendamento passado.");
                    } */
                    agendamento.setStatus(StatusAgendamento.CANCELADO_PELO_CLIENTE);
                    Horario horario = agendamento.getHorario();
                    if (horario != null) {
                        horario.setDisponivel(true);
                        horarioRepository.save(horario);
                    }
                    return ResponseEntity.ok(repository.save(agendamento));
                })
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }

    @PutMapping("/{id}/realizado")
    @Transactional
    public ResponseEntity<Agendamento> realizado(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
                    agendamento.setStatus(StatusAgendamento.REALIZADO);
                    return ResponseEntity.ok(repository.save(agendamento));
                })
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<String> agendar(@RequestBody @Valid DadosAgendamentoClienteDTO dados) {
        try {
            System.out.println("Recebida requisição para /agendamentos com payload: " + dados);
            var barbeiro = barbeiroRepository.findById(dados.idBarbeiro())
                .orElseThrow(() -> new IllegalArgumentException("Barbeiro não encontrado."));
            var servico = servicoRepository.findById(dados.idServico())
                .orElseThrow(() -> new IllegalArgumentException("Serviço não encontrado."));
            Cliente cliente = clienteRepository.findByTelefone(dados.telefoneCliente())
                .orElseGet(() -> {
                    var novoCliente = new Cliente();
                    novoCliente.setNome(dados.nomeCliente());
                    novoCliente.setTelefone(dados.telefoneCliente());
                    return clienteRepository.save(novoCliente);
                });
            LocalDateTime dataHora = dados.dataHora();
            LocalDate data = dataHora.toLocalDate();
            LocalTime hora = dataHora.toLocalTime();
            List<Horario> horarios = horarioRepository.findByBarbeiroIdAndData(dados.idBarbeiro(), data);
            System.out.println("Horários encontrados para barbeiro " + dados.idBarbeiro() + " e data " + data + ": " + horarios);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            String horaFormatted = hora.format(formatter);
            System.out.println("Hora formatada para busca: " + horaFormatted);
            
            // Log para verificar valores exatos de h.getHora()
            horarios.forEach(h -> System.out.println("Horário no banco: ID=" + h.getId() + ", Hora=" + h.getHora() + ", Disponível=" + h.isDisponivel()));
            
            Horario horario = horarios.stream()
                .filter(h -> {
                    boolean match = h.getHora().trim().equals(horaFormatted) && h.isDisponivel();
                    System.out.println("Verificando horário: ID=" + h.getId() + ", Hora=" + h.getHora() + ", Trimmed=" + h.getHora().trim() + ", Disponível=" + h.isDisponivel() + ", Corresponde=" + match);
                    return match;
                })
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Horário não disponível."));
            
            StatusAgendamento status = StatusAgendamento.valueOf(dados.status());
            var agendamento = new Agendamento();
            agendamento.setHorario(horario);
            agendamento.setBarbeiro(barbeiro);
            agendamento.setServico(servico);
            agendamento.setCliente(cliente);
            agendamento.setDataHora(dataHora);
            agendamento.setStatus(status);
            horario.setDisponivel(false);
            horarioRepository.save(horario);
            repository.save(agendamento);
            System.out.println("Agendamento criado: " + agendamento);
            return new ResponseEntity<>("Agendamento criado com sucesso! Aguarde a confirmação.", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao agendar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}