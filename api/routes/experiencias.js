import express from 'express';
const router = express.Router();

// ==========================================================
// CRIAR (CREATE) - POST /experiencias
// ==========================================================
router.post('/', async (req, res) => {
    // Uma experiência DEVE estar ligada a um currículo
    const { curriculo_id, cargo, empresa, data_inicio, data_fim, descricao } = req.body;

    // Validação
    if (!curriculo_id || !cargo || !empresa || !data_inicio) {
        return res.status(400).json({ error: 'Campos obrigatórios (curriculo_id, cargo, empresa, data_inicio) não fornecidos.' });
    }

    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query(
            'INSERT INTO experiencias (curriculo_id, cargo, empresa, data_inicio, data_fim, descricao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [curriculo_id, cargo, empresa, data_inicio, data_fim, descricao]
        );
        
        // Sucesso (201 - Created)
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Erro comum: 'curriculo_id' não existe (violação de foreign key)
        if (err.code === '23503') { 
            return res.status(404).json({ error: 'Currículo com este ID não encontrado.' });
        }
        console.error("Erro POST /experiencias:", err);
        res.status(500).json({ error: 'Erro ao criar nova experiência.' });
    }
});

// ==========================================================
// LER (READ) - GET /experiencias (Todas)
// ==========================================================
router.get('/', async (req, res) => {
    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query('SELECT * FROM experiencias ORDER BY data_inicio DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro GET /experiencias:", err);
        res.status(500).json({ error: 'Erro ao buscar experiências.' });
    }
});

// ==========================================================
// LER (READ) - GET /experiencias/:id (Uma específica)
// ==========================================================
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query('SELECT * FROM experiencias WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Experiência não encontrada.' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro GET /experiencias/:id:", err);
        res.status(500).json({ error: 'Erro ao buscar experiência.' });
    }
});

// ==========================================================
// (BÔNUS) LER TODAS DE UM CURRÍCULO (Relacionamento)
// GET /experiencias/curriculo/:curriculo_id
// ==========================================================
router.get('/curriculo/:curriculo_id', async (req, res) => {
    const { curriculo_id } = req.params;
    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query('SELECT * FROM experiencias WHERE curriculo_id = $1 ORDER BY data_inicio DESC', [curriculo_id]);
        
        // Não é um erro se não houver experiências, apenas retorna um array vazio
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro GET /experiencias/curriculo/:curriculo_id:", err);
        res.status(500).json({ error: 'Erro ao buscar experiências do currículo.' });
    }
});

// ==========================================================
// ATUALIZAR (UPDATE) - PUT /experiencias/:id
// ==========================================================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cargo, empresa, data_inicio, data_fim, descricao } = req.body;

    if (!cargo || !empresa || !data_inicio) {
        return res.status(400).json({ error: 'Campos obrigatórios (cargo, empresa, data_inicio) não fornecidos.' });
    }

    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query(
            'UPDATE experiencias SET cargo = $1, empresa = $2, data_inicio = $3, data_fim = $4, descricao = $5 WHERE id = $6 RETURNING *',
            [cargo, empresa, data_inicio, data_fim, descricao, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Experiência não encontrada para atualização.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /experiencias/:id:", err);
        res.status(500).json({ error: 'Erro ao atualizar experiência.' });
    }
});

// ==========================================================
// DELETAR (DELETE) - DELETE /experiencias/:id
// ==========================================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // [CORREÇÃO AQUI]
        const result = await req.db.query('DELETE FROM experiencias WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Experiência não encontrada para exclusão.' });
        }
        res.status(204).send(); 
    } catch (err) {
        console.error("Erro DELETE /experiencias/:id:", err);
        res.status(500).json({ error: 'Erro ao deletar experiência.' });
    }
});

export default router;