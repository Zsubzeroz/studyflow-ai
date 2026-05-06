import React, { useState, useEffect } from 'react';
import { getSimulado } from '../api/api';
import { Timer, CheckCircle, XCircle, ChevronRight, BrainCircuit, Info, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Simulado = () => {
  const [questao, setQuestao] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [tempo, setTempo] = useState(180); // 3 minutos por questão (padrão ENEM)

  useEffect(() => {
    carregarNovaQuestao();
  }, []);

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

  if (!questao) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-500 animate-pulse">Preparando questão...</p>
    </div>
  );

  if (questao.error) return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-full mb-8">
          <BrainCircuit size={64} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Sem questões disponíveis</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md">Faça o upload de um material no Dashboard para que a IA gere as questões do ENEM baseadas no seu conteúdo.</p>
        <a href="/" className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-bold shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-transform">Voltar para o Dashboard</a>
      </div>
  );

  return (
    <div className="min-h-[90vh] p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center gap-3 px-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/40">
              <Target size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Simulado ENEM</h2>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
            <Timer size={20} className={tempo < 30 ? "text-rose-500 animate-pulse" : "text-indigo-600 dark:text-indigo-400"} />
            <span className={`font-mono font-black text-xl ${tempo < 30 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
              {formatarTempo(tempo)}
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={questao.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 md:p-12 rounded-[3rem] border-white/30 dark:border-slate-700/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <BrainCircuit size={200} />
            </div>

            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full">
                <Info size={14} /> Contexto da Questão
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-lg font-medium italic">"{questao.enunciado}"</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-8">{questao.comando}</h3>
            </div>

            <div className="space-y-4 mb-12">
              {['a', 'b', 'c', 'd', 'e'].map((letra) => (
                <button
                  key={letra}
                  disabled={confirmado}
                  onClick={() => setSelecionada(letra)}
                  className={`w-full p-6 rounded-[1.5rem] text-left border-2 transition-all duration-300 flex justify-between items-center group relative overflow-hidden
                    ${selecionada === letra 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10" 
                      : "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"}
                    ${confirmado && letra === questao.resposta_correta ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-4 ring-emerald-500/10" : ""}
                    ${confirmado && selecionada === letra && letra !== questao.resposta_correta ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 ring-4 ring-rose-500/10" : ""}
                  `}
                >
                  <span className="text-lg flex gap-4 pr-6">
                    <strong className={`uppercase w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                      ${selecionada === letra ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}
                      ${confirmado && letra === questao.resposta_correta ? "bg-emerald-600 text-white" : ""}
                    `}>{letra}</strong> 
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">{questao.alternativas ? questao.alternativas[letra] : questao[`alternativa_${letra}`]}</span>
                  </span>
                  
                  <div className="shrink-0">
                    {confirmado && letra === questao.resposta_correta && <CheckCircle className="text-emerald-500" size={28}/>}
                    {confirmado && selecionada === letra && letra !== questao.resposta_correta && <XCircle className="text-rose-500" size={28}/>}
                  </div>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {confirmado && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-8 rounded-[2rem] border-2 mb-8 ${selecionada === questao.resposta_correta ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30' : 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30'}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${selecionada === questao.resposta_correta ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}`}>
                      {selecionada === questao.resposta_correta ? <CheckCircle size={20}/> : <Info size={20}/>}
                    </div>
                    <p className={`font-black text-xl ${selecionada === questao.resposta_correta ? 'text-emerald-800 dark:text-emerald-400' : 'text-indigo-800 dark:text-indigo-400'}`}>
                      {selecionada === questao.resposta_correta ? "Excelente! Veja a análise:" : "Análise Pedagógica:"}
                    </p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">{questao.explicacao}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <footer className="flex gap-4">
              {!confirmado ? (
                <button
                  onClick={() => setConfirmado(true)}
                  disabled={!selecionada}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 p-6 rounded-[1.5rem] font-black text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={carregarNovaQuestao}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl shadow-2xl"
                >
                  Próxima Questão <ChevronRight size={24} />
                </button>
              )}
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Simulado;

