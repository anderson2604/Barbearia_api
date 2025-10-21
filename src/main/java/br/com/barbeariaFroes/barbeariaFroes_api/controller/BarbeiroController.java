package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.BarbeiroCadastroDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.BarbeiroUpdateDTO;
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
    	System.out.println("ander - Entrou no metodo cadastrarBarbeiro");
        String senhaCriptografada = passwordEncoder.encode(dados.pasword());
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
    
    @PutMapping("/{id}")
    public ResponseEntity<Barbeiro> atualizarBarbeiro(@PathVariable Long id, @RequestBody @Valid BarbeiroUpdateDTO dados) {
    	System.out.println("ander - Entrou no metodo atualizarBarbeiro");
    	Logger logger = LoggerFactory.getLogger(BarbeiroController.class);
        logger.info("Request body recebido: {}", dados);  // Veja o que chega: email e novaSenha?

        Barbeiro barbeiro = barbeiroRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barbeiro não encontrado"));

        // Email
        if (dados.email() != null && !dados.email().isBlank()) {
            if (barbeiroRepository.existsByEmailAndIdNot(dados.email(), id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já em uso");
            }
            barbeiro.setEmail(dados.email());
            barbeiro.setLogin(dados.email());  // Sync se login = email
            logger.info("Email atualizado para: {}", dados.email());
        }
System.out.println("ander " + dados.novaSenha());
        if (dados.novaSenha() != null && !dados.novaSenha().isBlank()) {
            String novaSenhaCripto = passwordEncoder.encode(dados.novaSenha());
            barbeiro.setPassword(novaSenhaCripto);  // Campo exato!
            logger.info("Senha criptografada: starts with {}", novaSenhaCripto.substring(0, 10));
        } else {
            logger.info("Nenhuma nova senha fornecida - ignorando update de password");
        }

        // Salva e força DB
        Barbeiro atualizado = barbeiroRepository.saveAndFlush(barbeiro);
        logger.info("Barbeiro salvo no DB: password hash now {}", atualizado.getPassword().substring(0, 10));

        // Retorne sem expor password (opcional: crie DTO de response sem senha)
        return ResponseEntity.ok(atualizado);
    }

    @PostMapping("/{id}/horario")
    public ResponseEntity<String> criarHorario(@PathVariable Long id, @RequestBody @Valid DadosHorarioDTO dados) {
    	System.out.println("ander - Entrou no metodo criarHorario");
    	if (!id.equals(dados.getIdBarbeiro())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID do barbeiro na URL não corresponde ao ID no corpo da requisição.");
        }
        var barbeiro = barbeiroRepository.findById(dados.getIdBarbeiro()).orElse(null);
        if (barbeiro == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Barbeiro não encontrado.");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        String horaFormatted = dados.getHora().format(formatter);
        
        boolean existe = horarioRepository.findByBarbeiroIdAndDataAndHora(id, dados.getData(), horaFormatted).isPresent();
        
        if(existe) {
        	return ResponseEntity.status(HttpStatus.CONFLICT).body("Este horario já esta ocupado para o barbeiro");
        }
        
        var horario = new Horario();
        horario.setBarbeiro(barbeiro);
        horario.setData(dados.getData());
        horario.setHora(horaFormatted);
        horario.setDisponivel(true);
        horarioRepository.save(horario);
        return new ResponseEntity<>("Horário criado com sucesso!", HttpStatus.CREATED);
    }

    @GetMapping("/{id}/horarios")
    public ResponseEntity<List<Horario>> listarHorariosPorBarbeiro(@PathVariable Long id) {
        System.out.println("Buscando horários para barbeiro ID: " + id);
        LocalDate currentDate = LocalDate.now();
        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        List<Horario> horarios = horarioRepository.findByBarbeiroIdAndDisponivelAndDataHoraAfterNow(id, true, currentDate, currentTime);
        System.out.println("Horários encontrados: " + horarios);
        return ResponseEntity.ok(horarios);
    }
}