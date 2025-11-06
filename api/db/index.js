import { Pool } from '@neondatabase/serverless'; // [CORREÇÃO 1]
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("ERRO: POSTGRES_URL não está configurada.");
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
  query: (text, params) => {
    if (!connectionString) {
      console.error("Tentativa de query sem POSTGRES_URL. A API falhará.");
      throw new Error("POSTGRES_URL não configurada.");
    }
    return pool.query(text, params);
  },
};

export default db;