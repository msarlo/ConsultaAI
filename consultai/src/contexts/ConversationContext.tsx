"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearCurrentConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    // Carregar conversas do localStorage
    const saved = localStorage.getItem('conversations');
    if (saved) {
      const parsed = JSON.parse(saved) as Conversation[];
      setConversations(parsed.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: c.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })));
    }
  }, []);

  useEffect(() => {
    // Salvar conversas no localStorage
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Nova Conversa',
      messages: [{
        id: crypto.randomUUID(),
        text: "Olá! Sou o ConsultAI. Como posso ajudá-lo?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setCurrentConversation(prev => {
      if (!prev) {
        console.log('Nenhuma conversa atual para adicionar mensagem');
        return prev;
      }

      const newMessage: Message = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };

      console.log('Adicionando mensagem:', newMessage);

      const updatedConversation = {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date(),
        title: prev.messages.length === 1 
          ? message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '')
          : prev.title
      };

      console.log('Conversa atualizada:', updatedConversation);

      // Atualiza também o array de conversas
      setConversations(prevConvs =>
        prevConvs.map(c => c.id === updatedConversation.id ? updatedConversation : c)
      );

      return updatedConversation;
    });
  };

  const clearCurrentConversation = () => {
    setCurrentConversation(null);
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        createConversation,
        selectConversation,
        deleteConversation,
        addMessage,
        clearCurrentConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
