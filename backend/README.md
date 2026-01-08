# Simulador Fio B - Backend

Backend da aplicação de simulação do impacto do Fio B na tarifa de energia elétrica.

## 🚀 Tecnologias

- **Node.js** (v18+)
- **TypeScript**
- **Express.js**
- **CORS**

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Build (compilar TypeScript)
npm run build

# Produção (após build)
npm start
```

## 📂 Estrutura de Pastas

```
backend/
├── src/
│   ├── data/
│   │   └── tusd_fiob.json    # Base de dados local
│   ├── routes/
│   │   └── tarifaFioBRoutes.ts  # Rotas da API
│   └── server.ts              # Servidor principal
├── package.json
├── tsconfig.json
└── .env
```

## 🌐 Endpoints

### GET /health
Health check do servidor.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-08T..."
}
```

### GET /api/tarifa-fio-b
Lista todas as áreas de concessão ou filtra por nome.

**Query Parameters:**
- `q` (opcional): Filtrar por nome da distribuidora

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "sigla": "CPFL Paulista",
      "valor": 206.6458973,
      "tusd": 388.15,
      "pct_fio_b_na_tarifa": 53,
      "sessenta_pct_fio_b": 123.9875384,
      "pct_sessenta_fio_b_tusd": 32,
      "custo_fio_b_100kwh": 12.39875384
    }
  ],
  "meta": {
    "count": 1,
    "total": 103,
    "source": "local"
  }
}
```

### GET /api/tarifa-fio-b/:sigla
Busca uma área de concessão específica.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "sigla": "CPFL Paulista",
    "valor": 206.6458973,
    ...
  }
}
```

## 📊 Base de Dados

O arquivo `src/data/tusd_fiob.json` contém dados de **103 áreas de concessão** no Brasil com informações sobre:

- Valor do Fio B (R$/MWh)
- TUSD (R$/MWh)
- Percentuais calculados
- Custo por 100 kWh

### Atualizando os Dados

1. Edite o arquivo `src/data/tusd_fiob.json`
2. Reinicie o servidor
3. O cache será atualizado automaticamente

## 🔧 Desenvolvimento

O servidor usa cache em memória para melhor performance. Os dados são carregados uma vez e mantidos em cache até o servidor ser reiniciado.

## 🚢 Deploy

### Build

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

### Produção

```bash
npm start
```

Ou use PM2:

```bash
pm2 start npm --name "simulador-fiob-backend" -- start
```

## 📝 Notas

- Por padrão, o servidor roda na porta **3001**
- CORS está configurado para aceitar requisições do frontend
- Logs de erros são exibidos no console

## 🆘 Troubleshooting

### Erro: Port already in use

Altere a porta no arquivo `.env`:
```env
PORT=3002
```

### Erro: Cannot find module

Execute:
```bash
npm install
```

---

**Desenvolvido por**: Canal Solar  
**Versão**: 1.0.0  
**Data**: Janeiro 2026

