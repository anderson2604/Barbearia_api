import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicoList.css';

const ServicoList = ({ onSelectServico, servicoSelecionado }) => {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/servicos');
                setServicos(response.data); // Ex.: [{ id: 1, nome: 'Corte', preco: 40.00 }, ...]
               // console.log('Serviços carregados:', response.data);
            } catch (err) {
                console.error('Erro ao buscar serviços:', err.response?.data || err.message);
                setError('Não foi possível carregar os serviços. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchServicos();
    }, []);

    if (loading) return <p>Carregando serviços...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="servicos-container">
            <div className="servicos-grid">
                {servicos.map(servico => (
                    <div
                        key={servico.id}
                        className={`servico-card ${servicoSelecionado?.id === servico.id ? 'selected' : ''}`}
                        onClick={() => onSelectServico(servico)} // Passa o objeto completo
                    >
                        <h3>{servico.nome}</h3>
                        <p>R$ {servico.preco.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicoList;