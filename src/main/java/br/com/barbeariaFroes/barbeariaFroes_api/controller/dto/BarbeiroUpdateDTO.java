package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record BarbeiroUpdateDTO(
    @Email(message = "Email inválido")
    String email,  // Pode ser null no JSON se não mudar

    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    String novaSenha  // Mude para "novaSenha" para evitar confusão com campo model
) {}