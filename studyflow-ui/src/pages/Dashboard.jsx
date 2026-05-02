import React, { useState, useEffect } from 'react';
import { uploadPDF, getCardsParaRevisar } from '../api/api';
import { Upload, BookOpen, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [cardsCount, setCardsCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Buscar dados do backend ao carregar a página
  useEffect(() => {
    getCardsParaRevisar().then(response => {
      setCardsCount(response.data.length);
    }).catch(err => console.error("API offline ou sem cards", err));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadPDF(file);
      alert("✅ PDF processado! Novos cards gerados.");
      // Atualiza a contagem
      const updated = await getCardsParaRevisar();
      setCardsCount(updated.data.length);
    } catch (error) {
      alert("❌ Erro ao processar PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 transition-colors relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <header className="mb-12 relative z-10 text-center mt-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">StudyFlow AI</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Seu tutor inteligente com repetição espaçada avançada.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto mt-16">
        {/* Card de Status */}
        <Link to="/estudar" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700 hover:-translate-y-2 hover:shadow-indigo-500/20 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <BookOpen size={36} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200 mb-2">Revisões Pendentes</span>
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{cardsCount}</div>
        </Link>

        {/* Botão de Upload */}
        <label className="cursor-pointer bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-indigo-500/40 transition-all duration-300 flex flex-col items-center justify-center gap-4 group">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
          ) : (
            <>
              <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Upload size={36} />
              </div>
              <span className="font-bold text-xl tracking-wide">Importar PDF</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={isUploading} />
        </label>

        {/* Link para Simulado */}
        <Link to="/simulado" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700 hover:-translate-y-2 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 text-slate-700 dark:text-slate-200 group">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <BrainCircuit size={36} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-bold text-xl tracking-wide">Simulado ENEM</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
