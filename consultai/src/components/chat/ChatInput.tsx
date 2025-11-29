import { useRef, useEffect } from 'react';
import { IconSend } from './Icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() === '' || disabled) return;
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() !== '' && !disabled) {
        handleSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Foca o input quando o componente é montado
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="px-4 py-3 bg-white/5 border-t border-gray-200">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          {/* Campo de texto acessível */}
          <label htmlFor="chat-input" className="sr-only">Digite sua mensagem</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Aguarde..." : "Digite sua mensagem..."}
            rows={1}
            disabled={disabled}
            aria-label="Campo para digitar mensagem"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none text-gray-800 disabled:bg-gray-100"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={value.trim() === '' || disabled}
          aria-label="Enviar mensagem"
          className="w-12 h-12 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
        >
          <IconSend />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
export type { ChatInputProps };