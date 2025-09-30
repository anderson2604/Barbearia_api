import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import './BarbeiroDashboard.css';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const BarbeiroDashboard = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [agendamentosPendentes, setAgendamentosPendentes] = useState([]);
  const [agendamentosConfirmados, setAgendamentosConfirmados] = useState([]);
  const [agendamentosAtrasados, setAgendamentosAtrasados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);
  const [horariosDoDia, setHorariosDoDia] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [modalHorariosOpen, setModalHorariosOpen] = useState(false);
  const [modalAdicionarHorarioOpen, setModalAdicionarHorarioOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoBarbeiro, setNovoBarbeiro] = useState({ nome: '', email: '', senha: '' });
  const [novoHorario, setNovoHorario] = useState({ barbeiroId: '', data: '', hora: '' });
  const [editingBarbeiro, setEditingBarbeiro] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [modalType, setModalType] = useState('pendentes');
  const navigate = useNavigate();

  // Função para carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [barbeirosRes, pendentesRes, confirmadosRes, atrasadosRes] = await Promise.all([
          api.get('/barbeiros'),
          api.get('/agendamentos/pendentes'),
          api.get('/agendamentos/confirmados'),
          api.get('/agendamentos/atrasados'),
        ]);
        setBarbeiros(barbeirosRes.data);

        // Filtrar agendamentos pendentes e confirmados a partir de agora
        const agora = new Date();
        agora.setHours(19, 17, 0, 0); // Definir como 19:17 do dia atual (29/09/2025)
        const pendentesFiltrados = pendentesRes.data.filter(agendamento => {
          const dataAgendamento = new Date(agendamento.dataHora);
          return dataAgendamento >= agora;
        });
        const confirmadosFiltrados = confirmadosRes.data.filter(agendamento => {
          const dataAgendamento = new Date(agendamento.dataHora);
          return dataAgendamento >= agora;
        });

        setAgendamentosPendentes(pendentesFiltrados);
        setAgendamentosConfirmados(confirmadosFiltrados);
        setAgendamentosAtrasados(atrasadosRes.data);
      } catch (err) {
        setError('Não foi possível carregar os dados. Faça o login novamente.');
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para abrir modal com agendamento selecionado
  const openModal = (agendamento, type) => {
    setSelectedAgendamento(agendamento);
    setModalType(type);
    setModalIsOpen(true);
  };

  // Função para fechar modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAgendamento(null);
  };

  // Função para gerenciar agendamento (confirmar, cancelar ou realizar)
  const handleGerenciarAgendamento = async (agendamentoId, action) => {
    try {
      let endpoint;
      if (action === 'CONFIRMADO') endpoint = `/agendamentos/${agendamentoId}/confirmar`;
      else if (action === 'CANCELADO_PELO_BARBEIRO') endpoint = `/agendamentos/${agendamentoId}/cancelar`;
      else if (action === 'REALIZADO') endpoint = `/agendamentos/${agendamentoId}/realizado`;

      await api.put(endpoint);
      const [pendentesRes, confirmadosRes, atrasadosRes] = await Promise.all([
        api.get('/agendamentos/pendentes'),
        api.get('/agendamentos/confirmados'),
        api.get('/agendamentos/atrasados'),
      ]);
      const agora = new Date();
      agora.setHours(19, 17, 0, 0);
      const pendentesFiltrados = pendentesRes.data.filter(agendamento => new Date(agendamento.dataHora) >= agora);
      const confirmadosFiltrados = confirmadosRes.data.filter(agendamento => new Date(agendamento.dataHora) >= agora);
      setAgendamentosPendentes(pendentesFiltrados);
      setAgendamentosConfirmados(confirmadosFiltrados);
      setAgendamentosAtrasados(atrasadosRes.data);
      setError(null);
      closeModal();
    } catch (err) {
      setError(`Erro ao ${action === 'REALIZADO' ? 'marcar como realizado' : action === 'CONFIRMADO' ? 'confirmar' : 'rejeitar'} agendamento.`);
      console.error('Erro:', err);
    }
  };

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
      const response = await api.get(`/barbeiros/${barbeiroId}/`);
      setHorarios(response.data);
    } catch (err) {
      setError('Erro ao carregar horários.');
      console.error('Erro:', err);
    }
  };

  // Função para adicionar horário disponível
  const handleAdicionarHorario = async (e) => {
    e.preventDefault();
    setModalAdicionarHorarioOpen(true);
  };

  const handleConfirmarAdicionarHorario = async () => {
    try {
      const dados = {
        idBarbeiro: novoHorario.barbeiroId,
        data: novoHorario.data,
        hora: novoHorario.hora,
      };
      await api.post(`/barbeiros/${novoHorario.barbeiroId}/horario`, dados);
      await fetchHorarios(novoHorario.barbeiroId);
      setNovoHorario({ barbeiroId: '', data: '', hora: '' });
      setModalAdicionarHorarioOpen(false);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar horário.');
      console.error('Erro:', err);
    }
  };

  const fetchDias = async (barbeiroId) => {
    try {
      console.log('Barbeiro ID recebido:', barbeiroId);
      const response = await api.get(`/barbeiros/${barbeiroId}/`);
      const horariosData = response.data;
      const diasUnicos = [...new Set(horariosData.map(horario => horario.data))];
      setDiasDisponiveis(diasUnicos.length > 0 ? diasUnicos : ['Nenhum horário disponível']);
    } catch (err) {
      setError('Erro ao carregar dias.');
      console.error('Erro ao buscar dias:', err);
    }
  };

  const fetchHorariosDoDia = async (dia) => {
    try {
      const response = await api.get(`/barbeiros/${novoHorario.barbeiroId}/`);
      const horariosData = response.data;
      const horariosFiltrados = horariosData.filter(horario => horario.data === dia);
      setHorariosDoDia(horariosFiltrados.length > 0 ? horariosFiltrados : []);
    } catch (err) {
      setError('Erro ao carregar horários do dia.');
      console.error('Erro ao buscar horários do dia:', err);
    }
  };

  const openHorariosModal = async (dia) => {
    setDiaSelecionado(dia);
    await fetchHorariosDoDia(dia);
    setModalHorariosOpen(true);
  };

  const closeHorariosModal = () => {
    setModalHorariosOpen(false);
    setDiaSelecionado(null);
    setHorariosDoDia([]);
  };

  const closeAdicionarHorarioModal = () => {
    setModalAdicionarHorarioOpen(false);
    setNovoHorario({ barbeiroId: '', data: '', hora: '' });
  };

  if (loading) {
    return <div className="text-center text-gray-500">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Gerar opções de hora (00:00 a 23:59)
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  return (
    <div className="h-auto bg-slate-700 p-4 sm:p-6">
      <div className="w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-[95%] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">Dashboard da Barbearia</h2>
        <Tabs className="bg-orange-300 shadow-lg rounded-2xl border border-orange-300 p-4 sm:p-16">
          <TabList className="flex border-b border-gray-200">
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">
              Agendamentos
            </Tab>
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">
              Horários
            </Tab>
            <Tab className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 focus:outline-none focus:text-blue-600">
              Barbeiros
            </Tab>
          </TabList>

          {/* Aba de Agendamentos */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-red-700 mb-4 mt-6">Pendentes ({agendamentosPendentes.length})</h3>
            {agendamentosPendentes.length > 0 ? (
              <div className="grid gap-4">
                {agendamentosPendentes.map((agendamento) => (
                  <div key={agendamento.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex-1">
                      <p><strong>Cliente:</strong> {agendamento.cliente.nome}</p>
                      <p className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-gray-800 text-sm sm:text-base">
                        <strong>Data/Hora:</strong>{' '}
                        {agendamento.dataHora ? (
                          <span className="ml-1">
                            {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}{' '}
                            {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          'Não informada'
                        )}
                      </p>
                      <p><strong>Status:</strong> {agendamento.status}</p>
                    </div>
                    <button
                      onClick={() => openModal(agendamento, 'pendentes')}
                      className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4">
                      Detalhes
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum agendamento pendente a partir de hoje.</p>
            )}

            <h3 className="text-xl font-semibold text-green-800 mb-4 mt-6">Confirmados ({agendamentosConfirmados.length})</h3>
            {agendamentosConfirmados.length > 0 ? (
              <div className="grid gap-4">
                {agendamentosConfirmados.map((agendamento) => (
                  <div key={agendamento.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex-1">
                      <p><strong>Cliente:</strong> {agendamento.cliente.nome}</p>
                      <p className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-gray-800 text-sm sm:text-base">
                        <strong>Data/Hora:</strong>{' '}
                        {agendamento.dataHora ? (
                          <span className="ml-1">
                            {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}{' '}
                            {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          'Não informada'
                        )}
                      </p>
                      <p><strong>Status:</strong> {agendamento.status}</p>
                    </div>
                    <button
                      onClick={() => openModal(agendamento, 'confirmados')}
                      className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4">
                      Detalhes
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum agendamento confirmado a partir de hoje.</p>
            )}

            <h3 className="text-xl font-semibold text-yellow-700 mb-4 mt-6">Atrasados ({agendamentosAtrasados.length})</h3>
            {agendamentosAtrasados.length > 0 ? (
              <div className="grid gap-4">
                {agendamentosAtrasados.map((agendamento) => (
                  <div key={agendamento.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex-1">
                      <p><strong>Cliente:</strong> {agendamento.cliente.nome}</p>
                      <p className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-gray-800 text-sm sm:text-base">
                        <strong>Data/Hora:</strong>{' '}
                        {agendamento.dataHora ? (
                          <span className="ml-1">
                            {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}{' '}
                            {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          'Não informada'
                        )}
                      </p>
                      <p><strong>Status:</strong> {agendamento.status}</p>
                    </div>
                    <button
                      onClick={() => openModal(agendamento, 'atrasados')}
                      className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4">
                      Detalhes
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum agendamento atrasado.</p>
            )}
          </TabPanel>

          {/* Aba de Horários */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Gerenciar Horários Disponíveis</h3>
            <form onSubmit={handleAdicionarHorario} className="mb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={novoHorario.barbeiroId}
                  onChange={(e) => {
                    const selectedBarbeiroId = e.target.value;
                    setNovoHorario({ ...novoHorario, barbeiroId: selectedBarbeiroId });
                    if (selectedBarbeiroId) {
                      fetchDias(selectedBarbeiroId);
                    } else {
                      setDiasDisponiveis([]);
                    }
                  }}
                  className="border rounded p-2"
                  required>
                  <option value="">Selecione um barbeiro</option>
                  {barbeiros.map((barbeiro) => (
                    <option key={barbeiro.id} value={barbeiro.id}>
                      {barbeiro.nome}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={novoHorario.data}
                  onChange={(e) => setNovoHorario({ ...novoHorario, data: e.target.value })}
                  className="border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Adicionar Horário
              </button>
            </form>
            {diasDisponiveis.length > 0 ? (
              <ul className="grid gap-2 mt-4">
                {diasDisponiveis.map((dia, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-200"
                    onClick={() => openHorariosModal(dia)}>
                    {dia === 'Nenhum horário disponível' ? dia : dia}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Selecione um barbeiro para ver os dias disponíveis.</p>
            )}
          </TabPanel>

          {/* Modal para horários do dia */}
          {modalHorariosOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg max-w-xl w-full m-4 modal-content">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                  Horários Disponíveis - {diaSelecionado}
                </h3>
                {horariosDoDia.length > 0 ? (
                  <ul className="grid gap-2">
                    {horariosDoDia.map((horario) => (
                      <li key={horario.id} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                        <span>{horario.hora}</span>
                        <span className={horario.disponivel ? 'text-green-600' : 'text-red-600'}>
                          {horario.disponivel ? 'Disponível' : 'Ocupado'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum horário disponível para este dia.</p>
                )}
                <button
                  onClick={closeHorariosModal}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full text-sm sm:text-base">
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal para adicionar horário */}
          {modalAdicionarHorarioOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg max-w-xl w-full m-4 modal-content">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Adicionar Novo Horário</h3>
                <div className="space-y-3">
                  <p><strong>Barbeiro:</strong> {barbeiros.find(b => b.id === parseInt(novoHorario.barbeiroId))?.nome || 'N/A'}</p>
                  <p><strong>Data:</strong> {novoHorario.data}</p>
                  <select
                    value={novoHorario.hora}
                    onChange={(e) => setNovoHorario({ ...novoHorario, hora: e.target.value })}
                    className="border rounded p-2 w-full"
                    required>
                    <option value="">Selecione um horário</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleConfirmarAdicionarHorario}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1 text-sm sm:text-base">
                    Adicionar
                  </button>
                  <button
                    onClick={closeAdicionarHorarioModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1 text-sm sm:text-base">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal para detalhes do agendamento */}
          {modalIsOpen && selectedAgendamento && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg max-w-xl w-full m-4 modal-content">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Detalhes do Agendamento</h3>
                <div className="space-y-3">
                  <p className="text-gray-800 text-sm sm:text-base"><strong>Cliente:</strong> {selectedAgendamento.cliente.nome}</p>
                  <p className="whitespace-nowrap text-gray-800 text-sm sm:text-base"><strong>Data/Hora:</strong> {new Date(selectedAgendamento.dataHora).toLocaleString()}</p>
                  <p className="text-gray-800 text-sm sm:text-base"><strong>Status:</strong> {selectedAgendamento.status}</p>
                </div>
                {(modalType === 'confirmados' || modalType === 'atrasados') && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleGerenciarAgendamento(selectedAgendamento.id, 'REALIZADO')}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex-1 text-sm sm:text-base">
                      Confirmar Realizado
                    </button>
                  </div>
                )}
                {modalType === 'pendentes' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleGerenciarAgendamento(selectedAgendamento.id, 'CONFIRMADO')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1 text-sm sm:text-base">
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleGerenciarAgendamento(selectedAgendamento.id, 'CANCELADO_PELO_BARBEIRO')}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 text-sm sm:text-base">
                      Rejeitar
                    </button>
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full text-sm sm:text-base">
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Aba de Barbeiros */}
          <TabPanel>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Gerenciar Barbeiros</h3>
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
                  className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
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