import React, { useState } from 'react';
import ClienteLogin from '../components/cliente/ClienteLogin';
import ClienteCadastroModal from '../components/cliente/ClienteCadastroModal';
import BarbeirosList from '../components/barbeiro/BarbeirosList';
import ServicoDataHoraPicker from '../components/agendamento/ServicoDataHoraPicker';
import './AgendarPage.css';

const AgendarPage = () => {
    // 0: Login, 1: Cadastro, 2: Escolha do Barbeiro, 3: Escolha do Serviço/Data
    const [step, setStep] = useState(0);
    const [cliente, setCliente] = useState(null);
    const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);

    const handleLoginSuccess = (clienteData) => {
        setCliente(clienteData);
        setStep(2); // Vai para a escolha do barbeiro
    };

    const handleClienteNotFound = () => {
        setStep(1); // Abre o modal de cadastro
    };

    const handleCadastroSuccess = (novoCliente) => {
        setCliente(novoCliente);
        setStep(2); // Vai para a escolha do barbeiro
    };

    const handleBarbeiroSelected = (barbeiroData) => {
        setBarbeiroSelecionado(barbeiroData);
        setStep(3);
    };

    const handleAgendamentoSuccess = () => {
        // alert('Seu agendamento foi realizado com sucesso!');
        window.location.href = '/';
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <ClienteLogin
                        onLoginSuccess={handleLoginSuccess}
                        onClienteNotFound={handleClienteNotFound}
                    />
                );
            case 1:
                return (
                    <ClienteCadastroModal
                        onCadastroSuccess={handleCadastroSuccess}
                    />
                );
            case 2:
                return (
                    <div>
                        {cliente && (
                            <h3 className="cliente-info">
                                Cliente: {cliente.nome}
                            </h3>
                        )}
                        <BarbeirosList
                            onBarbeiroSelected={handleBarbeiroSelected}
                        />
                    </div>
                );
            case 3:
                return (
                    <ServicoDataHoraPicker
                        barbeiro={barbeiroSelecionado}
                        cliente={cliente}
                        onAgendamentoSuccess={handleAgendamentoSuccess}
                    />
                );
            default:
                return <p>Ocorreu um erro. Por favor, recarregue a página.</p>;
        }
    };

    return (
        <div className="agendar-page-container">
            <h1 className="agendar-title">Agendamento Online</h1>
            <p className="agendar-subtitle">Siga os passos para agendar seu corte.</p>
            <div className="step-indicator">
                <span className={step === 0 ? 'active' : ''}>1. Telefone</span>
                <span className={step === 1 ? 'active' : ''}>2. Cadastro</span>
                <span className={step === 2 ? 'active' : ''}>3. Barbeiro</span>
                <span className={step === 3 ? 'active' : ''}>4. Data/Hora</span>
            </div>
            <div className="agendar-content">
                {renderStep()}
            </div>
        </div>
    );
};

export default AgendarPage;