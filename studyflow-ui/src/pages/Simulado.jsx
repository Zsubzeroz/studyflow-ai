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
    <div className="min-h-[90vh] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 md:p-8 transition-colors relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header do Simulado */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Simulado ENEM
          </h2>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/20 dark:border-slate-700">
            <Timer size={22} className={tempo < 30 ? "text-rose-500 animate-pulse" : "text-indigo-500 dark:text-indigo-400"} />
            <span className={`font-mono font-bold text-lg ${tempo < 30 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
              {formatarTempo(tempo)}
            </span>
          </div>
        </div>

        {/* Questão */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-lg">{questao.enunciado}</p>
          <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white">{questao.comando}</h3>

          <div className="space-y-4">
            {['a', 'b', 'c', 'd', 'e'].map((letra) => (
              <button
                key={letra}
                disabled={confirmado}
                onClick={() => setSelecionada(letra)}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all duration-300 flex justify-between items-center group hover:shadow-md
                  ${selecionada === letra ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"}
                  ${confirmado && letra === questao.resposta_correta ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500/20" : ""}
                  ${confirmado && selecionada === letra && letra !== questao.resposta_correta ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 ring-2 ring-rose-500/20" : ""}
                `}
              >
                <span className="text-lg flex gap-3">
                  <strong className="uppercase text-slate-400 dark:text-slate-500 group-hover:text-indigo-500">{letra}.</strong> 
                  <span className="text-slate-700 dark:text-slate-200">{questao.alternativas ? questao.alternativas[letra] : questao[`alternativa_${letra}`]}</span>
                </span>
                {confirmado && letra === questao.resposta_correta && <CheckCircle className="text-emerald-500 shrink-0" size={28}/>}
                {confirmado && selecionada === letra && letra !== questao.resposta_correta && <XCircle className="text-rose-500 shrink-0" size={28}/>}
              </button>
            ))}
          </div>

          {confirmado && (
            <div className={`mt-8 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 border ${selecionada === questao.resposta_correta ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/30'}`}>
              <div className="flex items-center gap-2 mb-3">
                {selecionada === questao.resposta_correta ? <CheckCircle className="text-emerald-500"/> : <BrainCircuit className="text-indigo-500"/>}
                <p className={`font-bold text-lg ${selecionada === questao.resposta_correta ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                  {selecionada === questao.resposta_correta ? "Exato! Entenda o porquê:" : "Explicação:"}
                </p>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{questao.explicacao}</p>
            </div>
          )}

          {!confirmado ? (
            <button
              onClick={() => setConfirmado(true)}
              disabled={!selecionada}
              className="w-full mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed p-5 rounded-2xl font-bold text-white shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95 text-lg"
            >
              Confirmar Resposta
            </button>
          ) : (
            <button
              onClick={carregarNovaQuestao}
              className="w-full mt-10 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95 text-lg"
            >
              Próxima Questão <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulado;
