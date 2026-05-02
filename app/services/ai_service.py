import os
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()

class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model_name = "gemini-1.5-flash"

    def generate_study_material(self, text_content: str):
        
        prompt = f"""
        Você é um professor especialista em concursos e ENEM. 
        Com base no texto fornecido, crie materiais de estudo seguindo rigorosamente este formato JSON:

        {{
            "flashcards": [
                {{"pergunta": "...", "resposta": "..."}},
                {{"pergunta": "...", "resposta": "..."}}
            ],
            "questao_enem": {{
                "enunciado": "...",
                "comando": "...",
                "alternativas": {{
                    "a": "...",
                    "b": "...",
                    "c": "...",
                    "d": "...",
                    "e": "..."
                }},
                "resposta_correta": "a",
                "explicacao": "..."
            }}
        }}

        Texto de base:
        {text_content}
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json" # Isso garante que o Gemini retorne apenas o JSON
                }
            )
            texto_limpo = response.text.replace("```json", "").replace("```", "").strip()
            return texto_limpo
        except Exception as e:
            print(f"Erro na chamada da IA: {e}")
            return None

# Para testar no terminal:
'''if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv() # Carrega o .env para teste
    
    service = AIService()
    resultado = service.generate_study_material("O ciclo da água envolve evaporação e condensação.")
    print(resultado)
'''