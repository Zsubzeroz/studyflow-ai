# StudyFlow AI 🧠📚

O **StudyFlow AI** é uma plataforma inteligente de aprendizado que transforma documentos e materiais de estudo (como PDFs) em flashcards e questões automaticamente utilizando Inteligência Artificial. Ele não é apenas um gerador de conteúdo, mas sim um sistema completo de retenção de conhecimento baseado em repetição espaçada.

## Tecnologias Utilizadas 🚀

### Backend & Inteligência Artificial
- **Python** e **FastAPI**: Framework web moderno, de alta performance e com documentação automática.
- **SQLAlchemy**: ORM utilizado para persistência de dados em banco SQLite.
- **Google Gemini API**: Motor de inteligência artificial para extração e processamento lógico dos conteúdos.
- **Docker**: Containerização completa da infraestrutura.

### Frontend
- **React.js (Vite)**: Construção da Single Page Application (SPA).
- **Tailwind CSS**: Estilização padronizada, moderna e suporte ao Dark Mode.
- **Framer Motion**: Biblioteca de física e animações utilizada para os efeitos 3D de repetição espaçada.
## Arquitetura 🏗️
O projeto foi desenvolvido seguindo os princípios da **Clean Architecture**, o que garante a manutenibilidade, testabilidade e escalabilidade:
- **Decoupling (Desacoplamento)**: Separação clara entre a lógica de extração de texto, inteligência artificial e rotas da API, com camadas definidas (`models/`, `services/`, `schemas/`, `utils/`).
- **Scalability (Escalabilidade)**: Utilização do SQLAlchemy, permitindo trocar o banco de dados atual (SQLite) por um SGBD robusto como PostgreSQL facilmente, à medida que a base de usuários crescer.
- `main_api.py`: Ponto de entrada web (Application Programming Interface).

## Diferenciais de Engenharia 🌟
- **Algoritmo SM-2 (Spaced Repetition System)**: O coração do modo de estudos. O app calcula o momento ideal para o usuário revisar um flashcard com base no seu nível de dificuldade no momento da resposta, maximizando a retenção na memória e poupando tempo de estudo diário.
- **Data Integrity (Integridade de Dados)**: Implementação de validação de tipos rigorosa com **Pydantic** e o uso forçado de Response MIME Types (`application/json`) na comunicação com a API do Gemini. Isso garante que o banco de dados nunca receba dados corrompidos ou mal formatados.

## Como Rodar o Projeto ⚙️

### Backend (Docker - Recomendado)
1. Clone o repositório e crie o arquivo `.env` na raiz contendo sua chave:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```
2. Suba o container da API usando o Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. A API e o Swagger UI estarão rodando em `http://localhost:8000`.

### Frontend (React)
1. Em outro terminal, acesse a pasta da interface:
   ```bash
   cd studyflow-ui
   ```
2. Instale as dependências e inicie o ambiente de desenvolvimento:
   ```bash
   npm install
   npm run dev
   ```
3. Acesse a aplicação completa no seu navegador: 👉 [http://localhost:5173](http://localhost:5173)
