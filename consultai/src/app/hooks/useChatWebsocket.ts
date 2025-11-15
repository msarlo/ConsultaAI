'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface Message {
  autor: 'usuario' | 'bot';
  conteudo: string;
  timestamp: Date;
}

export function useChatWebsocket(url: string = 'wss://echo.websocket.org') {
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setConnected(true);

      // Mensagem de boas-vindas do bot
      setMensagens([
        {
          autor: 'bot',
          conteudo: 'Olá! Bem-vindo ao ConsultaAI. Como posso ajudá-lo?',
          timestamp: new Date(),
        },
      ]);
    };

    ws.onmessage = (event) => {
      console.log('Mensagem recebida:', event.data);

      // Echo server devolve a mesma mensagem, vamos criar uma resposta do bot
      setMensagens((prev) => [
        ...prev,
        {
          autor: 'bot',
          conteudo: `Recebi sua mensagem: "${event.data}". Como posso ajudar mais?`,
          timestamp: new Date(),
        },
      ]);
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url]);

  const enviarMensagem = useCallback((conteudo: string) => {
    if (!conteudo.trim()) return;

    // Adiciona mensagem do usuário
    const mensagemUsuario: Message = {
      autor: 'usuario',
      conteudo: conteudo.trim(),
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, mensagemUsuario]);

    // Envia via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(conteudo.trim());
    } else {
      console.error('WebSocket não está conectado');

      // Simula resposta de erro do bot
      setMensagens((prev) => [
        ...prev,
        {
          autor: 'bot',
          conteudo: 'Desculpe, não foi possível enviar a mensagem. Conexão perdida.',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  return {
    mensagens,
    enviarMensagem,
    connected,
  };
}
