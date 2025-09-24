import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './BarbeiroLoginPage.css';

const BarbeiroLoginPage = () => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/login', { login, senha });
            // Corrigir: salvar apenas o token
            localStorage.setItem('token', response.data.token); // Alterar de response.data para response.data.token
            navigate('/barbeiro/dashboard'); // Redireciona para o dashboard
        } catch (err) {
            console.error('Erro de login:', err);
            setError('Credenciais inválidas ou problema de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="barbeiro-login-container">
            <h2>Login do Barbeiro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default BarbeiroLoginPage;