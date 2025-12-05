import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

interface GeminiContent {
  parts: { text: string }[];
  role: string;
}

interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY não configurada' },
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

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nUsuário: ${message}` }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return NextResponse.json(
        { error: `Erro da API: ${data.error.message}` },
        { status: response.status }
      );
    }

    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
