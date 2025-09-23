package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Cliente;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.ClienteRepository;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
	
	@Autowired
	private ClienteRepository repository;

	@GetMapping
	public List<Cliente> listar(){
		return repository.findAll();
	}

	@PostMapping
	public Cliente criar(@RequestBody Cliente cliente) {
		return repository.save(cliente);
	}
	
	// Novo endpoint para buscar o cliente
	@PostMapping("/buscar")
	public ResponseEntity<Cliente> buscarCliente(@RequestBody Cliente cliente) {
		Optional<Cliente> clienteExistente = repository.findByTelefone(cliente.getTelefone());
		
		if(clienteExistente.isPresent()) {
			return ResponseEntity.ok(clienteExistente.get());
		}
		
		// Se não encontrar, retorna 404
		return ResponseEntity.notFound().build();
	}
}