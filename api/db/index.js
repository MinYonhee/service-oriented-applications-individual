// Em api/db/index.js (CORRIGIDO)
import pg from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERRO: DATABASE_URL não está configurada.");
}

// O Neon SEMPRE precisa de SSL, tanto local quanto em produção.
// A string de conexão já tem "sslmode=require", mas é bom garantir.
const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
  query: (text, params) => {
    if (!connectionString) {
      console.error("Tentativa de query sem DATABASE_URL. A API falhará.");
      throw new Error("DATABASE_URL não configurada.");
    }
    return pool.query(text, params);
  },
};

export default db;