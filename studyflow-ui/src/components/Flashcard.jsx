import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Info } from 'lucide-react';

const Flashcard = ({ card, flipped, setFlipped }) => {
  return (
    <div className="perspective-1000 w-full max-w-3xl h-[32rem] cursor-pointer group" onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 15 }}
        className="relative w-full h-full preserve-3d shadow-2xl rounded-[2.5rem] transition-shadow duration-500 group-hover:shadow-indigo-500/20"
      >
        {/* Lado da Frente (Pergunta) */}
        <div className="absolute backface-hidden w-full h-full glass border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center justify-center p-12 rounded-[2.5rem] text-slate-800 dark:text-slate-100 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-3xl mb-10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <BrainCircuit size={48} />
          </div>
          <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-bold mb-6">Desafio de Hoje</h2>
          <p className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">{card?.pergunta || "Pergunta não carregada"}</p>
          
          <div className="absolute bottom-10 flex flex-col items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-500/60 dark:text-indigo-400/40 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-800/30">
              Clique para revelar
            </span>
          </div>
        </div>

        {/* Lado de Trás (Resposta e Vídeo) */}
        <div className="absolute backface-hidden w-full h-full bg-slate-900 text-white flex flex-col items-center p-8 rotate-y-180 rounded-[2.5rem] text-center overflow-hidden border border-white/10 shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 to-slate-950/90 -z-10"></div>
           
           <div className="w-full flex flex-col items-center gap-6 overflow-y-auto pr-2 scrollbar-hide py-4">
              {card?.video_url && (
                <div className="w-full flex flex-col items-center shrink-0">
                  <a 
                    href={`https://www.youtube.com/results?search_query=${new URL(card.video_url).searchParams.get('list')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full group/video bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] p-6 transition-all duration-300 flex flex-col items-center gap-4 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="relative w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 group-hover/video:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1.5"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <h4 className="text-base font-black text-white mb-1">Assistir Aula Complementar</h4>
                      <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold opacity-80">Abrir busca no YouTube ↗</p>
                    </div>
                  </a>
                </div>
              )}

              <div className="flex flex-col items-center w-full">
                <div className="flex items-center gap-2 mb-4 opacity-50">
                  <Info size={14} className="text-indigo-400" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-black">Resposta Analítica</h3>
                </div>
                <p className="font-semibold text-2xl sm:text-3xl leading-relaxed text-slate-100 px-4 mb-4">
                  {card?.resposta || "Resposta não carregada"}
                </p>
              </div>
           </div>
           
           <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;

