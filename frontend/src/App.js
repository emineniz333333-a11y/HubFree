import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import IncorrectPasswordPage from './pages/IncorrectPasswordPage';
import VerifyPhonePage from './pages/VerifyPhonePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProcessingPage from './pages/ProcessingPage';
import SuccessPage from './pages/SuccessPage';
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
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;