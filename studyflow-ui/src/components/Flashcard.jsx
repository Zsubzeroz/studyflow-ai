import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from 'lucide-react';

const Flashcard = ({ card, flipped, setFlipped }) => {
  return (
    <div className="perspective-1000 w-full max-w-3xl h-[32rem] cursor-pointer group" onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d shadow-xl rounded-3xl group-hover:shadow-indigo-500/30 transition-all duration-300"
      >
        {/* Lado da Frente (Pergunta) */}
        <div className="absolute backface-hidden w-full h-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-12 text-3xl font-bold border border-slate-100 dark:border-slate-700 rounded-3xl text-slate-800 dark:text-slate-100 text-center">
          <BrainCircuit size={48} className="text-indigo-500 mb-8 opacity-50" />
          <p className="leading-snug">{card?.pergunta || "Pergunta não carregada"}</p>
          <span className="absolute bottom-8 text-base font-medium text-slate-400 dark:text-slate-500 animate-pulse bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-full">Clique para revelar a resposta</span>
        </div>

        {/* Lado de Trás (Resposta e Vídeo) */}
        <div className="absolute backface-hidden w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex flex-col items-center p-8 rotate-y-180 rounded-3xl text-center overflow-y-auto overflow-x-hidden scrollbar-hide">
          {card?.video_url ? (
            <div className="w-full h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-indigo-500/30 shrink-0 relative z-50" onClick={(e) => e.stopPropagation()}>
              <iframe className="w-full h-full" src={card.video_url} title="Video Explicativo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          ) : (
             <div className="mt-8 mb-4 opacity-50"><BrainCircuit size={48} /></div>
          )}
          <h3 className="text-sm uppercase tracking-widest text-indigo-300 mb-4 font-bold shrink-0">Resposta Oficial</h3>
          <p className="font-semibold text-2xl leading-relaxed max-w-2xl">{card?.resposta || "Resposta não carregada"}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
