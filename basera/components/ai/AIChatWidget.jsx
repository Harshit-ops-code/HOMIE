'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AIChatWidget({ city = 'bengaluru' }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! 🙏 I'm your Basera local buddy for ${cityName}.\n\nMoving to a new city can feel like a lot to take in, but I've got your back! Ask me about broker-free stays, home-cooked regional tiffin trials, or verified maids & cooks.\n\nWhat would you like to explore first?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const SUGGESTIONS = [
    { label: '🏠 Stays near Metro', query: `Where can I find a good 1BHK or PG near the metro in ${cityName}?` },
    { label: '🍱 Tiffin trials', query: `Recommend good home tiffin services with meal trials in ${cityName}.` },
    { label: '✨ Maid & Cook rates', query: `What are the standard monthly rates for a cook and maid in ${cityName}?` },
    { label: '💡 Safe areas', query: `Which neighborhoods in ${cityName} are safest and best for newcomers?` }
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: textToSend.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const userProfile = session?.user ? { name: session.user.name, role: session.user.role } : null;
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          city,
          userProfile
        })
      });
      const json = await res.json();
      if (json.success && json.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: json.message }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Hey dost! I'm taking a quick breather right now. Feel free to try again or explore our verified listings right on the dashboard! 🏡`
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Hey dost! I ran into a brief connection hiccup. Please try again in a moment! 🙏`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[360px] max-w-[360px] h-[500px] bg-white border border-[#2d2621]/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-[#2d2621] p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 flex items-center justify-center text-[#c85a32]">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <p className="text-xs font-bold tracking-tight">Basera Local Companion</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">{cityName} Hub</p>
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 bg-[#faf9f6]">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'user' 
                      ? 'bg-[#c85a32] text-white rounded-tr-none shadow-sm font-medium' 
                      : 'bg-white border border-[#2d2621]/10 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Starter Suggestion Chips on initial load */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  Quick Questions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(item.query)}
                      className="text-[11px] font-semibold bg-white hover:bg-[#f5f0e8] text-gray-700 hover:text-[#2d2621] border border-[#2d2621]/10 px-3 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="self-start flex items-center gap-2 bg-white border border-[#2d2621]/10 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Checking local recommendations</span>
                <span className="w-1.5 h-1.5 bg-[#c85a32] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#c85a32] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#c85a32] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#2d2621]/10 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about rents, food trials, helpers..."
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-[#faf9f6] border border-[#2d2621]/15 rounded-full px-4 py-2.5 outline-none text-xs font-semibold text-[#2d2621] focus:border-[#c85a32] focus:ring-2 focus:ring-[#c85a32]/10 transition-all placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-[#c85a32] hover:bg-[#b04d29] text-white rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all disabled:opacity-40 shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Basera Local Companion"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#2d2621] hover:bg-[#3d342d] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#c85a32]/30 group"
      >
        <span className="material-symbols-outlined text-[24px] sm:text-[26px] text-white group-hover:rotate-6 transition-transform">
          {isOpen ? 'close' : 'psychology'}
        </span>
      </button>
    </div>
  );
}
