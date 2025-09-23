import React, { useState } from 'react';
import axios from 'axios';
import './ClienteCadastroModal.css';

const ClienteCadastroModal = ({ telefone, onCadastroSuccess, onClose }) => {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!nome) {
            setError('Por favor, digite seu nome.');
            setLoading(false);
            return;
        }

        try {
            // Envia os dados para a rota de cadastro (a mesma rota original)
            const response = await axios.post('http://localhost:8080/clientes', { nome, telefone });
            onCadastroSuccess(response.data);
        } catch (err) {
            console.error('Erro ao cadastrar:', err);
            setError('Falha no cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Novo Cliente</h3>
                <p>Por favor, informe seu nome para continuar o agendamento.</p>
                <form onSubmit={handleCadastro}>
                    <input
                        type="text"
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !nome} className="confirm-button">
                            {loading ? 'Cadastrando...' : 'Cadastrar e Continuar'}
                        </button>
                    </div>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ClienteCadastroModal;