import React, { useState } from 'react';
import axios from 'axios';
import './ClienteLogin.css';
import ClienteCadastroModal from './ClienteCadastroModal'; // Importe o novo modal

const ClienteLogin = ({ onLoginSuccess }) => {
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal

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
            // Requisição para a nova rota de busca
            const response = await axios.post('http://localhost:8080/clientes/buscar', { telefone });
            
            // Se o cliente for encontrado, avança para a próxima etapa
            onLoginSuccess(response.data);

        } catch (err) {
            setLoading(false);
            // Se a resposta for 404 (cliente não encontrado), abre o modal de cadastro
            if (err.response && err.response.status === 404) {
                setShowModal(true);
            } else {
                console.error('Erro ao buscar cliente:', err);
                setError('Ocorreu um erro. Tente novamente.');
            }
        }
    };
    
    // Callback para quando o modal de cadastro for concluído
    const handleCadastroSuccess = (clienteData) => {
        setShowModal(false);
        onLoginSuccess(clienteData);
    };

    return (
        <div className="cliente-login-container">
            <h2>1. Telefone</h2>
            <p>Digite seu telefone para continuar.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Digite seu telefone"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    maxLength="15"
                />
                <button type="submit" disabled={loading || telefone.length < 14}>
                    {loading ? 'Buscando...' : 'Avançar'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {/* Renderiza o modal se o showModal for verdadeiro */}
            {showModal && (
                <ClienteCadastroModal
                    telefone={telefone}
                    onCadastroSuccess={handleCadastroSuccess}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ClienteLogin;