import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Eraser, LayoutDashboard } from 'lucide-react';
import { ChatMessage, Role } from '../types';
import ChatBubble from './ChatBubble';
import { sendChatMessageStream, resetChatSession } from '../services/geminiService';

const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Welcome to My Homepage! I'm your virtual assistant. I can help you check warranty status, find documents, or answer questions about your home maintenance.",
      timestamp: Date.now()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: ChatMessage = {
      id: botMsgId,
      role: Role.MODEL,
      text: '', // Start empty for streaming
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, initialBotMsg]);

    try {
      await sendChatMessageStream(userMsg.text, (streamedText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: streamedText } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, text: "Sorry, I encountered an issue connecting to the portal services. Please try again.", isError: true } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    resetChatSession();
    setMessages([{
      id: Date.now().toString(),
      role: Role.MODEL,
      text: "Chat cleared. How can I help with your home today?",
      timestamp: Date.now()
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-primary-50">
      {/* Header - Rebranded as Portal */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-700">
             <LayoutDashboard size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary-900">My Homepage</h2>
            <p className="text-xs text-primary-500">Secure Client Portal • Live Assistant</p>
          </div>
        </div>
        <button 
          onClick={handleClear}
          className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
          title="Clear Conversation"
        >
          <Eraser size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scroll-smooth">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1].text === '' && (
           <div className="flex justify-start w-full mb-6">
             <div className="flex items-center gap-2 text-primary-400 px-4">
               <Loader2 className="animate-spin" size={16} />
               <span className="text-sm">Processing request...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-primary-200">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-primary-50 p-2 rounded-3xl border border-primary-100 focus-within:border-primary-300 focus-within:bg-white focus-within:shadow-lg transition-all duration-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your warranty, maintenance, or documents..."
            className="w-full bg-transparent border-none focus:ring-0 text-primary-800 placeholder-primary-400 resize-none max-h-32 min-h-[44px] py-2.5 px-4"
            rows={1}
            style={{ height: 'auto' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full flex-shrink-0 mb-1 transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-primary-700 text-white shadow-md hover:bg-primary-800 hover:scale-105'
                : 'bg-primary-200 text-primary-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-primary-400 mt-3 hidden md:block">
          Secure connection. Information provided is for general guidance.
        </p>
      </div>
    </div>
  );
};

export default ChatView;