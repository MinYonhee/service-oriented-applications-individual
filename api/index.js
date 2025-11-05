import express from 'express';
import dotenv from 'dotenv';
import './db/index.js';

import curriculosRoutes from './routes/curriculos.js';
import experienciasRoutes from './routes/experiencias.js';
import formacoesRoutes from './routes/formacoes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/curriculos', curriculosRoutes);
app.use('/experiencias', experienciasRoutes);
app.use('/formacoes', formacoesRoutes);

app.get('/', (req, res) => {
  res.send('API online 🚀');
});

export default app; // <-- ESSA LINHA É OBRIGATÓRIA
