import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("ATENÇÃO: A variável DATABASE_URL não está configurada no .env.");
    console.error("Use a URL de conexão do Neon (ou outro PG) para a API funcionar.");
}

const db = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false 
    }
});

db.connect()
    .then(() => console.log('Conexão com PostgreSQL (Neon) estabelecida com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao PostgreSQL. Verifique sua DATABASE_URL no .env:', err.message));

export default db;

