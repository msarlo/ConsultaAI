'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatWebsocket } from '@/app/hooks/useChatWebsocket';
import { Download, Send } from 'lucide-react';

interface ChatProps {
  initialMessage?: string;
}

export default function Chat({ initialMessage }: ChatProps) {
  const { mensagens, enviarMensagem, connected } = useChatWebsocket();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Envia mensagem inicial se fornecida
  useEffect(() => {
    if (initialMessage && connected) {
      enviarMensagem(initialMessage);
    }
  }, [initialMessage, connected, enviarMensagem]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  const handleEnviar = () => {
    if (inputValue.trim()) {
      enviarMensagem(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleSalvar = () => {
    const chatId = crypto.randomUUID();
    const dataISO = new Date().toISOString();

    const chatData = {
      id: chatId,
      data: dataISO,
      mensagens: mensagens.map((msg) => ({
        autor: msg.autor,
        conteudo: msg.conteudo,
      })),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chatId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Chat de Atendimento
            </h2>
            <p className="text-sm text-gray-400">Conectado • Assistência em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-cyan-400' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-400">
              {connected ? 'Ativo' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {mensagens.map((mensagem, index) => (
            <div
              key={index}
              className={`flex ${
                mensagem.autor === 'usuario' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  mensagem.autor === 'usuario'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-900 text-gray-100 border border-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {mensagem.conteudo}
                </p>
                <span
                  className={`text-xs mt-1 block ${
                    mensagem.autor === 'usuario'
                      ? 'text-cyan-100'
                      : 'text-gray-500'
                  }`}
                >
                  {mensagem.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 px-6 py-4 bg-black">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="flex gap-3">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!connected}
              className="flex-1 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <Button
              onClick={handleEnviar}
              disabled={!connected || !inputValue.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>

          <Button
            onClick={handleSalvar}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-gray-900"
            disabled={mensagens.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Salvar Conversa (JSON)
          </Button>

          <p className="text-xs text-center text-gray-600">
            Powered by ConsultaAI
          </p>
        </div>
      </div>
    </div>
  );
}
