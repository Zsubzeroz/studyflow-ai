import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from 'lucide-react';

const Flashcard = ({ card, flipped, setFlipped }) => {
  return (
    <div className="perspective-1000 w-full max-w-md h-80 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d shadow-xl rounded-2xl hover:shadow-2xl transition-shadow"
      >
        {/* Lado da Frente (Pergunta) */}
        <div className="absolute backface-hidden w-full h-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-8 text-xl font-bold border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-center">
          <BrainCircuit size={32} className="text-indigo-400 mb-6 opacity-50" />
          {card?.pergunta || "Pergunta não carregada"}
          <span className="absolute bottom-6 text-sm font-normal text-slate-400 animate-pulse">Toque para virar</span>
        </div>

        {/* Lado de Trás (Resposta) */}
        <div className="absolute backface-hidden w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex flex-col items-center justify-center p-8 text-lg rotate-y-180 rounded-2xl text-center">
          <h3 className="text-sm uppercase tracking-widest text-indigo-200 mb-4 font-semibold">Resposta</h3>
          <p className="font-bold text-2xl leading-relaxed">{card?.resposta || "Resposta não carregada"}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
