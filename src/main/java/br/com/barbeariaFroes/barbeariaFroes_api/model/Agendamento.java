package br.com.barbeariaFroes.barbeariaFroes_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
@NoArgsConstructor
public class Agendamento {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.PERSIST) // Adicione cascade
    private Barbeiro barbeiro;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Cliente cliente;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Servico servico;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;

    public Agendamento(LocalDateTime dataHora, Servico servico, Cliente cliente, Barbeiro barbeiro, StatusAgendamento status) {
        this.dataHora = dataHora;
        this.servico = servico;
        this.cliente = cliente;
        this.barbeiro = barbeiro;
        this.status = status;
    }

    // Getter e Setter para 'status' já são gerados pela anotação @Setter e @Getter do Lombok,
    // mas para clareza, aqui está o método setStatus explicitamente (caso não use Lombok):
    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }

    public StatusAgendamento getStatus() {
        return status;
    }
}