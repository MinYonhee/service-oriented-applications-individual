import express from 'express';
const router = express.Router();
import db from '../db/index.js'; 

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cargo, empresa, data_inicio, data_fim, descricao } = req.body;

    if (!cargo || !empresa || !data_inicio) {
        return res.status(400).send('Campos obrigatórios (cargo, empresa, data_inicio) não fornecidos.');
    }

    try {
        const result = await db.query(
            'UPDATE experiencias SET cargo = $1, empresa = $2, data_inicio = $3, data_fim = $4, descricao = $5 WHERE id = $6 RETURNING *',
            [cargo, empresa, data_inicio, data_fim, descricao, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Experiência não encontrada para atualização.');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /experiencias/:id:", err);
        res.status(500).send('Erro ao atualizar experiência.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM experiencias WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Experiência não encontrada para exclusão.');
        }
        res.status(204).send(); 
    } catch (err) {
        console.error("Erro DELETE /experiencias/:id:", err);
        res.status(500).send('Erro ao deletar experiência.');
    }
});

export default router;

