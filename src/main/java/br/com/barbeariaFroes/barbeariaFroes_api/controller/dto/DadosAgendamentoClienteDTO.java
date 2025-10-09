package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosAgendamentoClienteDTO(
    @NotNull Long idBarbeiro,
    @NotNull Long idServico,
    @NotBlank String nomeCliente,
    @NotBlank String telefoneCliente,
    @NotNull LocalDateTime dataHora,
    @NotBlank String status
) {}