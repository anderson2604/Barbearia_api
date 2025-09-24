import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import './BarbeiroDashboard.css';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const BarbeiroDashboard = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoBarbeiro, setNovoBarbeiro] = useState({ nome: '', email: '', senha: '' });
  const [novoHorario, setNovoHorario] = useState({ barbeiroId: '', dataHora: '' });
  const [editingBarbeiro, setEditingBarbeiro] = useState(null);
  const navigate = useNavigate();

  // Função para carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [barbeirosRes, agendamentosRes] = await Promise.all([
          api.get('/barbeiros'),
          api.get('/agendamentos/pendentes'), 
        ]);
        setBarbeiros(barbeirosRes.data);
        setAgendamentos(agendamentosRes.data);
      } catch (err) {
        setError('Não foi possível carregar os dados. Faça o login novamente.');
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para cadastrar barbeiro
  const handleCadastrarBarbeiro = async (e) => {
    e.preventDefault();
    try {
      await api.post('/barbeiros/cadastrar', novoBarbeiro);
      const response = await api.get('/barbeiros');
      setBarbeiros(response.data);
      setNovoBarbeiro({ nome: '', email: '', senha: '' });
      setError(null);
    } catch (err) {
      setError('Erro ao cadastrar barbeiro.');
      console.error('Erro:', err);
    }
  };

  // Função para editar barbeiro
  const handleEditarBarbeiro = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/barbeiros/${editingBarbeiro.id}`, editingBarbeiro);
      const response = await api.get('/barbeiros');
      setBarbeiros(response.data);
      setEditingBarbeiro(null);
      setError(null);
    } catch (err) {
      setError('Erro ao editar barbeiro.');
      console.error('Erro:', err);
    }
  };

  // Função para carregar horários disponíveis de um barbeiro
  const fetchHorarios = async (barbeiroId) => {
    try {
      const response = await api.get(`/barbeiros/${barbeiroId}/horarios-disponiveis`);
      setHorarios(response.data);
    } catch (err) {
      setError('Erro ao carregar horários.');
      console.error('Erro:', err);
    }
  };

  // Função para adicionar horário disponível
  const handleAdicionarHorario = async (e) => {
    e.preventDefault();
    try {
      await api.post('/horarios-disponiveis', novoHorario); // Assumindo endpoint
      await fetchHorarios(novoHorario.barbeiroId);
      setNovoHorario({ barbeiroId: '', dataHora: '' });
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar horário.');
      console.error('Erro:', err);
    }
  };

  // Função para confirmar ou rejeitar agendamento
  const handleGerenciarAgendamento = async (agendamentoId, status) => {
    try {
      await api.put(`/agendamentos/${agendamentoId}`, { status }); // Assumindo endpoint
      const response = await api.get('/agendamentos/pendentes');
      setAgendamentos(response.data);
      setError(null);
    } catch (err) {
      setError(`Erro ao ${status} agendamento.`);
      console.error('Erro:', err);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Dashboard da Barbearia</h2>
        <Tabs className="bg-white shadow-lg rounded-lg p-6">
          <TabList className="flex border-b border-gray-200">
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">Agendamentos</Tab>
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">Horários</Tab>
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">Barbeiros</Tab>
          </TabList>

          {/* Aba de Agendamentos */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Agendamentos</h3>
            {agendamentos.length > 0 ? (
              <div className="grid gap-4">
                {agendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p><strong>Cliente:</strong> {agendamento.clienteNome}</p>
                      <p><strong>Data/Hora:</strong> {new Date(agendamento.dataHora).toLocaleString()}</p>
                      <p><strong>Status:</strong> {agendamento.status}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleGerenciarAgendamento(agendamento.id, 'CONFIRMADO')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleGerenciarAgendamento(agendamento.id, 'REJEITADO')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum agendamento encontrado.</p>
            )}
          </TabPanel>

          {/* Aba de Horários */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Horários Disponíveis</h3>
            <form onSubmit={handleAdicionarHorario} className="mb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={novoHorario.barbeiroId}
                  onChange={(e) => setNovoHorario({ ...novoHorario, barbeiroId: e.target.value })}
                  className="border rounded p-2"
                  required
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbeiros.map((barbeiro) => (
                    <option key={barbeiro.id} value={barbeiro.id}>
                      {barbeiro.nome}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={novoHorario.dataHora}
                  onChange={(e) => setNovoHorario({ ...novoHorario, dataHora: e.target.value })}
                  className="border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Adicionar Horário
              </button>
            </form>
            {horarios.length > 0 ? (
              <ul className="grid gap-2">
                {horarios.map((horario) => (
                  <li key={horario.id} className="bg-gray-50 p-2 rounded">
                    {new Date(horario.dataHora).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Selecione um barbeiro para ver os horários.</p>
            )}
          </TabPanel>

          {/* Aba de Barbeiros */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Barbeiros</h3>
            <form onSubmit={editingBarbeiro ? handleEditarBarbeiro : handleCadastrarBarbeiro} className="mb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nome"
                  value={editingBarbeiro ? editingBarbeiro.nome : novoBarbeiro.nome}
                  onChange={(e) =>
                    editingBarbeiro
                      ? setEditingBarbeiro({ ...editingBarbeiro, nome: e.target.value })
                      : setNovoBarbeiro({ ...novoBarbeiro, nome: e.target.value })
                  }
                  className="border rounded p-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingBarbeiro ? editingBarbeiro.email : novoBarbeiro.email}
                  onChange={(e) =>
                    editingBarbeiro
                      ? setEditingBarbeiro({ ...editingBarbeiro, email: e.target.value })
                      : setNovoBarbeiro({ ...novoBarbeiro, email: e.target.value })
                  }
                  className="border rounded p-2"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={editingBarbeiro ? editingBarbeiro.senha : novoBarbeiro.senha}
                  onChange={(e) =>
                    editingBarbeiro
                      ? setEditingBarbeiro({ ...editingBarbeiro, senha: e.target.value })
                      : setNovoBarbeiro({ ...novoBarbeiro, senha: e.target.value })
                  }
                  className="border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {editingBarbeiro ? 'Salvar Alterações' : 'Cadastrar Barbeiro'}
              </button>
              {editingBarbeiro && (
                <button
                  type="button"
                  onClick={() => setEditingBarbeiro(null)}
                  className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              )}
            </form>
            <ul className="grid gap-4">
              {barbeiros.map((barbeiro) => (
                <li key={barbeiro.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <p><strong>Nome:</strong> {barbeiro.nome}</p>
                    <p><strong>Email:</strong> {barbeiro.email}</p>
                  </div>
                  <button
                    onClick={() => setEditingBarbeiro(barbeiro)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default BarbeiroDashboard;