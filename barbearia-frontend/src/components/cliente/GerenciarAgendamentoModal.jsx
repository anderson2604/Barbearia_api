import React from 'react';
import axios from 'axios';
import './GerenciarAgendamentoModal.css';

const GerenciarAgendamentoModal = ({ cliente, agendamentos, onManterAgendamento, onCancelarAgendamento, onClose }) => {
    const handleCancelar = async (agendamentoId) => {
        try {
            const response = await axios.put(`http://localhost:8080/agendamentos/${agendamentoId}/cancelar`);
            console.log('Cancelamento response:', response.data);
            
            onCancelarAgendamento(agendamentoId, response.data);
        } catch (err) {
            console.error('Erro ao cancelar agendamento:', err);
            alert('Erro ao cancelar agendamento. Tente novamente.');
        }
    };

    // Função para determinar a classe do status
    const getStatusClass = (status) => {
        if (status === 'CONFIRMADO' || status === 'CONFIRMADO_PELO_CLIENTE') {
            return 'status-confirmed';
        }
        return 'status-default';
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Agendamento Existente</h2>
                <p>Olá, {cliente.nome}! Você já tem um agendamento ativo. O que deseja fazer?</p>
                {agendamentos.map(agendamento => (
                    <div key={agendamento.id} className="agendamento-card">
                        <p><strong>Barbeiro:</strong> {agendamento.barbeiro.nome}</p>
                        <p><strong>Serviço:</strong> {agendamento.servico.nome}</p>
                        <p><strong>Data/Hora:</strong> {new Date(agendamento.dataHora).toLocaleString('pt-BR')}</p>
                        <p><strong>Status:</strong> <span className={getStatusClass(agendamento.status)}>{agendamento.status}</span></p>
                        <button
                            onClick={() => handleCancelar(agendamento.id)}
                            className="btn-cancelar"
                        >
                            Cancelar Agendamento
                        </button>
                    </div>
                ))}
                <div className="modal-actions">
                    <button onClick={onManterAgendamento} className="btn-manter">
                        Manter Agendamento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GerenciarAgendamentoModal;