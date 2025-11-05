// api/db/index.js (CORRIGIDO)

import pg from '@neondatabase/serverless'; // Mantenha este pacote, ele corrige o timeout!
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// [MUDANÇA AQUI]
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("ERRO: POSTGRES_URL não está configurada."); // [MUDANÇA AQUI]
}

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = {
  query: (text, params) => {
    if (!connectionString) {
      console.error("Tentativa de query sem POSTGRES_URL. A API falhará."); // [MUDANÇA AQUI]
      throw new Error("POSTGRES_URL não configurada."); // [MUDANÇA AQUI]
    }
    return pool.query(text, params);
  },
};

export default db;