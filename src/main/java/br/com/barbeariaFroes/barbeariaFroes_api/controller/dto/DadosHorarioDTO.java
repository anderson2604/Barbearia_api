package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DadosHorarioDTO {
    private Long idBarbeiro;
    private LocalDate data;
    private LocalTime hora;

/*    // Getters e setters
    public Long getIdBarbeiro() { return idBarbeiro; }
    public void setIdBarbeiro(Long idBarbeiro) { this.idBarbeiro = idBarbeiro; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; } */
}