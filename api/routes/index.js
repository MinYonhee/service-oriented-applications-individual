import express from 'express';
import curriculosRoutes from './curriculos.js';
import experienciasRoutes from './experiencias.js';
import formacoesRoutes from './formacoes.js';

const router = express.Router();

router.use('/curriculos', curriculosRoutes);
router.use('/experiencias', experienciasRoutes);
router.use('/formacoes', formacoesRoutes);

export default router;
