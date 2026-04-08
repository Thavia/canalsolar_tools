export type PerguntaEce = { id: string; texto: string }

export type ModuloEce = {
  id: string
  tituloResumo: string
  tituloCompleto: string
  perguntas: PerguntaEce[]
}

export type BlocoDiaEce = {
  id: string
  titulo: string
  modulos: ModuloEce[]
}

export const ESCALA_AVALIACAO_ECE = [
  { valor: 1, texto: 'Inexistente / Nunca pensamos nisso' },
  { valor: 2, texto: 'Iniciando / Muito incipiente' },
  { valor: 3, texto: 'Em desenvolvimento / Parcialmente estruturado' },
  { valor: 4, texto: 'Bem estruturado / Funcionando bem' },
  { valor: 5, texto: 'Excelente / Referência no setor' },
] as const

export const BLOCOS_DIAGNOSTICO_ECE: BlocoDiaEce[] = [
  {
    id: 'dia1',
    titulo: 'DIA 1 — Identidade, propósito e crescimento estruturado',
    modulos: [
      {
        id: '1.1',
        tituloResumo: '1.1 — Propósito',
        tituloCompleto: '1.1 — Propósito',
        perguntas: [
          { id: '1.1.1', texto: 'A empresa tem clareza sobre por que existe e qual problema veio resolver?' },
          { id: '1.1.2', texto: 'Os fundadores conseguem articular a missão da empresa de forma inspiradora?' },
          { id: '1.1.3', texto: 'O propósito impacta as decisões do dia a dia?' },
        ],
      },
      {
        id: '1.2',
        tituloResumo: '1.2 — Cultura',
        tituloCompleto: '1.2 — Cultura',
        perguntas: [
          { id: '1.2.1', texto: 'A empresa tem valores definidos e praticados de verdade?' },
          { id: '1.2.2', texto: 'O estilo de liderança é claro e consistente?' },
          { id: '1.2.3', texto: 'Os princípios culturais guiam contratações e demissões?' },
        ],
      },
      {
        id: '1.3',
        tituloResumo: '1.3 — Pessoas',
        tituloCompleto: '1.3 — Pessoas',
        perguntas: [
          { id: '1.3.1', texto: 'A estrutura organizacional tem papéis e responsabilidades claros?' },
          { id: '1.3.2', texto: 'A empresa atrai e retém talentos com intencionalidade?' },
          { id: '1.3.3', texto: 'Existe um processo de desenvolvimento de líderes?' },
        ],
      },
      {
        id: '1.4',
        tituloResumo: '1.4 — Estratégia',
        tituloCompleto: '1.4 — Estratégia para o setor elétrico',
        perguntas: [
          { id: '1.4.1', texto: 'Há uma visão de longo prazo clara e documentada?' },
          { id: '1.4.2', texto: 'A empresa monitora as mudanças do setor e adapta sua estratégia?' },
          { id: '1.4.3', texto: 'Estratégia, cultura e propósito estão alinhados?' },
        ],
      },
    ],
  },
  {
    id: 'dia2',
    titulo: 'DIA 2 — Expansão e alcance',
    modulos: [
      {
        id: '2.1',
        tituloResumo: '2.1 — Produtos',
        tituloCompleto: '2.1 — Produtos do setor elétrico',
        perguntas: [
          { id: '2.1.1', texto: 'A proposta de valor da empresa é clara e diferenciada?' },
          { id: '2.1.2', texto: 'O portfólio de produtos/serviços está bem estruturado?' },
          { id: '2.1.3', texto: 'A empresa inova continuamente em suas entregas?' },
        ],
      },
      {
        id: '2.2',
        tituloResumo: '2.2 — Marketing',
        tituloCompleto: '2.2 — Marketing no setor elétrico',
        perguntas: [
          { id: '2.2.1', texto: 'A marca tem posicionamento claro no mercado?' },
          { id: '2.2.2', texto: 'Existe uma estratégia de conteúdo e geração de autoridade?' },
          { id: '2.2.3', texto: 'A empresa gera demanda previsível via marketing?' },
        ],
      },
      {
        id: '2.3',
        tituloResumo: '2.3 — Vendas',
        tituloCompleto: '2.3 — Vendas no setor elétrico',
        perguntas: [
          { id: '2.3.1', texto: 'Há um processo comercial estruturado (funil, etapas, metas)?' },
          { id: '2.3.2', texto: 'O time comercial usa argumentos e gatilhos de decisão eficazes?' },
          { id: '2.3.3', texto: 'A empresa tem estratégias para aumentar conversão e ticket médio?' },
          {
            id: '2.3.4',
            texto: 'Nos últimos 12 meses, a empresa bateu as metas que havia definido?',
          },
        ],
      },
      {
        id: '2.4',
        tituloResumo: '2.4 — Operação',
        tituloCompleto: '2.4 — Operação',
        perguntas: [
          { id: '2.4.1', texto: 'A entrega dos produtos/serviços é consistente e de alta qualidade?' },
          { id: '2.4.2', texto: 'A equipe técnica/operacional está bem estruturada?' },
          { id: '2.4.3', texto: 'Existem indicadores de qualidade e satisfação do cliente?' },
        ],
      },
    ],
  },
  {
    id: 'dia3',
    titulo: 'DIA 3 — Ordem, processo, finanças e equity',
    modulos: [
      {
        id: '3.1',
        tituloResumo: '3.1 — Eficiência',
        tituloCompleto: '3.1 — Eficiência',
        perguntas: [
          { id: '3.1.1', texto: 'A empresa elimina desperdícios e tem foco nos Indicadores Chave certos?' },
          { id: '3.1.2', texto: 'As metas são claras, acompanhadas e cobradas?' },
          { id: '3.1.3', texto: 'O tempo e energia da equipe são bem gerenciados?' },
        ],
      },
      {
        id: '3.2',
        tituloResumo: '3.2 — Produtividade',
        tituloCompleto: '3.2 — Produtividade',
        perguntas: [
          { id: '3.2.1', texto: 'A empresa usa tecnologia e automação para escalar?' },
          { id: '3.2.2', texto: 'Existe uma cultura de performance e meritocracia?' },
          { id: '3.2.3', texto: 'Inteligência Artificial já é utilizada nos processos?' },
        ],
      },
      {
        id: '3.3',
        tituloResumo: '3.3 — Financeiro',
        tituloCompleto: '3.3 — Financeiro',
        perguntas: [
          { id: '3.3.1', texto: 'A empresa tem controle claro de custos, margens e precificação?' },
          { id: '3.3.2', texto: 'Existe planejamento financeiro e controle de caixa?' },
          { id: '3.3.3', texto: 'As decisões financeiras são tomadas com base em indicadores?' },
        ],
      },
      {
        id: '3.4',
        tituloResumo: '3.4 — Equity',
        tituloCompleto: '3.4 — Equity',
        perguntas: [
          { id: '3.4.1', texto: 'Os sócios pensam em valorização do negócio no longo prazo?' },
          { id: '3.4.2', texto: 'Há visão sobre expansão, M&A ou entrada de investidores?' },
          { id: '3.4.3', texto: 'A empresa toma decisões que aumentam seu valuation?' },
        ],
      },
    ],
  },
]

export function listarIdsPerguntas(): string[] {
  const ids: string[] = []
  for (const bloco of BLOCOS_DIAGNOSTICO_ECE) {
    for (const mod of bloco.modulos) {
      for (const p of mod.perguntas) ids.push(p.id)
    }
  }
  return ids
}

export function mediaModulo(
  mod: ModuloEce,
  scores: Record<string, number | undefined>,
): number | null {
  const vals = mod.perguntas.map((p) => scores[p.id]).filter((v): v is number => typeof v === 'number')
  if (vals.length !== mod.perguntas.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export type InsightsMicroDia = {
  mediaFase: number
  melhor: { titulo: string; media: number }
  atencao: { titulo: string; media: number }
}

export function insightsMicroDia(
  diaIdx: number,
  scores: Record<string, number | undefined>,
): InsightsMicroDia | null {
  const bloco = BLOCOS_DIAGNOSTICO_ECE[diaIdx]
  const porMod = bloco.modulos.map((mod) => {
    const m = mediaModulo(mod, scores)
    return m === null ? null : { mod, media: m }
  })
  if (porMod.some((x) => x === null)) return null
  const ok = porMod as { mod: ModuloEce; media: number }[]
  const mediaFase = ok.reduce((s, x) => s + x.media, 0) / ok.length
  const sorted = [...ok].sort((a, b) => b.media - a.media)
  return {
    mediaFase,
    melhor: { titulo: sorted[0].mod.tituloResumo, media: sorted[0].media },
    atencao: { titulo: sorted[sorted.length - 1].mod.tituloResumo, media: sorted[sorted.length - 1].media },
  }
}

export function interpretarScoreGeral(score: number): { faixa: string; rotulo: string; cor: string } {
  if (score < 2.1) return { faixa: '1,0 – 2,0', rotulo: 'Crítico — empresa sem estrutura básica de gestão', cor: 'red' }
  if (score < 3.1) return { faixa: '2,1 – 3,0', rotulo: 'Atenção — várias áreas em fase inicial', cor: 'orange' }
  if (score < 4) return { faixa: '3,1 – 3,9', rotulo: 'Em desenvolvimento — boas bases, mas gaps importantes', cor: 'yellow' }
  if (score < 4.6) return { faixa: '4,0 – 4,5', rotulo: 'Bom — empresa bem estruturada, refinamentos necessários', cor: 'green' }
  return { faixa: '4,6 – 5,0', rotulo: 'Referência — gestão de alto nível', cor: 'blue' }
}

/** Rótulos curtos para o eixo do radar (evita sobreposição). */
export const RADAR_LABEL_POR_MODULO: Record<string, string> = {
  '1.1': 'Propósito',
  '1.2': 'Cultura',
  '1.3': 'Pessoas',
  '1.4': 'Estratégia',
  '2.1': 'Produtos',
  '2.2': 'Marketing',
  '2.3': 'Vendas',
  '2.4': 'Operação',
  '3.1': 'Eficiência',
  '3.2': 'Produtividade',
  '3.3': 'Financeiro',
  '3.4': 'Equity',
}

export type InsightFinaisRadar = {
  pontoForte: { id: string; titulo: string; media: number; texto: string }
  pontoFraco: { id: string; titulo: string; media: number; texto: string }
  dispersao: number
}

const INSIGHTS_FORTE_FRACO: Record<string, { forte: string; fraco: string }> = {
  '1.1': {
    forte:
      'Propósito claro sustenta narrativa comercial e prioridades — use como bússola em OKRs e decisões de portfólio.',
    fraco:
      'Baixa clareza de propósito gera dispersão; priorize oficina com sócios, mensagem única e critérios de “sim/não” no dia a dia.',
  },
  '1.2': {
    forte:
      'Cultura forte acelera engajamento e reduz atrito em mudanças — documente rituais e exemplos de liderança.',
    fraco:
      'Cultura frágil aumenta turnover e ruído interno; defina valores observáveis e alinhe feedback e contratação a eles.',
  },
  '1.3': {
    forte:
      'Papéis e retenção bem resolvidos dão previsibilidade para escalar — mantenha matriz RACI e plano de sucessão.',
    fraco:
      'Estrutura e desenvolvimento de líderes precisam de atenção; comece por descrição de cargos e 1:1s com métricas.',
  },
  '1.4': {
    forte:
      'Estratégia alinhada ao setor elétrico reduz risco regulatório e de mercado — revise cenários trimestralmente.',
    fraco:
      'Falta de visão de longo prazo expõe a concorrência e à regulação; construa roadmap e inteligência competitiva mínima.',
  },
  '2.1': {
    forte:
      'Proposta de valor e portfólio bem definidos facilitam precificação e upsell — conecte oferta ao dado de cliente.',
    fraco:
      'Oferta genérica dificulta margem; refine ICP, bundles e prova social antes de ampliar canais.',
  },
  '2.2': {
    forte:
      'Marca e conteúdo geram autoridade e demanda mais barata — mantenha calendário editorial e métricas de topo de funil.',
    fraco:
      'Marketing fraco eleva CAC; escolha 1–2 canais, defina mensagem e acompanhe MQL/SQL com consistência.',
  },
  '2.3': {
    forte:
      'Processo comercial estruturado melhora previsibilidade de receita — padronize etapas, objeções e follow-up.',
    fraco:
      'Vendas sem funil claro desperdiça lead; implemente CRM, scripts de descoberta e metas por etapa.',
  },
  '2.4': {
    forte:
      'Operação sólida protege NPS e margem — monitore SLA, retrabalho e capacidade instalada.',
    fraco:
      'Entrega inconsistente corrói reputação; mapeie gargalos, checklists e indicadores de qualidade por projeto.',
  },
  '3.1': {
    forte:
      'Foco nos Indicadores Chave certos e eliminação de desperdício libera caixa — faça revisões semanais de metas e desvios.',
    fraco:
      'Baixa eficiência dilui resultado; liste top 5 desperdícios e defina donos e prazos para cada um.',
  },
  '3.2': {
    forte:
      'Automação e cultura de performance escalam sem inflar headcount — priorize fluxos repetitivos e dados únicos.',
    fraco:
      'Produtividade baixa pede tecnologia e clareza de metas; audite ferramentas e alinhe incentivos ao que importa.',
  },
  '3.3': {
    forte:
      'Controle financeiro permite precificar e investir com segurança — mantenha DRE de gestão e fluxo de caixa semanal.',
    fraco:
      'Falta de visão de margens e caixa é risco alto; estruture precificação, centros de custo e revisão mensal.',
  },
  '3.4': {
    forte:
      'Visão de valorização e equity alinha sócios a decisões de longo prazo — formalize acordos e cenários de saída.',
    fraco:
      'Governança e valuation fracos geram conflito entre sócios; alinhe expectativas, dividend policy e plano de crescimento.',
  },
}

export function insightsFinaisRadar(
  medias: { id: string; titulo: string; media: number }[],
): InsightFinaisRadar | null {
  if (medias.length === 0) return null
  const sorted = [...medias].sort((a, b) => b.media - a.media)
  const melhor = sorted[0]
  const pior = sorted[sorted.length - 1]
  const packMelhor = INSIGHTS_FORTE_FRACO[melhor.id]
  const packPior = INSIGHTS_FORTE_FRACO[pior.id]
  const dispersao = melhor.media - pior.media
  return {
    pontoForte: {
      id: melhor.id,
      titulo: melhor.titulo,
      media: melhor.media,
      texto: packMelhor?.forte ?? `Destaque em ${melhor.titulo}: mantenha o ritmo e use como referência para outras áreas.`,
    },
    pontoFraco: {
      id: pior.id,
      titulo: pior.titulo,
      media: pior.media,
      texto: packPior?.fraco ?? `${pior.titulo} concentra o maior gap; defina um plano de 90 dias com metas mensuráveis.`,
    },
    dispersao,
  }
}
