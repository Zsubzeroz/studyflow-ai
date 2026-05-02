import React, { useState } from "react";
import { motion } from "framer-motion";

const Flashcard = ({ card }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-96 h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full preserve-3d shadow-xl rounded-xl"
      >
        {/* Lado da Frente */}
        <div className="absolute backface-hidden w-full h-full bg-white flex items-center justify-center p-6 text-xl font-bold border border-gray-100 rounded-xl">
          {card?.pergunta || "Pergunta não carregada"}
        </div>

        {/* Lado de Trás */}
        <div className="absolute backface-hidden w-full h-full bg-blue-500 text-white flex flex-col items-center justify-center p-6 text-lg rotate-y-180 rounded-xl">
          {card?.resposta || "Resposta não carregada"}
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
