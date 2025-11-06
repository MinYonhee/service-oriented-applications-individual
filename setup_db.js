// setup_db.js (Completo e Corrigido)

import { Pool } from '@neondatabase/serverless'; // Pacote correto para Vercel
import dotenv from 'dotenv';
import fs from 'fs/promises'; // Versão de promessas do 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuração de Caminho ESM ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------------------

// [PADRONIZADO] Usando POSTGRES_URL
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("ATENÇÃO: A variável POSTGRES_URL não está configurada no .env.");
    process.exit(1); // Encerra o script
}

const db = new Pool({
    connectionString: connectionString,
    }
);

// Função principal que executa o setup
async function setupDatabase() {
    let client;
    try {
        // 1. Conectar ao banco
        client = await db.connect();
        console.log("Conectado ao PostgreSQL (Neon) para setup...");

        // 2. Ler o arquivo database.sql
        const sqlFilePath = path.join(__dirname, 'database.sql');
        const sqlScript = await fs.readFile(sqlFilePath, 'utf8');

        if (!sqlScript) {
            throw new Error("Não foi possível ler o arquivo database.sql ou está vazio.");
        }
        
        console.log("Arquivo database.sql lido. Executando script...");

        // 3. Executar o script SQL
        await client.query(sqlScript);

        console.log("==================================================");
        console.log("SUCESSO: Banco de dados configurado!");
        console.log("Tabelas criadas e dados iniciais (OBS 1) inseridos.");
        console.log("==================================================");

    } catch (err) {
        console.error("ERRO AO CONFIGURAR O BANCO DE DADOS:", err.message);
        if (err.code === 'ENOENT') {
            console.error("Verifique se o arquivo 'database.sql' está na raiz do projeto (ao lado do package.json).");
        }
    } finally {
        // 4. Fechar a conexão
        if (client) {
            await client.release(); // Libera o cliente de volta para o pool
            console.log("Conexão de setup com o PostgreSQL fechada.");
        }
        // Encerra o pool, já que este é um script de uso único
        await db.end(); 
    }
}

// Executa a função
setupDatabase();