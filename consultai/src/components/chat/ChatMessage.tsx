import { IconBot, IconUser } from './Icons';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
        message.sender === 'bot' 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-gradient-to-br from-gray-600 to-gray-700'
      }`}>
        {message.sender === 'bot' ? <IconBot /> : <IconUser />}
      </div>
      <div className={`flex flex-col max-w-xl ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3 rounded-2xl shadow-sm ${
          message.sender === 'bot'
            ? 'bg-white border border-gray-200 text-gray-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
        }`}>
          <p className="text-base leading-relaxed">
            <span className="sr-only">{message.sender === 'bot' ? 'ConsultAI' : 'Você'} disse: </span>
            {message.text}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">
          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}