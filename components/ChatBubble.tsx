import React from 'react';
import { ChatMessage, Role } from '../types';
import MarkdownView from './MarkdownView';
import { User, Bot } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${isUser ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 border border-primary-100'}`}>
          {isUser ? <User size={18} /> : <Bot size={20} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div 
            className={`px-5 py-3.5 shadow-sm text-sm md:text-base ${
              isUser 
                ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white text-primary-900 border border-primary-100 rounded-2xl rounded-tl-sm'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <MarkdownView content={message.text} />
            )}
          </div>
          <span className="text-xs text-primary-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ChatBubble;