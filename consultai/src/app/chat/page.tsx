'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import Chat from '@/app/components/Chat';

export default function ChatPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>();

  const handlePerguntaClick = (pergunta: string) => {
    setSelectedQuestion(pergunta);
    // Resetar após um pequeno delay para permitir que o Chat processe
    setTimeout(() => setSelectedQuestion(undefined), 100);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 p-4 flex flex-col gap-4">
      {/* Header */}
      <Header />

      {/* Layout Principal: Sidebar + Chat */}
      <div className="flex-1 grid grid-cols-[25%_1fr] gap-4 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onPerguntaClick={handlePerguntaClick} />

        {/* Área do Chat */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl h-full">
            <Chat initialMessage={selectedQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
}
