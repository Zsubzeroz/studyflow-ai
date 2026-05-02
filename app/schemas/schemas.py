from pydantic import BaseModel
from typing import List, Optional

class FlashcardResponse(BaseModel):
    pergunta: str
    resposta: str
    video_url: Optional[str] = None

class StudyMaterialResponse(BaseModel):
    flashcards: List[FlashcardResponse]
    # Você pode adicionar a questão ENEM aqui depois

# Adicionamos estes para o desafio de engenharia
class NotaRequest(BaseModel):
    nota: int

class FlashcardRevisaoResponse(BaseModel):
    id: int
    pergunta: str
    resposta: str
    video_url: Optional[str] = None

class StatsResponse(BaseModel):
    total_cards: int
    cards_vencidos: int
    cards_futuros: int
