'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AIChatWidget({ city = 'bengaluru' }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi there! I am your Basera local assistant. Ask me anything about stays, regional food options, or daily helpers in ${city.charAt(0).toUpperCase() + city.slice(1)}!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const userProfile = session?.user ? { name: session.user.name, role: session.user.role } : null;
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          city,
          userProfile
        })
      });
      const json = await res.json();
      if (json.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: json.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the network right now. Please try again." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred. Please verify your connection and retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[360px] h-[500px] bg-white border border-outline rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <div>
                <p className="text-xs font-bold font-plus-jakarta tracking-tight">Basera Local Assistant</p>
                <p className="text-[9px] text-white/70 font-semibold tracking-wider uppercase">Context: {city}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 transition-colors material-symbols-outlined text-xl"
            >
              close
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-outline text-gray-700 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="self-start flex items-center gap-2 bg-white border border-outline p-3 rounded-2xl rounded-tl-none shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-outline/50 bg-white flex gap-2">
            <input 
              type="text" placeholder="Ask about rents, food trials..."
              value={input} onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-gray-50 border border-outline rounded-full px-4 py-2.5 outline-none text-xs font-semibold text-primary focus:border-primary transition-all"
            />
            <button 
              type="submit" disabled={!input.trim() || loading}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm font-bold">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-103 active:scale-95 transition-all cursor-pointer border border-primary-variant"
      >
        <span className="material-symbols-outlined text-[26px]">
          {isOpen ? 'chat_bubble' : 'psychology'}
        </span>
      </button>
    </div>
  );
}
