'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Newspaper, Activity, ExternalLink } from 'lucide-react';

const perguntas = [
  "Como funciona o sistema de saúde?",
  "Onde encontrar UPAs em JF?",
  "Quais são os horários das unidades?",
  "Quero falar com um atendente"
];

interface NoticiaSaude {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface IndicadorSaude {
  nome: string;
  valor: string;
  descricao: string;
  fonte: string;
  link?: string;
}

interface SidebarProps {
  onPerguntaClick?: (pergunta: string) => void;
}

export default function Sidebar({ onPerguntaClick }: SidebarProps) {
  const [noticias, setNoticias] = useState<NoticiaSaude[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadorSaude[]>([]);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [loadingIndicadores, setLoadingIndicadores] = useState(true);

  useEffect(() => {
    // Buscar notícias de saúde
    fetch('/api/noticias-saude')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setNoticias(data.articles.slice(0, 5));
        }
        setLoadingNoticias(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar notícias:', err);
        setLoadingNoticias(false);
      });

    // Buscar indicadores de saúde
    fetch('/api/dados-saude?regiao=mg')
      .then((res) => res.json())
      .then((data) => {
        if (data.indicadores) {
          setIndicadores(data.indicadores.slice(0, 4));
        }
        setLoadingIndicadores(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar indicadores:', err);
        setLoadingIndicadores(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

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
            <p className="text-xs text-gray-400">Saúde MG</p>
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

        {/* Indicadores de Saúde */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Indicadores MG</h2>
          </div>
          {loadingIndicadores ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {indicadores.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-800"
                >
                  <p className="text-lg font-bold text-cyan-400">{item.valor}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.nome}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notícias de Saúde */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Notícias de Saúde</h2>
          </div>
          {loadingNoticias ? (
            <p className="text-sm text-gray-500">Carregando notícias...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {noticias.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-900 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-gray-200 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-gray-500 flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{item.source?.name}</span>
                    <span className="text-xs text-gray-600">{formatDate(item.publishedAt)}</span>
                  </div>
                </a>
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
