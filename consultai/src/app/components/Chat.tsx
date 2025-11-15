'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatWebsocket, Message } from '@/app/hooks/useChatWebsocket';
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Chat de Atendimento
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-600">
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-6">
          <div className="flex flex-col gap-4">
            {mensagens.map((mensagem, index) => (
              <div
                key={index}
                className={`flex ${
                  mensagem.autor === 'usuario' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    mensagem.autor === 'usuario'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {mensagem.conteudo}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      mensagem.autor === 'usuario'
                        ? 'text-blue-100'
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
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-gray-200 pt-4 flex-col gap-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected}
            className="flex-1"
          />
          <Button
            onClick={handleEnviar}
            disabled={!connected || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleSalvar}
          variant="outline"
          className="w-full"
          disabled={mensagens.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Salvar Conversa (JSON)
        </Button>
      </CardFooter>
    </Card>
  );
}
