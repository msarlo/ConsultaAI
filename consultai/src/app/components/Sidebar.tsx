'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2 } from 'lucide-react';

const perguntas = [
  "Como funciona o sistema X?",
  "Gerar relatório de atendimentos",
  "Quais são os horários das unidades?",
  "Quero falar com um atendente"
];

interface NewsItem {
  API: string;
  Description: string;
  Link: string;
}

interface SidebarProps {
  onPerguntaClick?: (pergunta: string) => void;
}

export default function Sidebar({ onPerguntaClick }: SidebarProps) {
  const [noticias, setNoticias] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public-apis')
      .then((res) => res.json())
      .then((data) => {
        if (data.entries) {
          setNoticias(data.entries.slice(0, 15));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar notícias:', err);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="w-full h-full bg-[#0a0a0a] border-r border-gray-800 flex flex-col overflow-hidden">
      {/* Header do Sidebar */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">ConsultaAI</h1>
            <p className="text-xs text-gray-400">Assistente de IA</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Perguntas Frequentes */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Perguntas Frequentes</h2>
          </div>
          <div className="flex flex-col gap-2">
            {perguntas.map((pergunta, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto py-3 px-3 bg-gray-900 hover:bg-gray-800 border-0 text-gray-300 hover:text-white transition-colors rounded-lg"
                onClick={() => onPerguntaClick?.(pergunta)}
              >
                <span className="text-sm">{pergunta}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* APIs Públicas */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">APIs Públicas</h2>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {noticias.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-800 pb-3 last:border-0"
                >
                  <h4 className="font-medium text-sm text-gray-200 mb-1">
                    {item.API}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {item.Description}
                  </p>
                  {item.Link && (
                    <a
                      href={item.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      Ver mais →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botão Nova Conversa */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
          Nova Conversa
        </Button>
      </div>
    </aside>
  );
}
