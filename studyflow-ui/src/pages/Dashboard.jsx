import React, { useState, useEffect } from 'react';
import { uploadPDF, getCardsParaRevisar } from '../api/api';
import { Upload, BookOpen, BrainCircuit, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [cardsCount, setCardsCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ total: 0, new: 0 });

  useEffect(() => {
    getCardsParaRevisar().then(response => {
      setCardsCount(response.data.length);
      setStats(prev => ({ ...prev, total: response.data.length + 15 })); // Mocked additional stat
    }).catch(err => console.error("API offline ou sem cards", err));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    toast.promise(
      uploadPDF(file).then(async () => {
          const updated = await getCardsParaRevisar();
          setCardsCount(updated.data.length);
      }),
      {
        loading: 'O Gemini está processando seu PDF...',
        success: 'Material gerado com sucesso! 🚀',
        error: '❌ Erro ao processar o PDF.',
      }
    ).finally(() => {
      setIsUploading(false);
      event.target.value = null; // reset input
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative z-10"
      >
        <motion.header variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-2">
            <Sparkles size={16} />
            <span>Bem-vindo ao Futuro do Estudo</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Olá, <span className="text-gradient">Estudante</span>! 
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Seu tutor inteligente já preparou os materiais de hoje. O que vamos conquistar agora?
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link to="/estudar" className="glass p-8 rounded-3xl hover:scale-[1.02] transition-transform group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={120} />
              </div>
              <div className="flex flex-col h-full">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-2xl w-fit mb-6 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Revisões Pendentes</h3>
                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-4">{cardsCount}</div>
                <div className="mt-auto flex items-center gap-2 text-indigo-500 font-semibold text-sm">
                  Começar agora <TrendingUp size={16} />
                </div>
              </div>
            </Link>

            <div className="glass p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Calendar size={120} />
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-2xl w-fit mb-6 text-purple-600 dark:text-purple-400">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Total de Flashcards</h3>
              <div className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-4">{stats.total}</div>
              <p className="text-slate-400 text-sm font-medium">Você está progredindo rápido! 🚀</p>
            </div>
          </motion.div>

          {/* Upload Card */}
          <motion.div variants={itemVariants}>
            <label className="cursor-pointer group h-full">
              <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 transition-all duration-500 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload size={24} className="text-white animate-pulse" />
                      </div>
                    </div>
                    <span className="text-white font-bold text-xl">Processando...</span>
                  </div>
                ) : (
                  <>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-white/20 p-6 rounded-full backdrop-blur-md border border-white/30 shadow-xl group-hover:scale-110 transition-transform"
                    >
                      <Upload size={40} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">Importar PDF</h3>
                      <p className="text-indigo-100 text-sm font-medium opacity-80">Transforme seus documentos em flashcards mágicos instantaneamente.</p>
                    </div>
                  </>
                )}
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={isUploading} />
              </div>
            </label>
          </motion.div>
        </div>

        {/* Secondary Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/simulado" className="glass-morphism p-6 rounded-3xl flex items-center gap-6 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors group">
            <div className="bg-fuchsia-100 dark:bg-fuchsia-900/50 p-4 rounded-2xl text-fuchsia-600 dark:text-fuchsia-400 group-hover:rotate-12 transition-transform">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">Simulado ENEM</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Teste seus conhecimentos com questões reais.</p>
            </div>
          </Link>

          <div className="glass-morphism p-6 rounded-3xl flex items-center gap-6 opacity-50 cursor-not-allowed">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-slate-400">
              <TrendingUp size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-400">Desempenho Detalhado</h4>
              <p className="text-slate-400 text-sm">Em breve: Analise sua evolução.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

