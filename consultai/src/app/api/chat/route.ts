import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_NAME = 'gemini-1.0-pro';
const API_KEY = process.env.GEMINI_API_KEY || '';

async function runChat(messages: any[]) {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  // Transforma o histórico de mensagens para o formato da API Gemini
  const history = messages.slice(0, -1).map((message) => ({
    role: message.sender === 'user' ? 'user' : 'model',
    parts: [{ text: message.text }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history,
  });

  const result = await chat.sendMessage(lastMessage.text);
  const response = result.response;
  return response.text();
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Nenhuma mensagem fornecida' }, { status: 400 });
    }

    const botResponse = await runChat(messages);

    return NextResponse.json({ text: botResponse });
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    return NextResponse.json(
      { error: 'Erro ao se comunicar com a IA. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
