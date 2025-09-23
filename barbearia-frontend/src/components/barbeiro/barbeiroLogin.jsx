import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BarbeiroLogin.css';

const BarbeiroLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Futuramente, este endpoint será um endpoint de autenticação
            // que você precisará criar no backend.
            const response = await axios.post('http://localhost:8080/auth/login', { login, senha });

            // Supondo que a resposta de sucesso retorne um token ou dados do barbeiro.
            // Aqui, apenas navegamos para o dashboard.
            console.log("Login bem-sucedido:", response.data);
            
            // Redireciona para o dashboard do barbeiro
            if (response.status === 200) {
               navigate('/barbeiro/dashboard');
            }
        } catch (err) {
            console.error('Erro de login:', err);
            setError('Usuário ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="barbeiro-login-container">
            <div className="login-box">
                <h2>Acesso do Barbeiro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BarbeiroLogin;