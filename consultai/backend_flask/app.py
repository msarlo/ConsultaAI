from flask import Flask, request, jsonify
from guardrails import validate_prompt, validate_response, get_system_prompt

app = Flask(__name__)

# Este é um mock da função que chamaria o modelo de IA.
# Em uma aplicação real, aqui você faria a chamada para a API da OpenAI, Google, etc.
def get_ai_response(user_prompt: str, system_prompt: str) -> str:
    """
    Simula uma chamada a um modelo de linguagem.
    Incorpora o system_prompt para guiar o comportamento do modelo.
    """
    print("===================================")
    print(f"System Prompt: {system_prompt}")
    print(f"User Prompt: {user_prompt}")
    print("===================================")
    
    # Resposta simulada
    response = (
        "Obrigado por sua pergunta. Como o assistente virtual da Prefeitura de Juiz de Fora, "
        "estou aqui para ajudar com informações sobre nossos serviços. "
        "Atualmente, estamos em fase de desenvolvimento. Em breve, poderei responder a perguntas específicas."
    )
    return response

@app.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint principal para receber e processar as mensagens do chatbot.
    """
    # 1. Obter a mensagem do usuário a partir do corpo da requisição
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'A mensagem é obrigatória.'}), 400
    
    user_prompt = data['message']

    # 2. Validar o prompt do usuário com os guarda-chuvas de entrada
    is_valid, error_message = validate_prompt(user_prompt)
    if not is_valid:
        return jsonify({'response': error_message})

    # 3. Obter o system prompt para guiar o modelo
    system_prompt = get_system_prompt()

    # 4. (Simulação) Chamar o modelo de IA com os prompts
    # Em um caso real, a chamada à API do modelo de linguagem aconteceria aqui
    model_response_text = get_ai_response(user_prompt, system_prompt)

    # 5. Validar a resposta do modelo com os guarda-chuvas de saída
    is_response_valid, final_response = validate_response(model_response_text)
    
    # 6. Retornar a resposta final para o frontend
    return jsonify({'response': final_response})

@app.route('/')
def hello_world():
    return 'Servidor do Chatbot ConsultAI está no ar. Use o endpoint /chat para interagir.'

if __name__ == '__main__':
    # O host 0.0.0.0 permite que o servidor seja acessível a partir da rede local,
    # o que é útil para conectar o frontend Next.js ao backend Flask.
    app.run(host='0.0.0.0', port=5001, debug=True)

