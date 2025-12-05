from flask import Flask, request, jsonify
from flask_cors import CORS
from guardrails import validate_prompt, validate_response, get_system_prompt
import threading
import traceback

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Lazy-load do pipeline para evitar falha na importação ao iniciar o Flask
_text_generator = None
_text_generator_lock = threading.Lock()
_text_generator_error = None

def get_text_generator():
    global _text_generator, _text_generator_error
    if _text_generator is None and _text_generator_error is None:
        with _text_generator_lock:
            if _text_generator is None and _text_generator_error is None:
                try:
                    # import feito aqui para não travar a inicialização do app se transformers/torch falharem
                    from transformers import pipeline
                    # Carrega modelo para CPU (device=-1). Ajuste para GPU se disponível.
                    _text_generator = pipeline("text-generation", model="euer0/portuguese-gpt2", device=-1)
                    tokenizer = _text_generator.tokenizer
                    # Garantir pad_token para modelos que não definem
                    if getattr(tokenizer, "pad_token_id", None) is None:
                        try:
                            tokenizer.pad_token = tokenizer.eos_token
                        except Exception:
                            pass
                except Exception as e:
                    _text_generator_error = f"Erro ao carregar pipeline de geração: {e}\n{traceback.format_exc()}"
                    print(_text_generator_error)
    return _text_generator

def get_ai_response(user_prompt: str, system_prompt: str, language: str = 'pt-BR') -> str:
    """
    Geração defensiva: usa pipeline carregado lazy, max_new_tokens, e extração robusta.
    """
    text_generator = get_text_generator()
    if text_generator is None:
        if _text_generator_error:
            print(_text_generator_error)
        return "Desculpe, serviço de geração de respostas indisponível no momento."

    # Adaptar o prompt do sistema baseado no idioma
    if language == 'pt-BR':
        system_prompt = f"{system_prompt}\nResponda SEMPRE em português brasileiro. Não use nenhuma outra língua."
    
    full_prompt = f"{system_prompt}\n\nUsuário: {user_prompt}\nAssistente:"

    print("===================================")
    print(f"Prompt enviado ao modelo:\n{full_prompt}")
    print("===================================")

    try:
        generated_outputs = text_generator(
            full_prompt,
            max_new_tokens=150,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            num_return_sequences=1,
            pad_token_id=getattr(text_generator.tokenizer, "pad_token_id", None),
        )

        # Extrair texto gerado de forma compatível com diferentes versões da pipeline
        response_text = ""
        if isinstance(generated_outputs, list) and len(generated_outputs) > 0:
            response_text = generated_outputs[0].get("generated_text", "") or generated_outputs[0].get("text", "")
        elif isinstance(generated_outputs, dict):
            response_text = generated_outputs.get("generated_text", "") or generated_outputs.get("text", "")

        response_text = response_text or ""
        assistant_response = ""

        # Remover o prompt do início se presente
        if response_text.startswith(full_prompt):
            assistant_response = response_text[len(full_prompt):].strip()
        else:
            parts = response_text.split("Assistente:")
            if len(parts) > 1 and parts[1].strip():
                assistant_response = parts[1].strip()
            else:
                # fallback defensivo
                if full_prompt in response_text:
                    assistant_response = response_text.replace(full_prompt, "", 1).strip()
                else:
                    assistant_response = response_text.strip()

        # Limitar tamanho da resposta
        if len(assistant_response) > 3000:
            assistant_response = assistant_response[:3000].rsplit(".", 1)[0] + "."

        print(f"Resposta gerada pelo modelo: {assistant_response}")
        return assistant_response

    except Exception as e:
        print(f"Erro ao gerar texto: {e}\n{traceback.format_exc()}")
        return "Desculpe, ocorreu um erro ao tentar gerar uma resposta. Por favor, tente novamente mais tarde."

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'A mensagem é obrigatória.'}), 400

    user_prompt = data['message']
    language = data.get('language', 'pt-BR')  # Receber idioma do frontend

    is_valid, error_message = validate_prompt(user_prompt)
    if not is_valid:
        return jsonify({'response': error_message})

    system_prompt = get_system_prompt()
    model_response_text = get_ai_response(user_prompt, system_prompt, language)

    is_response_valid, final_response = validate_response(model_response_text)
    return jsonify({'response': final_response})

@app.route('/')
def hello_world():
    return 'Servidor do Chatbot ConsultAI está no ar. Use o endpoint /chat para interagir.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)