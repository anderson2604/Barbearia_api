import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServicoList from './ServicoList';
import './ServicoDataHoraPicker.css';

const ServicoDataHoraPicker = ({ barbeiro, cliente, onAgendamentoSuccess }) => {
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [horarios, setHorarios] = useState({});
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                setLoading(true);
                setHorarios({});
                console.log(`Buscando horários para barbeiro ID: ${barbeiro.id}`);
                const response = await axios.get(`http://localhost:8080/barbeiros/${barbeiro.id}/horarios`);
//                console.log('Horários recebidos:', JSON.stringify(response.data, null, 2));
                // Transformar o array de objetos em um objeto agrupado por data
                const horariosPorData = response.data.reduce((acc, horario) => {
                    const data = horario.data;
                    const hora = horario.hora; // Formato "HH:mm:ss"
                    if (!acc[data]) {
                        acc[data] = [];
                    }
                    if (!acc[data].includes(hora)) {
                        acc[data].push(hora);
                    }
                    return acc;
                }, {});
                setHorarios(horariosPorData);
            } catch (err) {
                console.error('Erro ao buscar horários:', err.response?.data || err.message);
                setError(`Não foi possível carregar os horários. Detalhes: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (barbeiro && barbeiro.id) {
            fetchHorarios();
        } else {
            setHorarios({});
            setDataSelecionada(null);
            setHorarioSelecionado(null);
        }
    }, [barbeiro]);

    const handleConfirmarAgendamento = async () => {
        if (!servicoSelecionado || !servicoSelecionado.id || !dataSelecionada || !horarioSelecionado) {
            setError('Por favor, selecione um serviço, data e horário válidos.');
            return;
        }

        // Validar se o horário selecionado está na lista de horários disponíveis
        if (!horarios[dataSelecionada]?.includes(horarioSelecionado)) {
            setError('O horário selecionado não está disponível. Escolha outro horário.');
            return;
        }

        try {
            const dataHora = `${dataSelecionada}T${horarioSelecionado}`; // Ex.: "2025-10-09T17:00:00"
            const agendamento = {
                idBarbeiro: barbeiro.id,
                idServico: servicoSelecionado.id,
                nomeCliente: cliente.nome,
                telefoneCliente: cliente.telefone,
                dataHora,
                status: 'PENDENTE'
            };
            console.log('Payload do agendamento antes do envio:', JSON.stringify(agendamento, null, 2));

            const response = await axios.post('http://localhost:8080/agendamentos', agendamento, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Resposta do agendamento:', response.data);
            onAgendamentoSuccess(response.data);
            alert('Agendamento confirmado com sucesso!');
            navigate('/');
        } catch (err) {
            const errorDetails = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message;
            console.error('Erro ao agendar - Resposta completa:', errorDetails);
            setError(`Falha ao agendar. Detalhes:\n${errorDetails}`);
        }
    };

    if (loading) return <p>Carregando horários...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const datas = Object.keys(horarios);

    return (
        <div className="servico-data-hora-picker-container">
            <div className="agendamento-info">
                {cliente && (
                    <h3 className="cliente-info">
                        Cliente: {cliente.nome}
                    </h3>
                )}
                {barbeiro && (
                    <h3 className="barbeiro-info">
                        Barbeiro: {barbeiro.nome}
                    </h3>
                )}
            </div>
            {!servicoSelecionado && (
                <>
                    <h2>Selecione o Serviço</h2>
                    <ServicoList onSelectServico={setServicoSelecionado} servicoSelecionado={servicoSelecionado} />
                </>
            )}
            {servicoSelecionado && (
                <>
                    <h3 className="servico-info">
                        Serviço: {servicoSelecionado.nome} (R$ {servicoSelecionado.preco.toFixed(2)})
                    </h3>
                    <h2>Selecione a Data</h2>
                    <div className="datas-list">
                        {datas.map(data => (
                            <button
                                key={data}
                                className={`data-button ${data === dataSelecionada ? 'selected' : ''}`}
                                onClick={() => {
                                    setDataSelecionada(data);
                                    setHorarioSelecionado(null);
                                }}
                            >
                                {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
                                    timeZone: 'America/Sao_Paulo',
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {dataSelecionada && horarios[dataSelecionada] && (
                <>
                    <h2>Selecione o Horário</h2>
                    <div className="horarios-list">
                        {horarios[dataSelecionada].map(horario => (
                            <button
                                key={horario}
                                className={`horario-button ${horario === horarioSelecionado ? 'selected' : ''}`}
                                onClick={() => setHorarioSelecionado(horario)}
                            >
                                {horario}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {servicoSelecionado && dataSelecionada && horarioSelecionado && (
                <div className="confirm-section">
                    <button className="confirm-button" onClick={handleConfirmarAgendamento}>
                        Confirmar Agendamento
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServicoDataHoraPicker;