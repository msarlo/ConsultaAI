"use client";

import React, { useRef, useEffect } from 'react';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import QuickActions from './chat/QuickActions';
import TypingIndicator from './chat/TypingIndicator';
import { useConversation } from '@/contexts/ConversationContext';
import Sidebar from './Sidebar';

export default function ChatBot() {
  const { currentConversation, addMessage, createConversation } = useConversation();
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = ["Onde encontrar UPAs em JF?", "Horário de atendimento", "Quero falar com um atendente"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading]);

  useEffect(() => {
    if (!currentConversation) {
      createConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processUserMessage = React.useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isTyping || isLoading || !currentConversation) {
      return;
    }
    
    addMessage({ text: messageText, sender: 'user' });
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o servidor.');
      }

      const data = await response.json();
      addMessage({ text: data.response, sender: 'bot' });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível obter uma resposta.';
      addMessage({ text: `Erro: ${errorMessage}`, sender: 'bot' });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [addMessage, currentConversation, isLoading, isTyping]);

  const sendMessage = React.useCallback(() => {
    if (input.trim() === '') return;
    processUserMessage(input.trim());
    setInput('');
  }, [input, processUserMessage]);

  const handleQuickAction = React.useCallback((action: string) => {
    processUserMessage(action);
  }, [processUserMessage]);

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-stretch p-0 min-h-0">
        <div className="w-full h-full flex flex-col overflow-hidden bg-white">
          {currentConversation ? (
            <>
              <div 
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-transparent min-h-0"
                aria-live="polite"
                aria-busy={isLoading}
              >
                {currentConversation.messages.map((message, index) => {
                  const prevMessage = index > 0 ? currentConversation.messages[index - 1] : null;
                  const msgDate = message.timestamp.toLocaleDateString('pt-BR');
                  const prevDate = prevMessage?.timestamp.toLocaleDateString('pt-BR');
                  const showDate = msgDate !== prevDate;

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="w-full text-center text-xs text-gray-400 my-2">
                          {msgDate}
                        </div>
                      )}
                      <ChatMessage message={message} />
                    </React.Fragment>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-center items-center py-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" aria-label="Carregando resposta do bot"></div>
                  </div>
                )}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              <QuickActions 
                actions={quickActions}
                onAction={handleQuickAction}
                disabled={isTyping || isLoading}
              />

              <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendMessage}
                disabled={isTyping || isLoading}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Bem-vindo ao ConsultAI
                </h2>
                <p className="text-gray-600 mb-6">
                  Seu assistente virtual inteligente para consultas e atendimento automatizado.
                </p>
                <button
                  onClick={createConversation}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto font-medium shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Iniciar Nova Conversa
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Ou clique em &quot;Nova Conversa&quot; na barra lateral
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
