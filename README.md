# 📊 Simulador Fio B - Canal Solar

Aplicação completa para simulação do impacto do Fio B na tarifa de energia elétrica brasileira.

## 📁 Estrutura do Projeto

```
simulador_fiob/
├── backend/          # API Node.js + Express + TypeScript
├── frontend/         # React + Vite + TailwindCSS
└── README.md         # Este arquivo
```

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

O backend estará rodando em: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 📋 Pré-requisitos

- **Node.js**: v18 ou superior
- **npm**: v9 ou superior

## 🎯 Funcionalidades

### 📊 Cálculo Dinâmico de Percentuais

- % do Fio B na Tarifa Total
- % do Fio B na TUSD
- % de 60% do Fio B (não compensável)
- Valores em R$ por kWh

### 📝 Captura de Leads

- Formulário completo com validações
- Formatação automática de WhatsApp
- Integração com n8n/RD Station
- Captura automática de UTMs

### 📍 Base de Dados

- 103 áreas de concessão do Brasil
- Dados da ANEEL (extraídos em 08/01/2026)
- Componente Fio B da TUSD
- Informações sobre energia solar

## 🏗️ Arquitetura

### Backend

- **Framework**: Express.js
- **Linguagem**: TypeScript
- **API**: RESTful
- **Cache**: Em memória
- **CORS**: Configurado

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Estado**: React Hooks
- **Requisições**: Axios

## 📚 Documentação Detalhada

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/api/tarifa-fio-b` | Lista áreas de concessão |
| GET | `/api/tarifa-fio-b/:sigla` | Busca área específica |

## 🎨 Screenshots

### Formulário Inicial
Formulário limpo e moderno para captura de leads.

### Resultados
Dashboard com percentuais calculados e informações detalhadas.

## 🔧 Desenvolvimento

### Estrutura de Branches (Recomendado)

```
main          # Produção
develop       # Desenvolvimento
feature/*     # Novas funcionalidades
hotfix/*      # Correções urgentes
```

### Fluxo de Desenvolvimento

1. Clone o repositório
2. Instale as dependências (backend e frontend)
3. Configure os `.env`
4. Execute os servidores de desenvolvimento
5. Faça suas alterações
6. Teste localmente
7. Commit e push

## 📦 Deploy

### Backend

**Opções recomendadas:**
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

### Frontend

**Opções recomendadas:**
- Vercel (recomendado)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
PORT=3001
CORS_ORIGIN=https://seudominio.com
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_URL=https://api.seudominio.com/api
```

## 📊 Base de Dados

Os dados estão em formato JSON estático (`backend/src/data/tusd_fiob.json`).

**Atualização dos dados:**
1. Obtenha novos dados da ANEEL
2. Atualize o arquivo JSON
3. Reinicie o backend
4. Cache será atualizado automaticamente

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 📈 Performance

- **Backend**: < 50ms de resposta
- **Frontend**: 
  - First Contentful Paint: < 1s
  - Time to Interactive: < 2s
  - Lighthouse Score: 90+

## 🔒 Segurança

- ✅ Validação de inputs
- ✅ CORS configurado
- ✅ HTTPS recomendado em produção
- ✅ Sanitização de dados
- ✅ Headers de segurança

## 🆘 Suporte

Para problemas e dúvidas:
1. Consulte os READMEs específicos (backend/frontend)
2. Verifique a seção de Troubleshooting
3. Abra uma issue no repositório

## 📝 Changelog

### v1.0.0 (08/01/2026)
- ✅ Primeira versão
- ✅ 103 áreas de concessão
- ✅ Cálculos dinâmicos de percentuais
- ✅ Integração com n8n
- ✅ Captura de UTMs
- ✅ Formulário de leads
- ✅ Design responsivo

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

**Canal Solar**  
Site: [www.canalsolar.com.br](https://www.canalsolar.com.br)

---

**Versão**: 1.0.0  
**Data**: Janeiro 2026  
**Status**: ✅ Produção

