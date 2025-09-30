package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public record DadosAgendamentoClienteDTO(
    @NotNull Long idBarbeiro,
    @NotBlank String nomeCliente,
    @NotBlank String telefoneCliente,
    @NotNull @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dataHora,
    @NotNull Long idServico // Mude para Long em vez de Servico
) {}