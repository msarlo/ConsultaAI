import { NextResponse } from 'next/server';

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Cache simples em memória (30 minutos)
let cache: { data: GNewsArticle[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key não configurada' },
      { status: 500 }
    );
  }

  // Verifica cache
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json({ articles: cache.data });
  }

  try {
    // Busca notícias de saúde de Minas Gerais
    const query = encodeURIComponent('saúde Minas Gerais');
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=pt&country=br&max=10&token=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache do Next.js de 30 min
    });

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data: GNewsResponse = await response.json();

    // Atualiza cache
    cache = {
      data: data.articles || [],
      timestamp: now,
    };

    return NextResponse.json({ articles: data.articles || [] });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);

    // Fallback com notícias estáticas se a API falhar
    const fallbackNews: GNewsArticle[] = [
      {
        title: 'Secretaria de Saúde de MG amplia vacinação',
        description: 'Novas doses de vacinas estão disponíveis em todas as regionais de saúde do estado.',
        content: '',
        url: 'https://www.saude.mg.gov.br',
        image: '',
        publishedAt: new Date().toISOString(),
        source: { name: 'SES-MG', url: 'https://www.saude.mg.gov.br' },
      },
      {
        title: 'UPAs de Juiz de Fora com atendimento 24h',
        description: 'Unidades de Pronto Atendimento funcionam normalmente durante o feriado.',
        content: '',
        url: 'https://www.pjf.mg.gov.br',
        image: '',
        publishedAt: new Date().toISOString(),
        source: { name: 'PJF', url: 'https://www.pjf.mg.gov.br' },
      },
      {
        title: 'Campanha de prevenção à dengue em MG',
        description: 'Estado intensifica ações de combate ao mosquito Aedes aegypti.',
        content: '',
        url: 'https://www.saude.mg.gov.br',
        image: '',
        publishedAt: new Date().toISOString(),
        source: { name: 'SES-MG', url: 'https://www.saude.mg.gov.br' },
      },
    ];

    return NextResponse.json({ articles: fallbackNews });
  }
}
