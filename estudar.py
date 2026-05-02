from app.core.database import SessionLocal
from app.models.models import Flashcard
from app.services.srs_service import SRSService
from datetime import datetime

def modo_estudo():
    db = SessionLocal()
    # Busca cards que já precisam de revisão
    cards = db.query(Flashcard).filter(Flashcard.proxima_revisao <= datetime.utcnow()).all()

    if not cards:
        print("🎉 Nada para revisar hoje! Volte mais tarde.")
        return

    print(f"📚 Você tem {len(cards)} cards para revisar.\n")

    for card in cards:
        print(f"PERGUNTA: {card.pergunta}")
        input("Pressione Enter para ver a resposta...")
        print(f"RESPOSTA: {card.resposta}")
        
        try:
            nota = int(input("Qual sua facilidade com este card? (0-Errei, 5-Muito Fácil): "))
        except ValueError:
            print("Entrada inválida, assumindo nota 0 (Errei).")
            nota = 0
            
        if nota < 0: nota = 0
        if nota > 5: nota = 5
        
        # Chamando o SRSService.calculate_next_review
        proxima_revisao, repeticoes, facilidade, intervalo = SRSService.calculate_next_review(
            qualidade=nota,
            repeticoes=card.repeticoes,
            facilidade=card.facilidade,
            intervalo=card.intervalo
        )

        # Atualizando os campos do 'card' com os novos valores
        card.proxima_revisao = proxima_revisao
        card.repeticoes = repeticoes
        card.facilidade = facilidade
        card.intervalo = intervalo

        # Salvando a alteração no banco
        db.commit()
        print("✅ Revisão registrada com sucesso!\n")

    db.close()
    print("🏁 Modo de estudo finalizado!")

if __name__ == "__main__":
    modo_estudo()
