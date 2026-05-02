# 1. Usar uma imagem leve do Python
FROM python:3.11-slim

# 2. Definir o diretório de trabalho dentro do container
WORKDIR /app

# 3. Instalar dependências do sistema necessárias para o PyMuPDF (fitz)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copiar o arquivo de dependências primeiro (otimiza o cache do Docker)
COPY requirements.txt .

# 5. Instalar as bibliotecas do Python
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copiar todo o resto do projeto para dentro do container
COPY . .

# 7. Expor a porta que o FastAPI usa
EXPOSE 8000

# 8. Comando para rodar a aplicação
# Nota: usamos 0.0.0.0 para que o container seja acessível de fora
CMD ["uvicorn", "main_api:app", "--host", "0.0.0.0", "--port", "8000"]
