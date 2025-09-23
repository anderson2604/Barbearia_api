package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.DadosAgendamentoCliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Cliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.AgendamentoRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ClienteRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publico/agendamentos")
public class AgendamentoPublicoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<String> agendar(@RequestBody @Valid DadosAgendamentoCliente dados) {
        var barbeiro = barbeiroRepository.findById(dados.idBarbeiro()).orElse(null);
        if (barbeiro == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Barbeiro não encontrado.");
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
        agendamentoRepository.save(agendamento);

        return new ResponseEntity<>("Agendamento criado com sucesso! Aguarde a confirmação.", HttpStatus.CREATED);
    }
}