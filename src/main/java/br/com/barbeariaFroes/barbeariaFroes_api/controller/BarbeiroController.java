package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.BarbeiroCadastroDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.DadosHorarioDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;
import br.com.barbeariaFroes.barbeariaFroes_api.model.Horario;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.HorarioRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/barbeiros")
public class BarbeiroController {

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/cadastrar")
    public ResponseEntity<Void> cadastrarBarbeiro(@RequestBody BarbeiroCadastroDTO dados) {
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Barbeiro novoBarbeiro = new Barbeiro(dados.nome(), dados.email(), senhaCriptografada);
        barbeiroRepository.save(novoBarbeiro);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Barbeiro>> listarBarbeiros() {
        List<Barbeiro> barbeiros = barbeiroRepository.findAll();
        return ResponseEntity.ok(barbeiros);
    }

    @GetMapping("/{id}/")
    public ResponseEntity<List<Horario>> listarHorarios(@PathVariable Long id) {
        List<Horario> horarios = horarioRepository.findByBarbeiroIdOrderByDataAscHoraAsc(id);
        return ResponseEntity.ok(horarios);
    }
    
    @PostMapping("/{id}/horario")
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
		
		horarioRepository.save(horario);
		
		return new ResponseEntity<>("Horário criado com sucesso!", HttpStatus.CREATED);
	}
    
    @GetMapping("/{id}/horarios")
    public ResponseEntity<List<Horario>> getHorariosByBarbeiro(@PathVariable Long id) {
    	LocalDate dataAtual = LocalDate.now();
        LocalTime horaAtual = LocalTime.now();
        List<Horario> horarios = horarioRepository.findByBarbeiroIdAndDataHoraGreaterThanEqual(id, dataAtual, horaAtual);
        return ResponseEntity.ok(horarios);
    }
}