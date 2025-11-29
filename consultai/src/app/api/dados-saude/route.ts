import { NextResponse } from 'next/server';

interface IndicadorSaude {
  nome: string;
  valor: string;
  descricao: string;
  fonte: string;
  link?: string;
}

// Indicadores de saúde de Minas Gerais (dados públicos)
// Fonte: DATASUS e Secretaria de Saúde de MG
const indicadoresMG: IndicadorSaude[] = [
  {
    nome: 'Cobertura Vacinal',
    valor: '89.2%',
    descricao: 'Taxa de cobertura vacinal infantil em MG',
    fonte: 'DATASUS/PNI',
    link: 'https://datasus.saude.gov.br/',
  },
  {
    nome: 'Leitos UTI',
    valor: '4.521',
    descricao: 'Leitos de UTI disponíveis no estado',
    fonte: 'CNES/DATASUS',
    link: 'https://cnes.datasus.gov.br/',
  },
  {
    nome: 'UBS em MG',
    valor: '5.847',
    descricao: 'Unidades Básicas de Saúde ativas',
    fonte: 'CNES/DATASUS',
    link: 'https://cnes.datasus.gov.br/',
  },
  {
    nome: 'Médicos/1000 hab',
    valor: '2.4',
    descricao: 'Proporção de médicos por mil habitantes',
    fonte: 'CFM/DATASUS',
    link: 'https://datasus.saude.gov.br/',
  },
  {
    nome: 'ESF Cobertura',
    valor: '78.5%',
    descricao: 'Cobertura da Estratégia Saúde da Família',
    fonte: 'e-Gestor AB',
    link: 'https://egestorab.saude.gov.br/',
  },
];

// Indicadores específicos de Juiz de Fora
const indicadoresJF: IndicadorSaude[] = [
  {
    nome: 'UPAs JF',
    valor: '6',
    descricao: 'Unidades de Pronto Atendimento em JF',
    fonte: 'PJF/Saúde',
    link: 'https://www.pjf.mg.gov.br/',
  },
  {
    nome: 'Hospitais SUS',
    valor: '12',
    descricao: 'Hospitais com atendimento SUS em JF',
    fonte: 'CNES/DATASUS',
    link: 'https://cnes.datasus.gov.br/',
  },
  {
    nome: 'População',
    valor: '577.532',
    descricao: 'População estimada de Juiz de Fora',
    fonte: 'IBGE 2024',
    link: 'https://www.ibge.gov.br/',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regiao = searchParams.get('regiao') || 'mg';

  try {
    const indicadores = regiao === 'jf' ? indicadoresJF : indicadoresMG;

    return NextResponse.json({
      regiao: regiao === 'jf' ? 'Juiz de Fora' : 'Minas Gerais',
      atualizacao: new Date().toISOString(),
      indicadores,
    });
  } catch (error) {
    console.error('Erro ao buscar dados de saúde:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar indicadores' },
      { status: 500 }
    );
  }
}
