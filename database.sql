DROP TABLE IF EXISTS formacoes;
DROP TABLE IF EXISTS experiencias;
DROP TABLE IF EXISTS curriculos;

-- ==========================================================
-- ENTIDADE PRINCIPAL: CURRICULOS
-- ==========================================================
CREATE TABLE curriculos (
    id SERIAL PRIMARY KEY, -- SERIAL é o auto-incremento no PostgreSQL
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, -- UNIQUE garante que não haja emails duplicados
    telefone VARCHAR(20),
    resumo_profissional TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- ENTIDADE RELACIONADA: EXPERIENCIAS (1:N)
-- ==========================================================
CREATE TABLE experiencias (
    id SERIAL PRIMARY KEY,
    curriculo_id INTEGER NOT NULL, -- Chave estrangeira
    cargo VARCHAR(100) NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE, -- Pode ser NULO (se for o emprego atual)
    descricao TEXT,
    
    -- Definição da Foreign Key
    -- ON DELETE CASCADE garante que se o currículo (pai) for deletado,
    -- todas as suas experiências (filhos) também serão.
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE
);

-- ==========================================================
-- ENTIDADE RELACIONADA: FORMACOES (1:N)
-- ==========================================================
CREATE TABLE formacoes (
    id SERIAL PRIMARY KEY,
    curriculo_id INTEGER NOT NULL, -- Chave estrangeira
    curso VARCHAR(100) NOT NULL,
    instituicao VARCHAR(100) NOT NULL,
    data_conclusao DATE NOT NULL,
    tipo VARCHAR(50), -- Ex: Graduação, Pós-graduação, Curso Técnico
    
    -- Definição da Foreign Key
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE
);


-- ==========================================================
-- OBS 1: INSERÇÃO DOS DADOS DE DUAS PESSOAS
-- ==========================================================

-- --- PESSOA 1: ALICE SILVA ---
INSERT INTO curriculos (nome, email, telefone, resumo_profissional)
VALUES (
    'Alice Silva', 
    'alice.silva@email.com', 
    '(11) 98765-4321', 
    'Desenvolvedora Full-Stack com 3 anos de experiência em React, Node.js e PostgreSQL. Apaixonada por criar soluções escaláveis e interfaces de usuário intuitivas.'
);

-- Experiências de Alice (ID do currículo = 1)
INSERT INTO experiencias (curriculo_id, cargo, empresa, data_inicio, data_fim, descricao)
VALUES 
(1, 'Desenvolvedora Full-Stack', 'Tech Solutions S.A.', '2022-01-15', NULL, 'Desenvolvimento e manutenção de aplicações web utilizando React e Node.js. Liderança técnica em projetos de migração de API.'),
(1, 'Desenvolvedora Júnior', 'Web Innovate', '2021-03-01', '2022-01-10', 'Criação de componentes UI com React e consumo de APIs REST.');

-- Formações de Alice (ID do currículo = 1)
INSERT INTO formacoes (curriculo_id, curso, instituicao, data_conclusao, tipo)
VALUES
(1, 'Sistemas de Informação', 'Universidade XYZ', '2020-12-15', 'Graduação');


-- --- PESSOA 2: BERNARDO COSTA ---
INSERT INTO curriculos (nome, email, telefone, resumo_profissional)
VALUES (
    'Bernardo Costa', 
    'b.costa@email.com', 
    '(21) 91234-5678', 
    'Gerente de Projetos com certificação PMP e 5 anos de experiência em metodologias ágeis (Scrum/Kanban). Foco em entrega de valor e gestão de times multidisciplinares.'
);

-- Experiências de Bernardo (ID do currículo = 2)
INSERT INTO experiencias (curriculo_id, cargo, empresa, data_inicio, data_fim, descricao)
VALUES 
(2, 'Gerente de Projetos Sênior', 'Agile Corp', '2023-05-20', NULL, 'Gestão de 3 squads de desenvolvimento, garantindo o cumprimento de prazos e o alinhamento com stakeholders.'),
(2, 'Scrum Master', 'Data Driven Ltda', '2020-11-10', '2023-05-15', 'Implementação da metodologia Scrum na empresa, facilitando cerimônias ágeis e removendo impedimentos.');

-- Formações de Bernardo (ID do currículo = 2)
INSERT INTO formacoes (curriculo_id, curso, instituicao, data_conclusao, tipo)
VALUES
(2, 'Certificação PMP', 'PMI', '2022-07-30', 'Certificação'),
(2, 'Administração de Empresas', 'Universidade ABC', '2019-06-20', 'Graduação');

