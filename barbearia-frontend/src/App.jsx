import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BarbeiroLoginPage from './pages/barbeiro/BarbeiroLoginPage';
import BarbeiroDashboard from './pages/barbeiro/BarbeiroDashboard';
import BarbeiroHorariosManager from './pages/barbeiro/BarbeiroHorariosManager'; // Adicione esta linha
import AgendarPage from './pages/AgendarPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/barbeiro/login" element={<BarbeiroLoginPage />} />
        <Route path="/barbeiro/dashboard" element={<BarbeiroDashboard />} />
        <Route path="/barbeiro/gerenciar-horarios" element={<BarbeiroHorariosManager />} /> {/* E esta rota */}
        <Route path="/agendar" element={<AgendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;