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

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id")
    private Barbeiro barbeiro;

    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;

    public Agendamento(Horario horario, Barbeiro barbeiro, Servico servico, Cliente cliente, LocalDateTime dataHora, StatusAgendamento status) {
        this.horario = horario;
        this.barbeiro = barbeiro;
        this.servico = servico;
        this.cliente = cliente;
        this.dataHora = dataHora;
        this.status = status;
    }
}