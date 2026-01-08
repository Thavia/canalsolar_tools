# Simulador Fio B - Frontend

Frontend da aplicação de simulação do impacto do Fio B na tarifa de energia elétrica.

## 🚀 Tecnologias

- **React 18**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Axios**
- **React Helmet Async**

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com a URL do backend:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📂 Estrutura de Pastas

```
frontend/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── SearchableSelect.tsx  # Seletor com busca
│   │   └── SimuladorFioBPage.tsx # Página principal
│   ├── services/
│   │   └── tarifaFioBService.ts  # Service da API
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Funcionalidades

### 1. Formulário de Captura de Lead

- **Área de concessão**: Seletor com busca
- **Nome completo**: Campo de texto
- **WhatsApp**: Formatação automática `(XX) XXXXX-XXXX`
- **E-mail**: Validação de formato

### 2. Integração com n8n

Após preencher o formulário, os dados são enviados para:
```
https://workflow.softeo.com.br/webhook/8494e5c6-fba5-4870-841d-ba4354ede405
```

**Payload enviado:**
```json
{
  "identifier": "simulador_fiob",
  "Nome": "...",
  "E-mail": "...",
  "WhatsApp": "11999999999",
  "Área de concessão": "CPFL Paulista",
  "area_de_concessao": "CPFL Paulista",
  "Página de conversão": "Simulador Fio B",
  "utm_source": "...",
  "utm_medium": "...",
  "utm_campaign": "...",
  "utm_term": "...",
  "utm_content": "..."
}
```

### 3. Resultados Dinâmicos

Após envio do formulário, exibe:

- **% de 60% do Fio B na Tarifa Total** (destaque principal)
- Valores em R$ por kWh:
  - Valor do Fio B
  - TUSD
  - 60% do Fio B
- Percentuais calculados:
  - % do Fio B na Tarifa Total
  - % do Fio B na TUSD
  - % de 60% do Fio B na TUSD
- Custo por 100 kWh

### 4. Captura de UTMs

A aplicação captura automaticamente os parâmetros UTM da URL:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

**Exemplo de URL:**
```
http://localhost:5173/?utm_source=facebook&utm_campaign=solar2026
```

## 🎨 Design

- **Tema**: Gradiente azul escuro (primary-950 -> primary-900 -> black)
- **Responsivo**: Mobile-first design
- **Componentes**: Cards com backdrop-blur e borders sutis
- **Tipografia**: Sistema de fontes do SO
- **Acessibilidade**: Suporte a teclado e screen readers

## 🔧 Desenvolvimento

### Hot Reload

O Vite fornece hot-reload automático durante o desenvolvimento:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Customização de Cores

Edite `tailwind.config.js`:

```js
colors: {
  primary: {
    50: '#f0f9ff',
    // ... 
    950: '#082f49',
  },
}
```

## 🚢 Deploy

### Build

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

### Hospedagem

A aplicação pode ser hospedada em qualquer serviço de hospedagem estática:

- **Vercel**: `vercel deploy`
- **Netlify**: Arraste a pasta `dist`
- **GitHub Pages**: Configure no repositório
- **AWS S3 + CloudFront**: Upload da pasta `dist`

### Variáveis de Ambiente em Produção

Configure a variável `VITE_API_URL` no seu provedor de hospedagem apontando para o backend em produção:

```env
VITE_API_URL=https://api.seudominio.com/api
```

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1920px+)

## 🆘 Troubleshooting

### Erro de CORS

Certifique-se de que o backend está configurado para aceitar requisições do frontend:

```env
# backend/.env
CORS_ORIGIN=http://localhost:5173
```

### API não responde

Verifique se:
1. O backend está rodando
2. A variável `VITE_API_URL` está correta
3. O backend está acessível na rede

### Build falha

Limpe o cache e reinstale:

```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📊 Performance

- **Lighthouse Score**: 90+
- **Bundle Size**: < 200kb (gzip)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s

## 🔒 Segurança

- Validação de inputs no frontend e backend
- Sanitização de dados antes de enviar
- HTTPS recomendado em produção
- Headers de segurança configurados

---

**Desenvolvido por**: Canal Solar  
**Versão**: 1.0.0  
**Data**: Janeiro 2026

