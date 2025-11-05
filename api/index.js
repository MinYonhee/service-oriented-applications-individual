import express from 'express';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import './db/index.js';

import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

// rotas centralizadas
app.use('/', routes);

app.get('/', (req, res) => {
  res.send('API online 🚀');
});

export default serverless(app);
