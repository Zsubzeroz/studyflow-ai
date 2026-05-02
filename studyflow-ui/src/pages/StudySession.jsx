import React, { useState, useEffect } from 'react';
import { getCardsParaRevisar, responderCard } from '../api/api';
import Flashcard from '../components/Flashcard';
import toast from 'react-hot-toast';

const StudySession = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    getCardsParaRevisar().then(res => setCards(res.data)).catch(err => console.error("Erro", err));
  }, []);

  const handleResponse = async (nota) => {
    const card = cards[currentIndex];
    
    try {
      await responderCard(card.id, nota);
      
      let msg = nota === 5 ? 'Muito bem! 🎉' : nota === 3 ? 'Bom trabalho! 👍' : 'Vamos revisar mais vezes! 💪';
      toast.success(msg, { icon: nota === 5 ? '🧠' : '📚' });
      
      // Passar para o próximo card
      setShowAnswer(false);
      setCurrentIndex(prev => prev + 1);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar sua resposta.');
    }
  };

  if (cards.length === 0) {
     return <div className="p-8 text-center mt-20 font-bold text-gray-600">Carregando cards ou nada para revisar hoje...</div>;
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-3xl font-bold text-green-600">🎉 Sessão Concluída!</h2>
        <a href="/" className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">Voltar ao início</a>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 transition-colors relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

        {/* Barra de Progresso */}
        <div className="w-full max-w-3xl bg-slate-200 dark:bg-slate-700 h-3 rounded-full mb-12 shadow-inner relative z-10">
            <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700 shadow-md" 
                style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
            ></div>
        </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <Flashcard card={currentCard} flipped={showAnswer} setFlipped={setShowAnswer} />
      </div>

      <div className="mt-12 flex flex-col gap-4 w-full max-w-3xl relative z-10 min-h-[100px]">
        {!showAnswer ? (
            <p className="text-center text-slate-500 font-medium animate-pulse text-lg">Leia atentamente e lembre-se da resposta antes de virar o card!</p>
        ) : (
          <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <button onClick={() => handleResponse(1)} className="bg-rose-500 hover:bg-rose-600 text-white p-5 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/30">Difícil</button>
            <button onClick={() => handleResponse(3)} className="bg-amber-500 hover:bg-amber-600 text-white p-5 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/30">Médio</button>
            <button onClick={() => handleResponse(5)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30">Fácil</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
