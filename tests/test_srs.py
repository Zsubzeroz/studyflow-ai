from app.services.srs_service import SRSService
from datetime import datetime

def test_srs_acerto():
    agora = datetime.utcnow()
    # Simulando um acerto em um card novo
    proxima, reps, facilidade, intervalo = SRSService.calculate_next_review(
        qualidade=5, repeticoes=0, facilidade=2.5, intervalo=0
    )
    assert proxima > agora
    assert reps == 1
    assert intervalo == 1
    assert facilidade > 2.5 # O fator de facilidade deve aumentar com a nota 5

def test_srs_erro():
    agora = datetime.utcnow()
    # Simulando um erro grave em um card que já tinha repetições
    proxima, reps, facilidade, intervalo = SRSService.calculate_next_review(
        qualidade=0, repeticoes=3, facilidade=2.5, intervalo=10
    )
    assert reps == 0 # Repetições zeram
    assert intervalo == 1 # Volta pro início
    assert facilidade < 2.5 # Fator de facilidade deve cair
