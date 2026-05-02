import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL do seu FastAPI
});

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-pdf', formData);
};

export const getCardsParaRevisar = () => api.get('/cards/revisar');
export const responderCard = (id, nota) => api.post(`/cards/responder/${id}?qualidade=${nota}`);
export const getSimulado = () => api.get('/simulado/random');

export default api;
