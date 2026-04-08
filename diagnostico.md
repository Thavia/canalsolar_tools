# Plano de Evolução — Plataforma ECE: Do Diagnóstico ao Plano de Ação

## Visão Geral do Sistema Atual

O sistema hoje é uma **SPA estática** (React + Vite) com rota `/diagnostico-ece`. O diagnóstico tem 12 módulos distribuídos em 3 dias, avaliados em escala 1–5. Ao final, gera notas por módulo, radar chart e insights. **Não há backend, banco de dados, nem autenticação.**

---

## O Que Precisa Ser Construído

A evolução cria uma **plataforma web com área autenticada**, onde o diagnóstico passa a ser o ponto de entrada de um ciclo contínuo de planejamento empresarial com apoio de IA.

---

## Arquitetura Recomendada

### Stack sugerida

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | React (já existente) | Aproveitar tudo que existe |
| **Backend** | Node.js + Express ou Fastify | Simples, JS/TS uniforme com o frontend |
| **Banco de dados** | PostgreSQL | Relacional, robusto para dados estruturados do diagnóstico e planos |
| **ORM** | Prisma | Type-safe, migrações simples |
| **Autenticação** | JWT + bcrypt (ou Supabase Auth) | Rápido de implementar; Supabase oferece auth + banco juntos |
| **IA** | OpenAI API (GPT-4o) | Para geração de planos e documentos |
| **Armazenamento de docs** | Supabase Storage ou S3 | PDFs e arquivos gerados |
| **Deploy** | Railway, Render ou Supabase | Simples para projetos neste porte |

> **Alternativa simplificada:** usar **Supabase** como BaaS (banco + auth + storage) elimina a necessidade de criar backend próprio para a maioria das operações CRUD, deixando Node apenas para as chamadas à OpenAI.

---

## Módulos do Sistema

### Módulo 1 — Autenticação

**Rotas:**
- `POST /auth/register` — cadastro (nome, email, senha, nome da empresa, segmento)
- `POST /auth/login` — retorna JWT
- `POST /auth/logout`
- `POST /auth/forgot-password` / `POST /auth/reset-password`

**Telas frontend:**
- `/login`
- `/cadastro`
- `/recuperar-senha`

**Dados do usuário:**
```
User {
  id, nome, email, senha_hash,
  nome_empresa, segmento, porte,
  created_at
}
```

---

### Módulo 2 — Diagnóstico Persistido

**Mudança no fluxo atual:**

1. Usuário faz login → é direcionado ao diagnóstico (ou ao dashboard se já tiver um)
2. Ao finalizar o diagnóstico, as respostas são **salvas no banco** vinculadas ao usuário
3. Usuário pode refazer o diagnóstico (novo registro) e comparar evolução ao longo do tempo

**Modelo de dados:**
```
Diagnostico {
  id, user_id, created_at,
  status: 'em_andamento' | 'concluido'
}

RespostaDiagnostico {
  id, diagnostico_id,
  pergunta_id (ex: "2.3.1"),
  valor (1–5)
}
```

**API:**
- `POST /diagnostico` — cria novo diagnóstico
- `PUT /diagnostico/:id/resposta` — salva/atualiza resposta
- `POST /diagnostico/:id/finalizar` — marca como concluído, dispara geração de insights
- `GET /diagnostico/:id` — retorna diagnóstico completo com respostas
- `GET /diagnostico` — lista histórico de diagnósticos do usuário

---

### Módulo 3 — Dashboard do Empresário

**Rota:** `/app/dashboard`

**O que exibe:**
- Radar chart do último diagnóstico (reutilizar componente já existente)
- Nota geral e por módulo
- Alertas dos 3 módulos com menor nota
- Resumo do plano de ação ativo (quantas ações pendentes, em andamento, concluídas)
- Acesso rápido ao repositório de documentos

---

### Módulo 4 — Plano de Ação (5W2H)

**O coração do sistema.** Cada ação é criada no formato 5W2H:

| Campo | Significado |
|---|---|
| **What** | O que será feito? |
| **Why** | Por que? (vinculado ao módulo do diagnóstico) |
| **Who** | Quem é o responsável? |
| **Where** | Onde será executado? |
| **When** | Quando? (data-limite) |
| **How** | Como será feito? |
| **How much** | Quanto vai custar? |

**Modelo de dados:**
```
PlanoAcao {
  id, diagnostico_id, user_id,
  nome_plano, created_at
}

AcaoPlano {
  id, plano_acao_id,
  modulo_id (ex: "2.3"),
  what, why, who, where,
  when_date,
  how, how_much,
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada',
  prioridade: 'alta' | 'media' | 'baixa',
  gerado_por_ia: boolean,
  created_at, updated_at
}
```

**Telas frontend:**
- `/app/plano-de-acao` — visão kanban ou lista com filtros por módulo, status e prioridade
- `/app/plano-de-acao/:id` — detalhe/edição de uma ação
- Modal de criação de ação (manual ou assistida por IA)

**Funcionalidades:**
- Criar ação manualmente
- Criar ação com assistência da IA (ver Módulo 5)
- Arrastar para mudar status (kanban)
- Filtrar por módulo do diagnóstico, prioridade, responsável
- Exportar plano como PDF

---

### Módulo 5 — IA Assistente (OpenAI)

**Integração:** OpenAI API com GPT-4o no backend. **Nunca expor a chave da API no frontend.**

#### 5.1 — Geração de Plano de Ação Inicial

Ao concluir o diagnóstico, o sistema oferece: *"Quer que a IA gere um plano de ação inicial baseado no seu diagnóstico?"*

**Prompt enviado para a IA (estrutura):**
```
Contexto da empresa: [nome, segmento, porte]
Resultado do diagnóstico:
  - Propósito: 3.2/5
  - Cultura: 2.7/5
  - Vendas: 2.1/5
  ... (todos os 12 módulos)
Módulos críticos (nota < 3): Vendas, Financeiro, Cultura

Gere um plano de ação no formato 5W2H com 3 ações prioritárias para cada módulo crítico,
focado no setor elétrico. Retorne em JSON estruturado.
```

**API interna:** `POST /ia/gerar-plano` → retorna array de ações no formato 5W2H → salva no banco

#### 5.2 — Chat Assistente Contextualizado

**Tela:** `/app/assistente`

Um chat onde o empresário pode perguntar ao GPT-4o coisas como:
- *"Como posso melhorar meu processo comercial?"*
- *"Crie uma ação de 5W2H para estruturar meu funil de vendas"*
- *"Explique o que significa minha nota em Equity"*

O contexto do diagnóstico do usuário é sempre enviado no system prompt para respostas personalizadas.

**API:** `POST /ia/chat` com histórico da conversa + contexto do diagnóstico

#### 5.3 — Geração de Documentos via IA

Botão em cada tipo de documento no repositório: *"Gerar com IA"*

O sistema monta um prompt rico com os dados do diagnóstico e perfil da empresa para gerar o documento. (Ver Módulo 6)

---

### Módulo 6 — Repositório de Documentos

**Rota:** `/app/documentos`

Biblioteca de documentos personalizados para a empresa. Cada documento é gerado pela IA a partir do diagnóstico e pode ser editado/salvo.

**Tipos de documento e contexto usado:**

| Documento | Campos do diagnóstico usados |
|---|---|
| Playbook de Vendas | Módulo 2.3 (Vendas), 2.1 (Produtos), 2.2 (Marketing) |
| Script de Abordagem | Módulo 2.3, perfil da empresa, segmento |
| Script de Follow-up | Módulo 2.3 |
| Script de Qualificação | Módulo 2.3, 2.1 |
| Copys para Anúncios | Módulo 2.2 (Marketing), 2.1 (Produtos) |
| Modelo de Proposta Comercial | Módulo 2.1, 2.3, 3.3 (Financeiro) |
| Modelo de Contrato | Módulo 2.4 (Operação), dados da empresa |
| Modelo de Precificação | Módulo 3.3 (Financeiro), 2.1 |
| Manual de Cultura | Módulo 1.1 (Propósito), 1.2 (Cultura) |
| Descrição de Cargos | Módulo 1.3 (Pessoas) |

**Modelo de dados:**
```
Documento {
  id, user_id,
  tipo: 'playbook_vendas' | 'script_abordagem' | ... ,
  titulo, conteudo_html, conteudo_raw,
  gerado_por_ia: boolean,
  created_at, updated_at
}
```

**Funcionalidades:**
- Gerar documento com IA (1 clique)
- Editor de texto rico (Quill, TipTap) para personalizar após geração
- Histórico de versões (simples: salvar nova versão a cada edição)
- Exportar como PDF
- Visualizar/imprimir

---

## Fluxo Completo do Usuário

```
Acessa /diagnostico-ece
      ↓
Responde o diagnóstico
      ↓
[Novo] Cadastra conta (ou faz login)
      ↓
Diagnóstico salvo → Geração de insights (já existe)
      ↓
Oferta: "Quer que a IA crie seu Plano de Ação?"
      ↓
Dashboard com radar + plano de ação gerado
      ↓
Empresário revisa, edita, adiciona ações manualmente
      ↓
Acessa Repositório de Documentos
      ↓
Gera documentos com IA (contexto do diagnóstico)
      ↓
Edita, exporta, usa no dia a dia
      ↓
[Futuro] Refaz diagnóstico após 90 dias → compara evolução
```

---

## Ordem de Implementação Sugerida (Sprints)

| Sprint | Entregas |
|---|---|
| **1** | Setup backend (Node + Prisma + PostgreSQL), autenticação JWT, migração do diagnóstico para salvar no banco |
| **2** | Dashboard básico, histórico de diagnósticos, radar chart conectado ao banco |
| **3** | CRUD do Plano de Ação (5W2H), interface kanban/lista |
| **4** | Integração OpenAI — geração de plano inicial pós-diagnóstico |
| **5** | Chat assistente contextualizado |
| **6** | Repositório de documentos — geração via IA + editor rico |
| **7** | Export PDF (plano de ação + documentos), polimento UX |
| **8** | Comparativo de diagnósticos (evolução ao longo do tempo) |

---

## Pontos de Atenção para o Programador

1. **A chave da OpenAI jamais vai para o frontend** — todas as chamadas passam pelo backend
2. **Rate limiting nas rotas de IA** — geração de documentos consome tokens; implementar limite por usuário/dia
3. **O diagnóstico atual é stateless** — ao introduzir autenticação, decidir se o usuário pode fazer o diagnóstico sem login (e salvar depois) ou se login é obrigatório antes de começar
4. **Contexto do prompt** — quanto mais rico o perfil da empresa (segmento, porte, cidade, faturamento aproximado), melhor a qualidade dos documentos gerados; considerar uma tela de "perfil da empresa" antes de gerar documentos
5. **Custo da OpenAI** — GPT-4o custa ~$5/1M tokens input; um playbook de vendas gera ~2–4k tokens; estimar custo por usuário e definir modelo de negócio (freemium? assinatura?)
6. **Os 12 módulos e IDs de perguntas já existem** no arquivo `diagnosticoEceData.ts` — o backend deve replicar essa estrutura ou importar como referência para validar respostas
