import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import tarifaFioBRoutes from './routes/tarifaFioBRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/tarifa-fio-b', tarifaFioBRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API: http://localhost:${PORT}/api/tarifa-fio-b`);
});

