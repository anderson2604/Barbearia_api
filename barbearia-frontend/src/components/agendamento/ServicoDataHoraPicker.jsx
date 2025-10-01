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
                const response = await axios.get(`http://localhost:8080/barbeiros/${barbeiro.id}/horarios`);
                
                // Transformar o array de objetos em um objeto agrupado por data
                const horariosPorData = response.data.reduce((acc, horario) => {
                    const data = horario.data;
                    if (!acc[data]) {
                        acc[data] = [];
                    }
                    acc[data].push(horario.hora);
                    return acc;
                }, {});

                setHorarios(horariosPorData);
            } catch (err) {
                console.error('Erro ao buscar horários:', err.response?.data || err.message);
                setError('Não foi possível carregar os horários. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (barbeiro && barbeiro.id) {
            fetchHorarios();
        }
    }, [barbeiro]);

    const handleConfirmarAgendamento = async () => {
        if (!servicoSelecionado || !servicoSelecionado.id || !dataSelecionada || !horarioSelecionado) {
            setError('Por favor, selecione um serviço, data e horário válidos.');
            return;
        }

        try {
            // Garantir que dataHora esteja no formato esperado pelo backend (yyyy-MM-dd'T'HH:mm:ss)
            const [hours, minutes] = horarioSelecionado.split(':');
            const dataHora = `${dataSelecionada}T${hours}:${minutes}:00`; // Garante o formato correto
            const agendamento = {
                idBarbeiro: barbeiro.id,
                nomeCliente: cliente.nome,
                telefoneCliente: cliente.telefone,
                dataHora,
                idServico: servicoSelecionado.id
            };
            console.log('Enviando agendamento:', agendamento);

            const response = await axios.post('http://localhost:8080/agendamentos', agendamento, {
                headers: { 'Content-Type': 'application/json' }
            });
            onAgendamentoSuccess(response.data);
            alert('Agendamento confirmado com sucesso!');
            navigate('/');
        } catch (err) {
            const errorDetails = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message;
            console.error('Erro ao agendar - Resposta completa:', err.response?.data || err.message);
            setError(`Falha ao agendar. Detalhes:\n${errorDetails}`);
        }
    };

    if (loading) return <p>Carregando horários...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const datas = Object.keys(horarios);

    return (
        <div className="servico-data-hora-picker-container">
            {/* Renderiza a lista de serviços SOMENTE se nenhum serviço foi selecionado */}
            {!servicoSelecionado && (
                <>
                    <h2>Selecione o Serviço</h2>
                    <ServicoList onSelectServico={setServicoSelecionado} servicoSelecionado={servicoSelecionado} />
                </>
            )}

            {servicoSelecionado && (
                <>
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