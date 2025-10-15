package br.com.barbeariaFroes.barbeariaFroes_api.controller.dto;

import java.util.List;

import br.com.barbeariaFroes.barbeariaFroes_api.model.Agendamento;

public record ClienteAgendamentoResponse(
    Long id,
    String nome,
    String telefone,
    List<Agendamento> agendamentosAtivos,
    boolean temAgendamentoAtivo
) {}