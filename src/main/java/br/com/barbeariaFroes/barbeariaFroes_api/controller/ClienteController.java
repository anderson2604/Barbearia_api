package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.ClienteAgendamentoResponse;
import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.TelefoneRequest;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Cliente;
import br.com.barbeariaFroes.barbeariaFroes_api.model.StatusAgendamento;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.AgendamentoRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ClienteRepository;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	@Autowired
	private AgendamentoRepository agendamentoRepository;

	@GetMapping
	public List<Cliente> listar() {
		return clienteRepository.findAll();
	}

	@PostMapping
	public Cliente criar(@RequestBody Cliente cliente) {
		return clienteRepository.save(cliente);
	}
	
	@PostMapping("/buscar")
	public ResponseEntity<Cliente> buscarCliente(@RequestBody TelefoneRequest request) {
		Optional<Cliente> clienteExistente = clienteRepository.findByTelefone(request.telefone());
		return clienteExistente.map(ResponseEntity::ok)
		                       .orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PostMapping("/buscar-com-agendamentos")
	public ResponseEntity<ClienteAgendamentoResponse> buscarClienteComAgendamentos(@RequestBody TelefoneRequest request) {
	    System.out.println("Buscando cliente com telefone: " + request.telefone());
	    Optional<Cliente> clienteOpt = clienteRepository.findByTelefone(request.telefone());
	    
	    if (clienteOpt.isEmpty()) {
	        System.out.println("Cliente não encontrado para telefone: " + request.telefone());
	        return ResponseEntity.notFound().build();
	    }
	    
	    Cliente cliente = clienteOpt.get();
	    LocalDateTime agora = LocalDateTime.now();
	    List<Agendamento> agendamentosAtivos = agendamentoRepository.findByClienteAndStatusInAndDataHoraGreaterThanEqual(
	        cliente, 
	        List.of(StatusAgendamento.PENDENTE, StatusAgendamento.CONFIRMADO), 
	        agora
	    );
	    
	    ClienteAgendamentoResponse response = new ClienteAgendamentoResponse(
	        cliente.getId(),
	        cliente.getNome(),
	        cliente.getTelefone(),
	        agendamentosAtivos.isEmpty() ? null : agendamentosAtivos,
	        !agendamentosAtivos.isEmpty()
	    );
	    
	    System.out.println("Resposta enviada: " + response);
	    return ResponseEntity.ok(response);
	}
}