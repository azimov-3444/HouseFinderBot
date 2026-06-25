import React, { useState, useRef, useEffect } from 'react';
import { IoChatbubblesOutline, IoClose, IoSend, IoHardwareChipOutline } from 'react-icons/io5';
import { chatWithAi } from '../services/aiService';

const AiChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Salom! Men House Finder AI yordamchisiman. Ko'chmas mulk, qizil zonalar yoki sarmoya haqida savollaringiz bo'lsa bering.", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({ text: msg.text, sender: msg.sender }));
      const res = await chatWithAi(userMessage.text, history);
      setIsFallbackMode(res.data.aiEnabled === false);
      const aiReply = { id: Date.now() + 1, text: res.data.reply, sender: 'ai' };
      setMessages(prev => [...prev, aiReply]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Ulanishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-xl shadow-accent-500/30 hover:scale-105 transition-transform z-50 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <IoChatbubblesOutline className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300 h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent-600 to-accent-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <IoHardwareChipOutline className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Ekspert</h3>
                <p className="text-xs text-accent-100">
                  {isFallbackMode ? 'Fallback rejim: billing/quota tekshiring' : 'Oflayn emas, har doim yordamga tayyor'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 rounded-2xl rounded-bl-none border border-slate-100 p-3 shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Savolingizni yozing..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-accent-400 transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 p-2 text-accent-500 hover:text-accent-600 disabled:text-slate-300 disabled:bg-transparent bg-white rounded-lg transition-colors"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatBot;
