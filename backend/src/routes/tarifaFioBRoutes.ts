import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

type FioBData = {
  sigla: string;
  valor: number;
  tusd: number;
  pct_fio_b_na_tarifa: number;
  sessenta_pct_fio_b: number;
  pct_sessenta_fio_b_tusd: number;
  custo_fio_b_100kwh: number;
};

let cachedData: FioBData[] | null = null;

function loadData(): FioBData[] {
  if (cachedData) return cachedData;

  const jsonPath = path.join(__dirname, '..', 'data', 'tusd_fiob.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  cachedData = JSON.parse(rawData);

  return cachedData!;
}

// GET /api/tarifa-fio-b?q=<nome>
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q as string | undefined)?.trim()?.toLowerCase() || '';

    const data = loadData();

    // Filtrar por query se fornecido
    let filtered = data;
    if (q) {
      filtered = data.filter((item) => item.sigla.toLowerCase().includes(q));
    }

    // Ordenar por sigla
    filtered.sort((a, b) => a.sigla.localeCompare(b.sigla, 'pt-BR'));

    return res.json({
      success: true,
      data: filtered,
      meta: {
        count: filtered.length,
        total: data.length,
        source: 'local',
      },
    });
  } catch (error: any) {
    console.error('Erro ao carregar dados de Tarifa Fio B:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao carregar Tarifa Fio B',
      message: error?.message,
    });
  }
});

// GET /api/tarifa-fio-b/:sigla
router.get('/:sigla', async (req, res) => {
  try {
    const sigla = req.params.sigla?.trim() || '';

    const data = loadData();

    const found = data.find(
      (item) => item.sigla.toLowerCase() === sigla.toLowerCase()
    );

    if (!found) {
      return res.status(404).json({
        success: false,
        error: 'Área de concessão não encontrada',
      });
    }

    return res.json({
      success: true,
      data: found,
    });
  } catch (error: any) {
    console.error('Erro ao buscar área de concessão:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar área de concessão',
      message: error?.message,
    });
  }
});

export default router;

