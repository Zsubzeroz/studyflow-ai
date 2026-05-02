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
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-blue-600">StudyFlow AI</h1>
        <p className="text-gray-600">Seu tutor inteligente com repetição espaçada.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Status */}
        <Link to="/estudar" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4 text-blue-500">
            <BookOpen size={24} />
            <span className="font-semibold">Cards para hoje</span>
          </div>
          <div className="text-3xl font-bold">{cardsCount}</div>
        </Link>

        {/* Botão de Upload */}
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : (
            <>
              <Upload size={32} />
              <span className="font-bold text-lg">Enviar PDF</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" />
        </label>

        {/* Link para Simulado */}
        <Link to="/simulado" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-2 text-gray-700">
            <BrainCircuit size={32} className="text-purple-500" />
            <span className="font-bold text-lg">Simulado ENEM</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
