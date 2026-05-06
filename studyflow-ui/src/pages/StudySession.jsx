import React, { useState, useEffect } from 'react';
import { getCardsParaRevisar, responderCard } from '../api/api';
import Flashcard from '../components/Flashcard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudySession = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    getCardsParaRevisar().then(res => setCards(res.data)).catch(err => console.error("Erro", err));
  }, []);

  const handleResponse = async (nota) => {
    const card = cards[currentIndex];
    
    // Update local results
    if (nota === 5) setSessionResults(p => ({ ...p, easy: p.easy + 1 }));
    else if (nota === 3) setSessionResults(p => ({ ...p, medium: p.medium + 1 }));
    else setSessionResults(p => ({ ...p, hard: p.hard + 1 }));

    try {
      await responderCard(card.id, nota);
      
      let msg = nota === 5 ? 'Excelente!' : nota === 3 ? 'Bom progresso!' : 'Mais revisão necessária.';
      toast.success(msg, { 
        icon: nota === 5 ? '🔥' : nota === 3 ? '✅' : '💪',
        style: { borderRadius: '15px', background: '#334155', color: '#fff' }
      });
      
      setShowAnswer(false);
      setCurrentIndex(prev => prev + 1);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar sua resposta.');
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Tudo em dia!</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md">Você revisou todos os seus cards por enquanto. Volte mais tarde para manter o foco!</p>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform">Voltar ao Dashboard</Link>
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center max-w-2xl mx-auto"
      >
        <div className="glass p-12 rounded-[3rem] w-full border-indigo-100 dark:border-indigo-900/30">
          <h2 className="text-5xl font-black text-gradient mb-8">Sessão Concluída!</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/30">
              <div className="text-3xl font-black text-emerald-600 mb-1">{sessionResults.easy}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-emerald-500/70">Fáceis</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-800/30">
              <div className="text-3xl font-black text-amber-600 mb-1">{sessionResults.medium}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-amber-500/70">Médios</div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-800/30">
              <div className="text-3xl font-black text-rose-600 mb-1">{sessionResults.hard}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-rose-500/70">Difíceis</div>
            </div>
          </div>

          <Link to="/" className="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[1.5rem] font-bold shadow-2xl transition-all hover:scale-105">
            Encerrar Sessão <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center min-h-[90vh] p-6 transition-colors relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob"></div>

        <div className="w-full max-w-3xl flex justify-between items-center mb-8 relative z-10 px-4">
          <Link to="/" className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <ChevronLeft size={20} />
          </Link>
          <div className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
            Card {currentIndex + 1} de {cards.length}
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Barra de Progresso */}
        <div className="w-full max-w-2xl bg-slate-200/50 dark:bg-slate-800/50 h-2 rounded-full mb-12 shadow-inner relative z-10 overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
            ></motion.div>
        </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            <Flashcard card={currentCard} flipped={showAnswer} setFlipped={setShowAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 w-full max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {!showAnswer ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-bold bg-white/40 dark:bg-slate-800/40 px-6 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <AlertCircle size={18} />
                Pense na resposta antes de virar
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <button 
                onClick={() => handleResponse(1)} 
                className="group bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900/30 p-6 rounded-[2rem] transition-all hover:scale-[1.05] hover:border-rose-500"
              >
                <div className="bg-rose-100 dark:bg-rose-900/40 p-3 rounded-2xl w-fit mb-4 text-rose-600 group-hover:scale-110 transition-transform">
                  <XCircle size={24} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 dark:text-white">Difícil</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Revisar amanhã</div>
                </div>
              </button>

              <button 
                onClick={() => handleResponse(3)} 
                className="group bg-white dark:bg-slate-800 border-2 border-amber-100 dark:border-amber-900/30 p-6 rounded-[2rem] transition-all hover:scale-[1.05] hover:border-amber-500"
              >
                <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-2xl w-fit mb-4 text-amber-600 group-hover:scale-110 transition-transform">
                  <AlertCircle size={24} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 dark:text-white">Médio</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Em 3-4 dias</div>
                </div>
              </button>

              <button 
                onClick={() => handleResponse(5)} 
                className="group bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/30 p-6 rounded-[2rem] transition-all hover:scale-[1.05] hover:border-emerald-500 shadow-xl shadow-emerald-500/5"
              >
                <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-2xl w-fit mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 dark:text-white">Fácil</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Em 7+ dias</div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudySession;

