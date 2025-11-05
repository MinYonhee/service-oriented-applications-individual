// Usando ES Modules (import)
import pg from 'pg';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente (só em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Padronizando para DATABASE_URL, que é o padrão do Vercel/Neon
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERRO: DATABASE_URL não está configurada.");
  console.error("No .env local ou nas Environment Variables do Vercel,");
  console.error("adicione sua string de conexão do PostgreSQL (ex: Neon).");
}

// Configura o pool.
// O SSL é necessário para conexões remotas como Neon/Vercel Postgres.
const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// NÃO precisamos de .connect() aqui. O Pool faz isso sob demanda.

// Exportamos um objeto com o método query
const db = {
  query: (text, params) => {
    if (!connectionString) {
      console.error("Tentativa de query sem DATABASE_URL. A API falhará.");
      throw new Error("DATABASE_URL não configurada.");
    }
    return pool.query(text, params);
  },
};

// Exportação padrão do ESM
export default db;