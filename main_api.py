from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
from dotenv import load_dotenv
import random

load_dotenv()
import random
from datetime import datetime, timedelta

from app.core.database import SessionLocal, init_db
from app.utils.pdf_handler import PDFProcessor
from app.services.ai_service import AIService
from app.models.models import Flashcard, QuestaoEnem
from app.services.srs_service import SRSService
from app.services.srs_service import SRSService
from app.schemas.schemas import NotaRequest, FlashcardRevisaoResponse, StatsResponse

app = FastAPI(title="StudyFlow AI API")

# Liberar o React para acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, você colocaria a URL real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa o banco ao subir o servidor
init_db()

# Dependência para pegar a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "StudyFlow AI API is running!"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Salvar o arquivo temporariamente
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 2. Processar PDF
        processor = PDFProcessor(temp_path)
        text = processor.extract_text()

        # 3. Gerar IA e Salvar no Banco
        ai_service = AIService()
        raw_response = ai_service.generate_study_material(text)
        
        if not raw_response:
            raise HTTPException(status_code=500, detail="Erro ao gerar material de estudo via IA.")
            
        import json
        try:
            study_data = json.loads(raw_response)
            
            # Salvar Flashcards
            for card in study_data.get('flashcards', []):
                novo_flashcard = Flashcard(
                    pergunta=card['pergunta'],
                    resposta=card['resposta'],
                    video_url=card.get('video_url')
                )
                db.add(novo_flashcard)
                
            # Salvar Questão ENEM
            q = study_data.get('questao_enem', {})
            if q:
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
                
            db.commit()
            return {"filename": file.filename, "status": "Processado com sucesso", "cards_gerados": len(study_data.get('flashcards', []))}
            
        except json.JSONDecodeError:
            db.rollback()
            raise HTTPException(status_code=500, detail="Erro ao decodificar a resposta da IA.")

    finally:
        # Limpar o arquivo temporário
        if os.path.exists(temp_path):
            os.remove(temp_path)

# ---------------------------------------------------------
# DESAFIO DE ENGENHARIA: Rotas de Revisão
# ---------------------------------------------------------

@app.get("/cards/revisar")
def listar_cards_para_revisao(db: Session = Depends(get_db)):
    """Retorna os cards que precisam ser estudados hoje."""
    cards = db.query(Flashcard).filter(Flashcard.proxima_revisao <= datetime.utcnow()).all()
    return cards

@app.post("/cards/responder/{card_id}")
def responder_card(card_id: int, qualidade: int, db: Session = Depends(get_db)):
    """
    Recebe a nota (0-5) do usuário e calcula a próxima revisão do card.
    """
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    
    if not card:
        return {"error": "Card não encontrado"}

    # Usamos nosso serviço de SRS para calcular os novos valores
    proxima, reps, facilidade, intervalo = SRSService.calculate_next_review(
        qualidade, card.repeticoes, card.facilidade, card.intervalo
    )

    # Atualizamos o objeto no banco
    card.proxima_revisao = proxima
    card.repeticoes = reps
    card.facilidade = facilidade
    card.intervalo = intervalo

    db.commit()
    return {"message": "Progresso salvo!", "proxima_revisao": proxima}

@app.get("/simulado/random")
def obter_questao_simulado(db: Session = Depends(get_db)):
    """Retorna uma questão aleatória do ENEM para praticar."""
    questoes = db.query(QuestaoEnem).all()
    if not questoes:
        return {"error": "Nenhuma questão encontrada no banco."}
    return random.choice(questoes)

@app.get("/stats", response_model=StatsResponse)
def obter_estatisticas(db: Session = Depends(get_db)):
    """Retorna o progresso geral e estimativa de estudos futuros."""
    total_cards = db.query(Flashcard).count()
    cards_vencidos = db.query(Flashcard).filter(Flashcard.proxima_revisao <= datetime.utcnow()).count()
    
    futuro = datetime.utcnow() + timedelta(days=7)
    cards_futuros = db.query(Flashcard).filter(
        Flashcard.proxima_revisao > datetime.utcnow(),
        Flashcard.proxima_revisao <= futuro
    ).count()
    
    return StatsResponse(
        total_cards=total_cards,
        cards_vencidos=cards_vencidos,
        cards_futuros=cards_futuros
    )
