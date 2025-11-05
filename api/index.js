import express from 'express';
import dotenv from 'dotenv';
import db from './db/index.js'; // garante a conexão com o banco

// importa as rotas
import curriculosRoutes from './routes/curriculos.js';
import experienciasRoutes from './routes/experiencias.js';
import formacoesRoutes from './routes/formacoes.js';

dotenv.config();

const app = express();
app.use(express.json());

// rotas principais
app.use('/curriculos', curriculosRoutes);
app.use('/experiencias', experienciasRoutes);
app.use('/formacoes', formacoesRoutes);

// rota raiz
app.get('/', (req, res) => {
  res.send('API online 🚀');
});

// exporta o app (Vercel precisa disso)
export default app;
