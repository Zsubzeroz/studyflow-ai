import json
from dotenv import load_dotenv
from app.core.database import SessionLocal, init_db
from app.models.models import Flashcard, QuestaoEnem
from app.utils.pdf_handler import PDFProcessor  # Ajustei o caminho conforme sua pasta utils
from app.services.ai_service import AIService

# 1. Carregar as variáveis de ambiente logo no início
load_dotenv()

def main():
    init_db() # Cria as tabelas se não existirem
    print("🚀 Iniciando processamento do StudyFlow AI...")

    # Passo 1: Extrair texto do PDF
    pdf_path = "piano.pdf"
    pdf_processor = PDFProcessor(pdf_path)
    extracted_text = pdf_processor.extract_text()

    if not extracted_text:
        print("❌ Erro: Não foi possível extrair texto do PDF.")
        return

    print(f"✅ Texto extraído com sucesso ({len(extracted_text)} caracteres).")

    # Passo 2: Gerar material de estudo usando a IA
    ai_service = AIService()
    print("🧠 IA gerando conteúdo, aguarde...")
    
    raw_response = ai_service.generate_study_material(extracted_text)

    if raw_response:
        # Passo 3: Converter String para Dicionário (JSON)
        try:
            study_data = json.loads(raw_response)
            
            # Aqui você já poderia acessar os dados, ex:
            print("\n--- MATERIAL GERADO ---")
            print(f"Cards gerados: {len(study_data.get('flashcards', []))}")
            print(f"Questão ENEM: {study_data.get('questao_enem', {}).get('enunciado')[:100]}...")
            
            # Exibir o JSON bonitinho no terminal
            # print(json.dumps(study_data, indent=4, ensure_ascii=False))

            # Iniciar sessão no banco de dados
            db = SessionLocal()

            try:
                # 1. Salvar Flashcards
                for card in study_data.get('flashcards', []):
                    novo_flashcard = Flashcard(
                        pergunta=card['pergunta'],
                        resposta=card['resposta']
                    )
                    db.add(novo_flashcard) # Adiciona na fila de salvamento

                # 2. Salvar Questão ENEM
                q = study_data.get('questao_enem', {})
                alts = q.get('alternativas', {})
                
                nova_questao = QuestaoEnem(
                    enunciado=q.get('enunciado'),
                    comando=q.get('comando'),
                    alternativa_a=alts.get('a'),
                    alternativa_b=alts.get('b'),
                    alternativa_c=alts.get('c'),
                    alternativa_d=alts.get('d'),
                    alternativa_e=alts.get('e'),
                    resposta_correta=q.get('resposta_correta'),
                    explicacao=q.get('explicacao')
                )
                db.add(nova_questao)

                # 3. Confirmar todas as alterações (COMMIT)
                db.commit()
                print("✅ Tudo salvo no banco de dados com sucesso!")

            except Exception as e:
                db.rollback() # Se der erro em qualquer parte, cancela tudo
                print(f"❌ Erro ao salvar no banco: {e}")
            finally:
                db.close() # Fecha a conexão (Importante para não travar o arquivo .db)

        except json.JSONDecodeError:
            print("❌ Erro: A IA não retornou um formato JSON válido.")
    else:
        print("❌ Erro: A IA não conseguiu gerar conteúdo.")

if __name__ == "__main__":
    main()
