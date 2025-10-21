package br.com.barbeariaFroes.barbeariaFroes_api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "horarios",
	uniqueConstraints = {
			@UniqueConstraint(
					columnNames =  {"barbeiro_id", "data", "hora"},
					name = "uk_barbeiro_data_hora"
			)
			
	}
)


public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id")
    private Barbeiro barbeiro;

    @Column(name = "data")
    private LocalDate data;

    @Column(name = "hora")
    private String hora; // Deve ser String para corresponder ao formato "HH:mm:ss"

    @Column(name = "disponivel")
    private boolean disponivel;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Barbeiro getBarbeiro() {
        return barbeiro;
    }

    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }
    
    @Override
    public String toString() {
        return "Horario{id=" + id + ", barbeiroId=" + (barbeiro != null ? barbeiro.getId() : null) + 
               ", data=" + data + ", hora=" + hora + ", disponivel=" + disponivel + "}";
    }
}