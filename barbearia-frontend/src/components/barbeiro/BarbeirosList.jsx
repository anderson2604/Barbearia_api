import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BarbeirosList.css';

const BarbeirosList = ({ onBarbeiroSelected }) => {
    const [barbeiros, setBarbeiros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBarbeiros = async () => {
            try {
                const response = await axios.get('http://localhost:8080/barbeiros');
                setBarbeiros(response.data);
            } catch (err) {
                console.error('Erro ao buscar barbeiros:', err);
                setError('Não foi possível carregar a lista de barbeiros. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchBarbeiros();
    }, []);

    if (loading) {
        return <p className="loading-message">Carregando barbeiros...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="barbeiros-container">
            <h2>Escolha seu Barbeiro</h2>
            <div className="barbeiros-grid">
                {barbeiros.map(barbeiro => (
                    <div 
                        key={barbeiro.id} 
                        className="barbeiro-card" 
                        onClick={() => onBarbeiroSelected(barbeiro)}
                    >
                        <h3>{barbeiro.nome}</h3>
                        <p>{barbeiro.especialidade}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BarbeirosList;