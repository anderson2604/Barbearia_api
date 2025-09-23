import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BarbeiroHorariosManager.css';

const BarbeiroHorariosManager = () => {
    const navigate = useNavigate();
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const barbeiroId = localStorage.getItem('barbeiroId');
    const token = localStorage.getItem('token');

    // Redireciona se não houver barbeiro logado
    useEffect(() => {
        if (!barbeiroId || !token) {
            navigate('/barbeiro/login');
        }
    }, [barbeiroId, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!data || !hora) {
            setError('Por favor, preencha a data e a hora.');
            setLoading(false);
            return;
        }

        try {
            const novoHorario = { data, hora: `${hora}:00` };

            await axios.post(
                `http://localhost:8080/horarios-gerenciamento/${barbeiroId}`,
                [novoHorario],
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setMessage('Horário cadastrado com sucesso!');
            setData('');
            setHora('');
        } catch (err) {
            console.error('Erro ao cadastrar horário:', err);
            setError('Falha ao cadastrar horário. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="horarios-manager-container">
            <h2>Gerenciar Horários Disponíveis</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="data">Data:</label>
                    <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hora">Hora:</label>
                    <input
                        type="time"
                        id="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Horário'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default BarbeiroHorariosManager;