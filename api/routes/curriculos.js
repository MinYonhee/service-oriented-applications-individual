import express from "express";
const router = express.Router();

// ==========================================================
// LER (READ) - GET /curriculos (Todos)
// ==========================================================
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM curriculos ORDER BY id');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro GET /curriculos:", err);
        res.status(500).json({ error: 'Erro ao listar currículos.' });
    }
});

// ==========================================================
// LER (READ) - GET /curriculos/:id (Detalhado com filhos)
// ==========================================================
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const curriculoResult = await req.db.query('SELECT * FROM curriculos WHERE id = $1', [id]);
        if (curriculoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Currículo não encontrado.' });
        }

        const curriculo = curriculoResult.rows[0];

        // Anexa as experiências
        const experienciasResult = await req.db.query(
            'SELECT * FROM experiencias WHERE curriculo_id = $1 ORDER BY data_inicio DESC',
            [id]
        );
        curriculo.experiencias = experienciasResult.rows;

        // Anexa as formações
        const formacoesResult = await req.db.query(
            'SELECT * FROM formacoes WHERE curriculo_id = $1 ORDER BY data_conclusao DESC',
            [id]
        );
        curriculo.formacoes = formacoesResult.rows;

        res.status(200).json(curriculo);
    } catch (err) {
        console.error("Erro GET /curriculos/:id:", err);
        res.status(500).json({ error: 'Erro ao buscar currículo detalhado.' });
    }
});

// ==========================================================
// CRIAR (CREATE) - POST /curriculos
// ==========================================================
router.post('/', async (req, res) => {
    const { nome, email, telefone, resumo_profissional } = req.body;
    
    if (!nome || !email) {
        return res.status(400).json({ error: "Campos obrigatórios (nome, email) não fornecidos." });
    }

    try {
        const result = await req.db.query(
            'INSERT INTO curriculos (nome, email, telefone, resumo_profissional) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, email, telefone, resumo_profissional]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro POST /curriculos:", err);
        if (err.code === '23505') { // Unique violation (email)
            return res.status(409).json({ error: 'Erro: Este email já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro ao criar currículo.' });
    }
});

// ==========================================================
// ATUALIZAR (UPDATE) - PUT /curriculos/:id
// ==========================================================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, resumo_profissional } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: "Campos obrigatórios (nome, email) não fornecidos." });
    }

    try {
        const result = await req.db.query(
            'UPDATE curriculos SET nome = $1, email = $2, telefone = $3, resumo_profissional = $4, data_atualizacao = NOW() WHERE id = $5 RETURNING *',
            [nome, email, telefone, resumo_profissional, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Currículo não encontrado para atualização.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /curriculos/:id:", err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Erro: Este email já está cadastrado em outro currículo.' });
        }
        res.status(500).json({ error: 'Erro ao atualizar currículo.' });
    }
});

// ==========================================================
// DELETAR (DELETE) - DELETE /curriculos/:id
// ==========================================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // O "ON DELETE CASCADE" no database.sql cuida de apagar filhos
        const result = await req.db.query('DELETE FROM curriculos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Currículo não encontrado para exclusão.' });
        }
        // Retorna 200 com o objeto deletado
        res.status(200).json({ message: 'Currículo deletado com sucesso.', deleted: result.rows[0] }); 
    } catch (err) {
        console.error("Erro DELETE /curriculos/:id:", err);
        res.status(500).json({ error: 'Erro ao deletar currículo.' });
    }
});

export default router;