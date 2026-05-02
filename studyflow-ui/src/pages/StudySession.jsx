import React, { useState, useEffect } from 'react';
import { getCardsParaRevisar, responderCard } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const StudySession = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    getCardsParaRevisar().then(res => setCards(res.data)).catch(err => console.error("Erro", err));
  }, []);

  const handleResponse = async (nota) => {
    const card = cards[currentIndex];
    await responderCard(card.id, nota);
    
    // Passar para o próximo card com animação
    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
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
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-900 text-white p-4">
        {/* Barra de Progresso */}
        <div className="w-full max-w-md bg-gray-700 h-2 rounded-full mb-8">
            <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
            ></div>
        </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md min-h-[300px] flex flex-col items-center justify-center text-center"
        >
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold">Pergunta</p>
          <h2 className="text-2xl font-medium">{currentCard.pergunta}</h2>

          {showAnswer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-8 border-t w-full">
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-semibold">Resposta</p>
              <p className="text-xl text-blue-600 font-bold">{currentCard.resposta}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex flex-col gap-4 w-full max-w-md">
        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold text-lg transition-all"
          >
            Ver Resposta
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleResponse(1)} className="bg-red-500 hover:bg-red-600 p-3 rounded-lg font-bold transition-colors">Difícil</button>
            <button onClick={() => handleResponse(3)} className="bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg font-bold transition-colors">Médio</button>
            <button onClick={() => handleResponse(5)} className="bg-green-500 hover:bg-green-600 p-3 rounded-lg font-bold transition-colors">Fácil</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
