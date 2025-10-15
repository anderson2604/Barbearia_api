import React, { useState } from 'react';
import axios from 'axios';
import ClienteCadastroModal from './ClienteCadastroModal';
import GerenciarAgendamentoModal from './GerenciarAgendamentoModal';
import './ClienteLogin.css';

const ClienteLogin = ({ onLoginSuccess }) => {
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCadastroModal, setShowCadastroModal] = useState(false);
    const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);
    const [showCancelSuccessModal, setShowCancelSuccessModal] = useState(false); // Novo estado
    const [cancelamentoData, setCancelamentoData] = useState(null); // Dados do cancelamento
    const [cliente, setCliente] = useState(null);
    const [agendamentosAtivos, setAgendamentosAtivos] = useState([]);

    const handleTelefoneChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, "");

        if (value.length > 0) {
            value = "(" + value;
        }
        if (value.length > 3) {
            value = value.substring(0, 3) + ") " + value.substring(3);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + "-" + value.substring(10, 15);
        }
        if (value.length > 15) {
            value = value.substring(0, 15);
        }
        setTelefone(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (telefone.length < 14) {
            setError('Por favor, digite um telefone válido.');
            setLoading(false);
            return;
        }

        try {
            const telefoneLimpo = telefone.replace(/\D/g, "");
            console.log('Telefone enviado:', telefoneLimpo);

            const response = await axios.post('http://localhost:8080/clientes/buscar-com-agendamentos', { telefone: telefoneLimpo });
            console.log('Resposta do buscar-com-agendamentos:', response.data);

            if (response.data) {
                setCliente({
                    id: response.data.id,
                    nome: response.data.nome,
                    telefone: response.data.telefone
                });

                if (response.data.temAgendamentoAtivo) {
                    setAgendamentosAtivos(response.data.agendamentosAtivos || []);
                    setShowAgendamentoModal(true);
                } else {
                    onLoginSuccess(response.data);
                }
            }
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setShowCadastroModal(true);
            } else {
                console.error('Erro ao buscar cliente:', err.response?.data || err.message);
                setError('Ocorreu um erro. Tente novamente.');
            }
        }
    };

    const handleCadastroSuccess = (clienteData) => {
        setShowCadastroModal(false);
        onLoginSuccess(clienteData);
    };

    const handleManterAgendamento = () => {
        setShowAgendamentoModal(false);
        window.location.href = '/';
    };

    // Alterado: Agora recebe os dados do cancelamento do modal filho
    const handleCancelarAgendamento = (agendamentoId, dadosCancelamento) => {
        setShowAgendamentoModal(false);
        setAgendamentosAtivos([]);
        setCancelamentoData(dadosCancelamento); // Armazena dados
        setShowCancelSuccessModal(true); // Mostra modal de sucesso
    };

    const handleSuccessClose = () => {
        setShowCancelSuccessModal(false);
        window.location.href = '/'; // Volta para home
    };

    return (
        <div className="cliente-login-container">
            <h2>1. Telefone</h2>
            <p>Digite seu telefone para continuar.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Digite seu telefone (ex.: (11) 99999-9999)"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    maxLength="15"
                />
                <button type="submit" disabled={loading || telefone.length < 14}>
                    {loading ? 'Buscando...' : 'Avançar'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {showCadastroModal && (
                <ClienteCadastroModal
                    telefone={telefone.replace(/\D/g, "")}
                    onCadastroSuccess={handleCadastroSuccess}
                    onClose={() => setShowCadastroModal(false)}
                />
            )}

            {showAgendamentoModal && (
                <GerenciarAgendamentoModal
                    cliente={cliente}
                    agendamentos={agendamentosAtivos}
                    onManterAgendamento={handleManterAgendamento}
                    onCancelarAgendamento={handleCancelarAgendamento} // Passa função que recebe dados
                    onClose={() => setShowAgendamentoModal(false)}
                />
            )}

            {/* Modal de Sucesso de Cancelamento */}
            {showCancelSuccessModal && cancelamentoData && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agendamento Cancelado com Sucesso!</h2>
                        <p><strong>Barbeiro:</strong> {cancelamentoData.barbeiro.nome}</p>
                        <p><strong>Cliente:</strong> {cancelamentoData.cliente.nome} ({cancelamentoData.cliente.telefone})</p>
                        <p><strong>Serviço:</strong> {cancelamentoData.servico.nome} (R$ {cancelamentoData.servico.preco})</p>
                        <p><strong>Data/Hora:</strong> {new Date(cancelamentoData.dataHora).toLocaleString('pt-BR')}</p>
                        <p><strong>Status:</strong> {cancelamentoData.status}</p>
                        <button onClick={handleSuccessClose} className="btn-ok">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClienteLogin;