import express from "express";
const router = express.Router();

// REMOVA: import db from '../db/index.js';
// USE: req.db (injetado no index.js)

router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM curriculos ORDER BY id');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro GET /curriculos:", err);
        res.status(500).send('Erro ao listar currículos.');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const curriculoResult = await req.db.query('SELECT * FROM curriculos WHERE id = $1', [id]);
        if (curriculoResult.rows.length === 0) {
            return res.status(404).send('Currículo não encontrado.');
        }

        const curriculo = curriculoResult.rows[0];

        const experienciasResult = await req.db.query(
            'SELECT * FROM experiencias WHERE curriculo_id = $1 ORDER BY data_inicio DESC',
            [id]
        );
        curriculo.experiencias = experienciasResult.rows;

        const formacoesResult = await req.db.query(
            'SELECT * FROM formacoes WHERE curriculo_id = $1 ORDER BY data_conclusao DESC',
            [id]
        );
        curriculo.formacoes = formacoesResult.rows;

        res.status(200).json(curriculo);
    } catch (err) {
        console.error("Erro GET /curriculos/:id:", err);
        res.status(500).send('Erro ao buscar currículo detalhado.');
    }
});

router.post('/', async (req, res) => {
    const { nome, email, telefone, resumo_profissional } = req.body;
    try {
        const result = await req.db.query(
            'INSERT INTO curriculos (nome, email, telefone, resumo_profissional) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, email, telefone, resumo_profissional]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro POST /curriculos:", err);
        if (err.code === '23505') {
            return res.status(409).send('Erro: Este email já está cadastrado.');
        }
        res.status(500).send('Erro ao criar currículo.');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, resumo_profissional } = req.body;
    try {
        const result = await req.db.query(
            'UPDATE curriculos SET nome = $1, email = $2, telefone = $3, resumo_profissional = $4, data_atualizacao = NOW() WHERE id = $5 RETURNING *',
            [nome, email, telefone, resumo_profissional, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Currículo não encontrado para atualização.');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erro PUT /curriculos/:id:", err);
        if (err.code === '23505') {
            return res.status(409).send('Erro: Este email já está cadastrado em outro currículo.');
        }
        res.status(500).send('Erro ao atualizar currículo.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await req.db.query('DELETE FROM curriculos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Currículo não encontrado para exclusão.');
        }
        res.status(204).send();
    } catch (err) {
        console.error("Erro DELETE /curriculos/:id:", err);
        res.status(500).send('Erro ao deletar currículo.');
    }
});

router.post('/:curriculo_id/experiencias', async (req, res) => {
    const { curriculo_id } = req.params;
    const { cargo, empresa, data_inicio, data_fim, descricao } = req.body;

    if (!cargo || !empresa || !data_inicio) {
        return res.status(400).send('Campos obrigatórios (cargo, empresa, data_inicio) não fornecidos.');
    }

    try {
        const curriculoCheck = await req.db.query('SELECT id FROM curriculos WHERE id = $1', [curriculo_id]);
        if (curriculoCheck.rows.length === 0) {
            return res.status(404).send('Currículo (pai) não encontrado.');
        }

        const result = await req.db.query(
            'INSERT INTO experiencias (curriculo_id, cargo, empresa, data_inicio, data_fim, descricao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [curriculo_id, cargo, empresa, data_inicio, data_fim, descricao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro POST /curriculos/:curriculo_id/experiencias:", err);
        res.status(500).send('Erro ao adicionar experiência.');
    }
});

router.post('/:curriculo_id/formacoes', async (req, res) => {
    const { curriculo_id } = req.params;
    const { curso, instituicao, data_conclusao, tipo } = req.body;

    if (!curso || !instituicao || !data_conclusao) {
        return res.status(400).send('Campos obrigatórios (curso, instituicao, data_conclusao) não fornecidos.');
    }

    try {
        const curriculoCheck = await req.db.query('SELECT id FROM curriculos WHERE id = $1', [curriculo_id]);
        if (curriculoCheck.rows.length === 0) {
            return res.status(404).send('Currículo (pai) não encontrado.');
        }

        const result = await req.db.query(
            'INSERT INTO formacoes (curriculo_id, curso, instituicao, data_conclusao, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [curriculo_id, curso, instituicao, data_conclusao, tipo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro POST /curriculos/:curriculo_id/formacoes:", err);
        res.status(500).send('Erro ao adicionar formação.');
    }
});

export default router;