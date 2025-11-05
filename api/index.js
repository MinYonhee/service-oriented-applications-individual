import express from 'express';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import curriculosRoutes from './routes/curriculos.js';
import experienciasRoutes from './routes/experiencias.js';
import formacoesRoutes from './routes/formacoes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API online 🚀');
});

// rotas principais
app.use('/curriculos', curriculosRoutes);
app.use('/experiencias', experienciasRoutes);
app.use('/formacoes', formacoesRoutes);

// 🔥 ESSA É A LINHA QUE FAZ A VERCEL FUNCIONAR:
export const handler = serverless(app);
