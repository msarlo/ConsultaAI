'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Chat from '@/app/components/Chat';

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>();

  const handlePerguntaClick = (pergunta: string) => {
    setSelectedQuestion(pergunta);
    // Resetar após um pequeno delay para permitir que o Chat processe
    setTimeout(() => setSelectedQuestion(undefined), 100);
  };

  return (
    <div className="h-screen w-screen bg-black p-0 flex flex-col">
      {/* Layout Principal: Sidebar + Chat */}
      <div className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        {/* Sidebar */}
        <Sidebar onPerguntaClick={handlePerguntaClick} />

        {/* Área do Chat */}
        <div className="flex flex-col h-full">
          <Chat initialMessage={selectedQuestion} />
        </div>
      </div>
    </div>
  );
}
