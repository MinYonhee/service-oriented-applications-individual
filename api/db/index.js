// api/db/index.js
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error("POSTGRES_URL não configurada");

// 🔹 Cria cliente global (evita recriar em cada request)
const sql = globalThis._neonSql ?? neon(connectionString);

if (!globalThis._neonSql) {
  globalThis._neonSql = sql;
  console.log("✅ Conexão Neon (serverless) inicializada");
}

// 🔹 Exporta função compatível com req.db.query
export default {
  query: async (text, params) => {
    try {
      const result = await sql(text, params);
      return { rows: result };
    } catch (err) {
      console.error("Erro na query:", err.message);
      throw err;
    }
  },
};
