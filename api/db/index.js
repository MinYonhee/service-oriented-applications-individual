import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("ERRO: POSTGRES_URL não está configurada.");
}

let pool;

if (!globalThis._pool) {
  globalThis._pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  console.log("✅ Novo pool criado");
}

pool = globalThis._pool;

const db = {
  query: async (text, params) => {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (err) {
      console.error("Erro na query:", err);
      throw err;
    }
  },
};

export default db;
