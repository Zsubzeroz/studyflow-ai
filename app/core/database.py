from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base
import os

# Garantimos que a pasta de dados exista para o volume do Docker funcionar
os.makedirs("./data", exist_ok=True)
DATABASE_URL = "sqlite:///./data/studyflow.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Isso cria as tabelas no arquivo .db se elas não existirem
    Base.metadata.create_all(bind=engine)
