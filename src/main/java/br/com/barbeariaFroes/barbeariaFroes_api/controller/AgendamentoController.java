package br.com.barbeariaFroes.barbeariaFroes_api.controller;

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
import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.DadosAgendamentoCliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Cliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.AgendamentoRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ClienteRepository;
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

    @GetMapping("/pendentes")
    public ResponseEntity<List<Agendamento>> listarPendentes(@AuthenticationPrincipal Barbeiro barbeiroLogado) {
        var agendamentosPendentes = repository.findByBarbeiroIdAndStatus(barbeiroLogado.getId(), StatusAgendamento.PENDENTE);
        return ResponseEntity.ok(agendamentosPendentes);
    }

    @PutMapping("/{id}/confirmar")
    @Transactional
    public ResponseEntity<Agendamento> confirmar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
                    agendamento.setStatus(StatusAgendamento.CONFIRMADO);
                    return ResponseEntity.ok(repository.save(agendamento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancelar")
    @Transactional
    public ResponseEntity<Agendamento> cancelar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
                    agendamento.setStatus(StatusAgendamento.CANCELADO_PELO_BARBEIRO);
                    return ResponseEntity.ok(repository.save(agendamento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<String> agendar(@RequestBody @Valid DadosAgendamentoCliente dados) {
        var barbeiro = barbeiroRepository.findById(dados.idBarbeiro()).orElse(null);
        if (barbeiro == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Barbeiro não encontrado.");
        }

        var servico = servicoRepository.findById(dados.idServico()).orElse(null);
        if (servico == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Serviço não encontrado.");
        }

        Cliente cliente = clienteRepository.findByTelefone(dados.telefoneCliente()).orElseGet(() -> {
            var novoCliente = new Cliente();
            novoCliente.setNome(dados.nomeCliente());
            novoCliente.setTelefone(dados.telefoneCliente());
            return clienteRepository.save(novoCliente);
        });

        var agendamento = new Agendamento();
        agendamento.setBarbeiro(barbeiro);
        agendamento.setCliente(cliente);
        agendamento.setDataHora(dados.dataHora());
        agendamento.setStatus(StatusAgendamento.PENDENTE);
        agendamento.setServico(servico); // Usa o objeto persistido
        repository.save(agendamento);

        return new ResponseEntity<>("Agendamento criado com sucesso! Aguarde a confirmação.", HttpStatus.CREATED);
    }
}