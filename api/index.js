import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './db/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

import curriculosRoutes from './routes/curriculos.js';
import experienciasRoutes from './routes/experiencias.js';
import formacoesRoutes from './routes/formacoes.js';

app.use('/curriculos', curriculosRoutes);
app.use('/experiencias', experienciasRoutes);
app.use('/formacoes', formacoesRoutes);


app.get('/', (req, res) => {
    res.send('API de Currículos (Refatorada para ESM) está rodando. Use /curriculos para acessar os dados.');
});

app.listen(port, () => {
    console.log(`Servidor Express rodando na porta ${port}`);
});

