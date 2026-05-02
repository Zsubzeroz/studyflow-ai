from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Flashcard(Base):
    __tablename__ = 'flashcards'

    id = Column(Integer, primary_key=True)
    pergunta = Column(Text, nullable=False)
    resposta = Column(Text, nullable=False)
    video_url = Column(String(500), nullable=True)
    
    # Campos para o Algoritmo SRS (vamos usar depois)
    intervalo = Column(Integer, default=0) # Dias
    facilidade = Column(Float, default=2.5) 
    repeticoes = Column(Integer, default=0)
    proxima_revisao = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuestaoEnem(Base):
    __tablename__ = 'questoes_enem'

    id = Column(Integer, primary_key=True)
    enunciado = Column(Text, nullable=False)
    comando = Column(Text)
    alternativa_a = Column(String(500))
    alternativa_b = Column(String(500))
    alternativa_c = Column(String(500))
    alternativa_d = Column(String(500))
    alternativa_e = Column(String(500))
    resposta_correta = Column(String(1)) # a, b, c, d ou e
    explicacao = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
