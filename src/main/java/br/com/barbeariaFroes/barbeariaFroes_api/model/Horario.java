package br.com.barbeariaFroes.barbeariaFroes_api.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "horarios")
@Getter
@Setter
@NoArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id")
    private Barbeiro barbeiro;

    private LocalDate data;
    private LocalTime hora;
    
    private boolean disponivel = true;

    public Horario(Barbeiro barbeiro, LocalDate data, LocalTime hora) {
        this.barbeiro = barbeiro;
        this.data = data;
        this.hora = hora;
    }
}
