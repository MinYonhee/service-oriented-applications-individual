import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("ATENÇÃO: A variável DATABASE_URL não está configurada no .env.");
    process.exit(1); 
}

const db = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    let client;
    try {
        client = await db.connect();
        console.log("Conectado ao PostgreSQL (Neon) para setup...");

        const sqlFilePath = path.join(__dirname, 'database.sql');
        const sqlScript = await fs.readFile(sqlFilePath, 'utf8');

        if (!sqlScript) {
            throw new Error("Não foi possível ler o arquivo database.sql ou está vazio.");
        }
        
        console.log("Arquivo database.sql lido. Executando script...");

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
        if (client) {
            await client.release(); 
            console.log("Conexão de setup com o PostgreSQL fechada.");
        }
        await db.end(); 
    }
}

setupDatabase();

