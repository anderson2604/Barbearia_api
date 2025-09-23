package br.com.barbeariaFroes.barbeariaFroes_api.controller;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Barbeiro;
import br.com.barbeariaFroes.barbeariaFroes_api.model.HorarioDisponivel;
import br.com.barbeariaFroes.barbeariaFroes_api.controller.dto.BarbeiroCadastroDTO;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.BarbeiroRepository;
import br.com.barbeariaFroes.barbeariaFroes_api.repository.HorarioDisponivelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/barbeiros")
public class BarbeiroController {

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private HorarioDisponivelRepository horarioDisponivelRepository;

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

    @GetMapping("/{id}/horarios-disponiveis")
    public ResponseEntity<List<HorarioDisponivel>> listarHorariosDisponiveis(@PathVariable Long id) {
        List<HorarioDisponivel> horarios = horarioDisponivelRepository.findByBarbeiroIdAndDisponivelTrue(id);
        return ResponseEntity.ok(horarios);
    }
}