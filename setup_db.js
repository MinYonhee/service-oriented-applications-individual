// Importações ESM
import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs/promises'; // Usamos a versão de promessas do fs
import path from 'path';
import { fileURLToPath } from 'url';

// Carrega as variáveis de ambiente
dotenv.config();

// --- Obter o caminho do diretório em ESM ---
// __dirname não existe em ESM, então usamos import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------

// Alterado para POSTGRES_URL conforme sua preferência
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    // Corrigido aqui para POSTGRES_URL
    console.error("ATENÇÃO: A variável POSTGRES_URL não está configurada no .env.");
    process.exit(1); // Encerra o script se o BD não estiver configurado
}

// Usamos um pool para o setup
const db = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Função async para rodar o setup
async function setupDatabase() {
    let client;
    try {
        // 1. Conectar ao banco
        client = await db.connect();
        console.log("Conectado ao PostgreSQL (Neon) para setup...");

        // 2. Ler o arquivo database.sql
        // O arquivo SQL deve estar na raiz do projeto
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
            console.error("Verifique se o arquivo 'database.sql' está na raiz do projeto.");
        }
    } finally {
        // 4. Fechar a conexão
        if (client) {
            await client.release(); // Libera o cliente de volta para o pool
            console.log("Conexão de setup com o PostgreSQL fechada.");
        }
        await db.end(); // Fecha o pool
    }
}

// Executa a função
setupDatabase();