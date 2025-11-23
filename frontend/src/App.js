import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import IncorrectPasswordPage from './pages/IncorrectPasswordPage';
import VerifyPhonePage from './pages/VerifyPhonePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WaitingPage from './pages/WaitingPage';
import SuccessPage from './pages/SuccessPage';
import AdminPanelPage from './pages/AdminPanelPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/incorrect-password" element={<IncorrectPasswordPage />} />
          <Route path="/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/waiting" element={<WaitingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin-panel-secret" element={<AdminPanelPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;