import React, { useState, useEffect } from 'react';
import { getSimulado } from '../api/api';
import { Timer, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const Simulado = () => {
  const [questao, setQuestao] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [tempo, setTempo] = useState(180); // 3 minutos por questão (padrão ENEM)

  useEffect(() => {
    carregarNovaQuestao();
  }, []);

  // Cronômetro
  useEffect(() => {
    if (tempo > 0 && !confirmado) {
      const timer = setInterval(() => setTempo(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [tempo, confirmado]);

  const carregarNovaQuestao = async () => {
    try {
        const res = await getSimulado();
        setQuestao(res.data);
    } catch (e) {
        console.error("Erro ao carregar simulado", e);
    }
    setSelecionada(null);
    setConfirmado(false);
    setTempo(180);
  };

  const formatarTempo = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!questao) return <div className="p-8 text-center mt-20 font-bold text-gray-600 dark:text-gray-300">Carregando questão...</div>;

  return (
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 dark:text-white p-4 md:p-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header do Simulado */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-blue-500">Simulado ENEM</h2>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
            <Timer size={20} className={tempo < 30 ? "text-red-500 animate-pulse" : "text-gray-500"} />
            <span className="font-mono font-bold">{formatarTempo(tempo)}</span>
          </div>
        </div>

        {/* Questão */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{questao.enunciado}</p>
          <h3 className="text-lg font-bold mb-6">{questao.comando}</h3>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd', 'e'].map((letra) => (
              <button
                key={letra}
                disabled={confirmado}
                onClick={() => setSelecionada(letra)}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all flex justify-between items-center
                  ${selecionada === letra ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-100 dark:border-gray-700 hover:border-blue-200"}
                  ${confirmado && letra === questao.resposta_correta ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
                  ${confirmado && selecionada === letra && letra !== questao.resposta_correta ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
                `}
              >
                <span>{letra.toUpperCase()}. {questao.alternativas ? questao.alternativas[letra] : questao[`alternativa_${letra}`]}</span>
                {confirmado && letra === questao.resposta_correta && <CheckCircle className="text-green-500" />}
                {confirmado && selecionada === letra && letra !== questao.resposta_correta && <XCircle className="text-red-500" />}
              </button>
            ))}
          </div>

          {confirmado && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <p className="font-bold text-blue-500 mb-2">Explicação:</p>
              <p className="text-gray-600 dark:text-gray-300">{questao.explicacao}</p>
            </div>
          )}

          {!confirmado ? (
            <button
              onClick={() => setConfirmado(true)}
              disabled={!selecionada}
              className="w-full mt-8 bg-blue-600 disabled:bg-gray-300 p-4 rounded-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
            >
              Confirmar Resposta
            </button>
          ) : (
            <button
              onClick={carregarNovaQuestao}
              className="w-full mt-8 bg-gray-800 dark:bg-blue-500 p-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            >
              Próxima Questão <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulado;
