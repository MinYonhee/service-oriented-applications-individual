import express from 'express';
const router = express.Router();
import db from '../db/index.js';

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { curso, instituicao, data_conclusao, tipo } = req.body;

    if (!curso || !instituicao || !data_conclusao) {
         return res.status(400).send('Campos obrigatórios (curso, instituicao, data_conclusao) não fornecidos.');
    }

    try {
        const result = await db.query(
            'UPDATE formacoes SET curso = $1, instituicao = $2, data_conclusao = $3, tipo = $4 WHERE id = $5 RETURNING *',
            [curso, instituicao, data_conclusao, tipo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Formação não encontrada para atualização.');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /formacoes/:id:", err);
        res.status(500).send('Erro ao atualizar formação.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM formacoes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Formação não encontrada para exclusão.');
        }
        res.status(204).send(); 
    } catch (err) {
        console.error("Erro DELETE /formacoes/:id:", err);
        res.status(500).send('Erro ao deletar formação.');
    }
});

export default router;

