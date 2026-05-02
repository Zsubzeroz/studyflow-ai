from datetime import datetime, timedelta

class SRSService:
    @staticmethod
    def calculate_next_review(qualidade: int, repeticoes: int, facilidade: float, intervalo: int):
        """
        Algoritmo SM-2 Simplificado
        qualidade: 0 (errei tudo) a 5 (lembrei perfeitamente)
        """
        if qualidade >= 3:  # Acerto
            if repeticoes == 0:
                novo_intervalo = 1
            elif repeticoes == 1:
                novo_intervalo = 6
            else:
                novo_intervalo = round(intervalo * facilidade)
            
            novas_repeticoes = repeticoes + 1
        else:  # Erro
            novo_intervalo = 1
            novas_repeticoes = 0

        # Ajusta o fator de facilidade (fórmula do SM-2)
        nova_facilidade = facilidade + (0.1 - (5 - qualidade) * (0.08 + (5 - qualidade) * 0.02))
        if nova_facilidade < 1.3:
            nova_facilidade = 1.3

        proxima_revisao = datetime.utcnow() + timedelta(days=novo_intervalo)
        
        return proxima_revisao, novas_repeticoes, nova_facilidade, novo_intervalo
