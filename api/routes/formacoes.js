import express from 'express';
const router = express.Router();

// ==========================================================
// ATUALIZAR (UPDATE) - PUT /formacoes/:id
// ==========================================================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { curso, instituicao, data_conclusao, tipo } = req.body;

    // Validação
    if (!curso || !instituicao || !data_conclusao) {
        return res.status(400).json({ error: 'Campos obrigatórios (curso, instituicao, data_conclusao) não fornecidos.' });
    }

    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query(
            'UPDATE formacoes SET curso = $1, instituicao = $2, data_conclusao = $3, tipo = $4 WHERE id = $5 RETURNING *',
            [curso, instituicao, data_conclusao, tipo, id]
        );

        // Verifica se algo foi atualizado
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Formação não encontrada.' });
        }
        
        // Sucesso
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /formacoes/:id:", err);
        res.status(500).json({ error: 'Erro ao atualizar formação.' });
    }
});

// ==========================================================
// DELETAR (DELETE) - DELETE /formacoes/:id
// ==========================================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query('DELETE FROM formacoes WHERE id = $1 RETURNING *', [id]);
        
        // Verifica se algo foi deletado
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Formação não encontrada.' });
        }

        // Sucesso (204 - No Content é a melhor resposta para DELETE)
        res.status(204).send(); 
    } catch (err) {
        console.error("Erro DELETE /formacoes/:id:", err);
        res.status(500).json({ error: 'Erro ao deletar formação.' });
    }
});

export default router;