import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
);

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);


const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (key.trim().length < 10) { // Basic validation
        setError('Please enter a valid API key.');
        return;
    }
    setError('');
    onSave(key.trim());
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-900 font-sans">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Enter Your API Key</h1>
        <p className="text-gray-400 text-center mb-6">To use the AI Photo Enhancer, please provide your Google Gemini API key.</p>
        
        <div className="relative mb-4">
          <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste your Gemini API key here"
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            aria-label="Gemini API Key"
          />
        </div>

        {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}

        <button
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 disabled:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-300"
        >
          Save & Start Enhancing
        </button>

        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 font-medium">Your key is safe.</p>
            <p className="text-xs text-gray-500">It's stored only in your browser's local storage and is never sent to our servers. It is used directly to communicate with the Google Gemini API.</p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have a key? Get one from{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium">
            Google AI Studio
          </a>.
        </p>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;
