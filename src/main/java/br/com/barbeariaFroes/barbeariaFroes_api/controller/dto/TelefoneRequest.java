package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record TelefoneRequest(
    @NotBlank String telefone
) {}