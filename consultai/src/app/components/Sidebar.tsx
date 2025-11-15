'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

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
    fetch('https://api.publicapis.org/entries')
      .then((res) => res.json())
      .then((data) => {
        if (data.entries) {
          setNoticias(data.entries.slice(0, 5));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar notícias:', err);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col gap-4 p-4">
      {/* Perguntas Pré-definidas */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {perguntas.map((pergunta, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => onPerguntaClick?.(pergunta)}
              >
                <span className="text-sm text-gray-700">{pergunta}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notícias da API */}
      <Card className="shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-700">
            APIs Públicas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6 pb-4">
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : (
              <div className="flex flex-col gap-3">
                {noticias.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-3 last:border-0"
                  >
                    <h4 className="font-medium text-sm text-gray-800 mb-1">
                      {item.API}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.Description}
                    </p>
                    {item.Link && (
                      <a
                        href={item.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Ver mais →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
}
