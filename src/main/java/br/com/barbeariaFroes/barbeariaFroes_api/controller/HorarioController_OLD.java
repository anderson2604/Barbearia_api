package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.DadosHorarioDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Horario;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.HorarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/horario")
public class HorarioController_OLD {

	@Autowired
	private HorarioRepository repository;
	
	@Autowired
	private BarbeiroRepository barbeiroRepository;
	
	@PostMapping
	@Transactional
	public ResponseEntity<String> criarHorario(@RequestBody @Valid DadosHorarioDTO dados){
		var barbeiro = barbeiroRepository.findById(dados.getIdBarbeiro()).orElse(null);
		if(barbeiro == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Barbeiro não encontrado.");
		}
		
		var horario = new Horario();
		horario.setBarbeiro(barbeiro);
		horario.setData(dados.getData());
		horario.setHora(dados.getHora());
		horario.setDisponivel(true);
		
		repository.save(horario);
		
		return new ResponseEntity<>("Horário criado com sucesso!", HttpStatus.CREATED);
	}
}
