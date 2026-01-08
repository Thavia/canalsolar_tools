import axios from 'axios';

export type FioBData = {
  sigla: string;
  valor: number;
  tusd: number;
  pct_fio_b_na_tarifa: number;
  sessenta_pct_fio_b: number;
  pct_sessenta_fio_b_tusd: number;
  custo_fio_b_100kwh: number;
  te: number;
  tusd_te: number;
  impacto_fiob: number;
};

export type ListFioBResponse = {
  success: boolean;
  data: FioBData[];
  meta: {
    count: number;
    total: number;
    source: string;
  };
};

export type GetFioBResponse = {
  success: boolean;
  data: FioBData;
};

function getApiUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tarifaFioBService = {
  async list(params?: { q?: string }): Promise<ListFioBResponse> {
    const res = await api.get<ListFioBResponse>('/tarifa-fio-b', { params });
    return res.data;
  },

  async getByArea(sigla: string): Promise<GetFioBResponse> {
    const res = await api.get<GetFioBResponse>(`/tarifa-fio-b/${encodeURIComponent(sigla)}`);
    return res.data;
  },
};

