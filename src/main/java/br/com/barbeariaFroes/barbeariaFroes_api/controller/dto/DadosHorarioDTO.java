package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class DadosHorarioDTO {
    private Long idBarbeiro;
    private LocalDate data;
    private LocalTime hora;

    public DadosHorarioDTO() {}

    public DadosHorarioDTO(Long idBarbeiro, LocalDate data, LocalTime hora) {
        this.idBarbeiro = idBarbeiro;
        this.data = data;
        this.hora = hora;
    }

    public Long getIdBarbeiro() {
        return idBarbeiro;
    }

    public LocalDate getData() {
        return data;
    }

    public LocalTime getHora() {
        return hora;
    }
}