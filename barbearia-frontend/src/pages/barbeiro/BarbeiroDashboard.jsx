import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import './BarbeiroDashboard.css';

const BarbeiroDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // A API vai automaticamente incluir o token no cabeçalho
        const response = await api.get('/barbeiros'); 
        setData(response.data);
      } catch (err) {
        setError('Não foi possível carregar os dados. Faça o login novamente.');
        console.error("Erro ao buscar dados autenticados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo ao Dashboard, Barbeiro!</h2>
      {/* Exemplo de exibição dos dados */}
      {data ? (
        <ul>
          {data.map(barbeiro => (
            <li key={barbeiro.id}>{barbeiro.nome}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </div>
  );
};

export default BarbeiroDashboard;