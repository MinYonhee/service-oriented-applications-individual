// api/index.js
import "dotenv/config";
import cors from "cors";
import express from "express";
import serverless from "serverless-http";

// === IMPORTA O BANCO (Pool do pg) ===
import db from "./db/index.js";

// === IMPORTA AS ROTAS ===
import curriculosRoutes from "./routes/curriculos.js";
import experienciasRoutes from "./routes/experiencias.js";
import formacoesRoutes from "./routes/formacoes.js";

// === CRIA A APLICAÇÃO EXPRESS ===
const app = express();

// === CONFIGURAÇÕES GLOBAIS ===
app.set("trust proxy", true);

// CORS: permite qualquer origem (mude em produção)
app.use(cors({ origin: "*" }));

// Log de requisições (aparece no Vercel Dashboard)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  next();
});

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// === INJETA O BANCO EM TODAS AS ROTAS (req.db) ===
app.use((req, res, next) => {
  req.db = db;
  next();
});

// === ROTA RAIZ ===
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de Currículos Online",
    status: "OK",
    database: "conectado",
    timestamp: new Date().toISOString(),
    endpoints: {
      curriculos: "/curriculos",
      experiencias: "/experiencias",
      formacoes: "/formacoes"
    }
  });
});

app.get('/_health', (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});


app.use("/curriculos", curriculosRoutes);
app.use("/experiencias", experienciasRoutes);
app.use("/formacoes", formacoesRoutes);

app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// === EXPORTA PARA O VERCEL (OBRIGATÓRIO) ===
// O Vercel espera uma exportação default para funções em `api/`.
// Usar `export default serverless(app)` garante que a função seja
// invocada corretamente e evita que o conteúdo estático (index.html)
// seja servido no lugar da resposta da API.
export default serverless(app);

// Exporta o app também para facilitar testes locais (ex: dev-server)
export { app };