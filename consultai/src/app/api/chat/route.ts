import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Você é o ConsultAI, um assistente virtual especializado em saúde pública de Juiz de Fora (MG) e Minas Gerais.

Suas responsabilidades:
- Fornecer informações sobre UPAs, hospitais e unidades de saúde de Juiz de Fora
- Orientar sobre horários de atendimento e serviços disponíveis
- Informar sobre campanhas de vacinação e programas de saúde
- Ajudar com dúvidas gerais sobre o SUS na região

Diretrizes:
- Seja sempre cordial e profissional
- Forneça informações precisas e atualizadas
- Em casos de emergência, sempre oriente a ligar para o SAMU (192) ou ir à UPA mais próxima
- Não faça diagnósticos médicos
- Responda sempre em português brasileiro
- Seja conciso, mas completo nas respostas`;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY não configurada' },
      { status: 500 }
    );
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem inválida' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const botResponse = completion.choices[0]?.message?.content;

    if (!botResponse) {
      return NextResponse.json(
        { error: 'Resposta vazia do modelo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: botResponse });

  } catch (error) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
