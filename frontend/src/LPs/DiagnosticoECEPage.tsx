import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from '../utils/helmet'
import DiagnosticoEceRadarChart from '../components/DiagnosticoEceRadarChart'
import {
  BLOCOS_DIAGNOSTICO_ECE,
  ESCALA_AVALIACAO_ECE,
  insightsFinaisRadar,
  insightsMicroDia,
  interpretarScoreGeral,
  listarIdsPerguntas,
  mediaModulo,
  RADAR_LABEL_POR_MODULO,
  type ModuloEce,
  type PerguntaEce,
} from './diagnosticoEceData'

const LOGO_URL =
  'https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp'

const STORAGE_KEY_ECE = 'canal_solar_diagnostico_ece_v1'

type EceDiagnosticoPersistedV1 = {
  v: 1
  stepIndex: number
  mostrarEscala: boolean
  qual: {
    nomeEmpresa: string
    nomeResponsavel: string
    cidadeEstado: string
    segmento: string
    faturamentoMensal: string
    tempoSetorSolar: string
    numFuncionarios: string
    ehSocio: string
    quantosSocios: string
    maiorDesafio: string
    treinamentoGestao: string
    meta12Meses: string
    observacoesComercial: string
  }
  scores: Record<string, number>
}

type QualField =
  | 'nomeEmpresa'
  | 'nomeResponsavel'
  | 'cidadeEstado'
  | 'segmento'
  | 'faturamentoMensal'
  | 'tempoSetorSolar'
  | 'numFuncionarios'
  | 'ehSocio'
  | 'quantosSocios'
  | 'maiorDesafio'
  | 'treinamentoGestao'
  | 'meta12Meses'
  | 'observacoesComercial'

type Screen =
  | { kind: 'qual'; field: QualField }
  | { kind: 'introDiag' }
  | { kind: 'diag'; diaIdx: number; blocoTitulo: string; modulo: ModuloEce; pergunta: PerguntaEce }
  | { kind: 'micro'; diaIdx: number }
  | { kind: 'resumo' }

const QUAL_LABELS: Record<QualField, { label: string; hint?: string; optional?: boolean }> = {
  nomeEmpresa: { label: 'Nome da empresa' },
  nomeResponsavel: { label: 'Nome do responsável' },
  cidadeEstado: { label: 'Cidade / Estado' },
  segmento: { label: 'Segmento de atuação' },
  faturamentoMensal: { label: 'Faturamento mensal aproximado (R$)' },
  tempoSetorSolar: { label: 'Há quanto tempo está no setor solar?' },
  numFuncionarios: { label: 'Número de funcionários' },
  ehSocio: { label: 'É sócio(a) da empresa?' },
  quantosSocios: { label: 'Quantos sócios tem o negócio?' },
  maiorDesafio: { label: 'Qual é o maior desafio da empresa hoje?' },
  treinamentoGestao: { label: 'Já participou de algum treinamento de gestão?' },
  meta12Meses: { label: 'Qual é a meta de crescimento para os próximos 12 meses?' },
  observacoesComercial: { label: 'Observações adicionais do comercial', optional: true, hint: 'Opcional' },
}

function buildScreens(ehSocio: string): Screen[] {
  const out: Screen[] = []
  const qualBase: QualField[] = [
    'nomeEmpresa',
    'nomeResponsavel',
    'cidadeEstado',
    'segmento',
    'faturamentoMensal',
    'tempoSetorSolar',
    'numFuncionarios',
    'ehSocio',
  ]
  if (ehSocio === 'sim') qualBase.push('quantosSocios')
  qualBase.push('maiorDesafio', 'treinamentoGestao', 'meta12Meses', 'observacoesComercial')
  for (const f of qualBase) {
    out.push({ kind: 'qual', field: f })
  }
  out.push({ kind: 'introDiag' })
  for (let d = 0; d < BLOCOS_DIAGNOSTICO_ECE.length; d++) {
    const bloco = BLOCOS_DIAGNOSTICO_ECE[d]
    for (const mod of bloco.modulos) {
      for (const p of mod.perguntas) {
        out.push({
          kind: 'diag',
          diaIdx: d,
          blocoTitulo: bloco.titulo,
          modulo: mod,
          pergunta: p,
        })
      }
    }
    out.push({ kind: 'micro', diaIdx: d })
  }
  out.push({ kind: 'resumo' })
  return out
}

function scoreGeralEmpresa(
  scores: Record<string, number | undefined>,
): { valor: number | null; mediasModulo: { id: string; titulo: string; media: number }[] } {
  const mediasModulo: { id: string; titulo: string; media: number }[] = []
  for (const bloco of BLOCOS_DIAGNOSTICO_ECE) {
    for (const mod of bloco.modulos) {
      const m = mediaModulo(mod, scores)
      if (m === null) {
        return { valor: null, mediasModulo: [] }
      }
      mediasModulo.push({ id: mod.id, titulo: mod.tituloResumo, media: m })
    }
  }
  const valor = mediasModulo.reduce((s, x) => s + x.media, 0) / mediasModulo.length
  return { valor, mediasModulo }
}

function classeInterpretacao(cor: string): string {
  switch (cor) {
    case 'red':
      return 'bg-red-500/15 border-red-500/40 text-red-100'
    case 'orange':
      return 'bg-orange-500/15 border-orange-500/40 text-orange-100'
    case 'yellow':
      return 'bg-amber-400/15 border-amber-400/40 text-amber-100'
    case 'green':
      return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100'
    case 'blue':
      return 'bg-sky-500/15 border-sky-500/40 text-sky-100'
    default:
      return 'bg-white/10 border-white/20 text-white'
  }
}

const inputClass =
  'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50 text-base'

const MICRO_COPY: Record<number, { titulo: string; subtitulo: string }> = {
  0: {
    titulo: 'Identidade e estratégia mapeadas',
    subtitulo: 'Você consolidou a visão sobre propósito, cultura, pessoas e estratégia no setor elétrico.',
  },
  1: {
    titulo: 'Expansão e operação em foco',
    subtitulo: 'Produto, marketing, vendas e entrega — a base comercial e operacional foi avaliada.',
  },
  2: {
    titulo: 'Gestão, finanças e equity',
    subtitulo: 'Eficiência, produtividade, números e visão de valorização completam o raio-X.',
  },
}

export default function DiagnosticoECEPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [animToken, setAnimToken] = useState(0)
  const [erroPasso, setErroPasso] = useState<string | null>(null)
  const [mostrarEscala, setMostrarEscala] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevEhSocio = useRef('')

  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [nomeResponsavel, setNomeResponsavel] = useState('')
  const [cidadeEstado, setCidadeEstado] = useState('')
  const [segmento, setSegmento] = useState('')
  const [faturamentoMensal, setFaturamentoMensal] = useState('')
  const [tempoSetorSolar, setTempoSetorSolar] = useState('')
  const [numFuncionarios, setNumFuncionarios] = useState('')
  const [ehSocio, setEhSocio] = useState('')
  const [quantosSocios, setQuantosSocios] = useState('')
  const [maiorDesafio, setMaiorDesafio] = useState('')
  const [treinamentoGestao, setTreinamentoGestao] = useState('')
  const [meta12Meses, setMeta12Meses] = useState('')
  const [observacoesComercial, setObservacoesComercial] = useState('')

  const [scores, setScores] = useState<Record<string, number | undefined>>({})
  const [storageReady, setStorageReady] = useState(false)

  const screens = useMemo(() => buildScreens(ehSocio), [ehSocio])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setStorageReady(true)
      return
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_ECE)
      if (!raw) {
        setStorageReady(true)
        return
      }
      const data = JSON.parse(raw) as EceDiagnosticoPersistedV1
      if (data.v !== 1 || !data.qual) {
        setStorageReady(true)
        return
      }
      const q = data.qual
      setNomeEmpresa(q.nomeEmpresa ?? '')
      setNomeResponsavel(q.nomeResponsavel ?? '')
      setCidadeEstado(q.cidadeEstado ?? '')
      setSegmento(q.segmento ?? '')
      setFaturamentoMensal(q.faturamentoMensal ?? '')
      setTempoSetorSolar(q.tempoSetorSolar ?? '')
      setNumFuncionarios(q.numFuncionarios ?? '')
      setEhSocio(q.ehSocio ?? '')
      setQuantosSocios(q.quantosSocios ?? '')
      setMaiorDesafio(q.maiorDesafio ?? '')
      setTreinamentoGestao(q.treinamentoGestao ?? '')
      setMeta12Meses(q.meta12Meses ?? '')
      setObservacoesComercial(q.observacoesComercial ?? '')
      prevEhSocio.current = q.ehSocio ?? ''
      const loadedScores: Record<string, number | undefined> = {}
      if (data.scores && typeof data.scores === 'object') {
        for (const [k, v] of Object.entries(data.scores)) {
          if (typeof v === 'number' && Number.isFinite(v)) loadedScores[k] = v
        }
      }
      setScores(loadedScores)
      setMostrarEscala(Boolean(data.mostrarEscala))
      const len = buildScreens(q.ehSocio ?? '').length
      const idx =
        typeof data.stepIndex === 'number' && Number.isFinite(data.stepIndex)
          ? Math.min(Math.max(0, Math.floor(data.stepIndex)), Math.max(0, len - 1))
          : 0
      setStepIndex(idx)
    } catch {
      // ignore JSON / storage errors
    } finally {
      setStorageReady(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !storageReady) return
    try {
      const scoresNum: Record<string, number> = {}
      for (const [k, v] of Object.entries(scores)) {
        if (typeof v === 'number' && Number.isFinite(v)) scoresNum[k] = v
      }
      const payload: EceDiagnosticoPersistedV1 = {
        v: 1,
        stepIndex,
        mostrarEscala,
        qual: {
          nomeEmpresa,
          nomeResponsavel,
          cidadeEstado,
          segmento,
          faturamentoMensal,
          tempoSetorSolar,
          numFuncionarios,
          ehSocio,
          quantosSocios,
          maiorDesafio,
          treinamentoGestao,
          meta12Meses,
          observacoesComercial,
        },
        scores: scoresNum,
      }
      window.localStorage.setItem(STORAGE_KEY_ECE, JSON.stringify(payload))
    } catch {
      // quota / private mode
    }
  }, [
    storageReady,
    stepIndex,
    mostrarEscala,
    nomeEmpresa,
    nomeResponsavel,
    cidadeEstado,
    segmento,
    faturamentoMensal,
    tempoSetorSolar,
    numFuncionarios,
    ehSocio,
    quantosSocios,
    maiorDesafio,
    treinamentoGestao,
    meta12Meses,
    observacoesComercial,
    scores,
  ])

  useEffect(() => {
    setStepIndex((i) => Math.min(i, Math.max(0, screens.length - 1)))
  }, [screens.length])

  useEffect(() => {
    const p = prevEhSocio.current
    if (p && p !== ehSocio) {
      if (p === 'sim' && ehSocio === 'nao') {
        setStepIndex((i) => (i > 8 ? i - 1 : i))
        setQuantosSocios('')
      }
      if (p === 'nao' && ehSocio === 'sim') {
        setStepIndex((i) => (i >= 8 ? i + 1 : i))
      }
    }
    prevEhSocio.current = ehSocio
  }, [ehSocio])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const bumpAnim = useCallback(() => {
    setAnimToken((t) => t + 1)
  }, [])

  const goNext = useCallback(() => {
    setErroPasso(null)
    setStepIndex((i) => Math.min(i + 1, screens.length - 1))
    bumpAnim()
  }, [screens.length, bumpAnim])

  const goBack = useCallback(() => {
    setErroPasso(null)
    setStepIndex((i) => Math.max(0, i - 1))
    bumpAnim()
  }, [bumpAnim])

  const setNotaEAvancar = useCallback(
    (id: string, valor: number) => {
      setScores((s) => ({ ...s, [id]: valor }))
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
      advanceTimer.current = setTimeout(() => {
        setStepIndex((i) => Math.min(i + 1, screens.length - 1))
        bumpAnim()
        advanceTimer.current = null
      }, 340)
    },
    [screens.length, bumpAnim],
  )

  const current = screens[stepIndex]
  const progressPct = screens.length > 0 ? ((stepIndex + 1) / screens.length) * 100 : 0

  const validarQualCampo = useCallback(
    (field: QualField): boolean => {
      const v = (s: string) => s.trim().length > 0
      switch (field) {
        case 'nomeEmpresa':
          return v(nomeEmpresa)
        case 'nomeResponsavel':
          return v(nomeResponsavel)
        case 'cidadeEstado':
          return v(cidadeEstado)
        case 'segmento':
          return v(segmento)
        case 'faturamentoMensal':
          return v(faturamentoMensal)
        case 'tempoSetorSolar':
          return v(tempoSetorSolar)
        case 'numFuncionarios':
          return v(numFuncionarios)
        case 'ehSocio':
          return !!ehSocio
        case 'quantosSocios':
          return ehSocio !== 'sim' || v(quantosSocios)
        case 'maiorDesafio':
          return v(maiorDesafio)
        case 'treinamentoGestao':
          return v(treinamentoGestao)
        case 'meta12Meses':
          return v(meta12Meses)
        case 'observacoesComercial':
          return true
        default:
          return false
      }
    },
    [
      nomeEmpresa,
      nomeResponsavel,
      cidadeEstado,
      segmento,
      faturamentoMensal,
      tempoSetorSolar,
      numFuncionarios,
      ehSocio,
      quantosSocios,
      maiorDesafio,
      treinamentoGestao,
      meta12Meses,
    ],
  )

  const avancarQual = () => {
    if (!current || current.kind !== 'qual') return
    if (!validarQualCampo(current.field)) {
      setErroPasso('Preencha este campo para continuar.')
      return
    }
    goNext()
  }

  const { valor: scoreGeral, mediasModulo } = useMemo(() => scoreGeralEmpresa(scores), [scores])
  const interpretacao = scoreGeral !== null ? interpretarScoreGeral(scoreGeral) : null
  const insightsFinais = useMemo(() => insightsFinaisRadar(mediasModulo), [mediasModulo])
  const radarSeries = useMemo(
    () =>
      mediasModulo.map((m) => ({
        subject: RADAR_LABEL_POR_MODULO[m.id] ?? m.titulo,
        score: Number(m.media.toFixed(2)),
      })),
    [mediasModulo],
  )

  const reiniciar = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY_ECE)
      } catch {
        // ignore
      }
    }
    setStepIndex(0)
    setErroPasso(null)
    setMostrarEscala(false)
    setScores({})
    setNomeEmpresa('')
    setNomeResponsavel('')
    setCidadeEstado('')
    setSegmento('')
    setFaturamentoMensal('')
    setTempoSetorSolar('')
    setNumFuncionarios('')
    setEhSocio('')
    setQuantosSocios('')
    setMaiorDesafio('')
    setTreinamentoGestao('')
    setMeta12Meses('')
    setObservacoesComercial('')
    prevEhSocio.current = ''
    bumpAnim()
  }

  const copiarResumo = async () => {
    if (scoreGeral === null || !interpretacao) return
    const linhas = [
      'RESUMO DO DIAGNÓSTICO ECE — Canal Solar',
      '',
      '--- Qualificação ---',
      `Empresa: ${nomeEmpresa}`,
      `Responsável: ${nomeResponsavel}`,
      `Cidade / Estado: ${cidadeEstado}`,
      `Segmento: ${segmento}`,
      `Faturamento mensal (aprox.): ${faturamentoMensal}`,
      `Tempo no setor solar: ${tempoSetorSolar}`,
      `Funcionários: ${numFuncionarios}`,
      `É sócio(a): ${ehSocio}${quantosSocios ? ` (${quantosSocios} sócios)` : ''}`,
      `Maior desafio: ${maiorDesafio}`,
      `Treinamento de gestão: ${treinamentoGestao}`,
      `Meta 12 meses: ${meta12Meses}`,
      observacoesComercial ? `Observações: ${observacoesComercial}` : '',
      '',
      '--- Scores por módulo ---',
      ...mediasModulo.map((m) => `${m.titulo}: ${m.media.toFixed(2)}`),
      '',
      `SCORE GERAL: ${scoreGeral.toFixed(2)}`,
      `Interpretação (${interpretacao.faixa}): ${interpretacao.rotulo}`,
      '',
      ...(insightsFinais
        ? [
            '--- Insights (radar) ---',
            `Ponto forte (${insightsFinais.pontoForte.titulo}, ${insightsFinais.pontoForte.media.toFixed(2)}): ${insightsFinais.pontoForte.texto}`,
            `Ponto de atenção (${insightsFinais.pontoFraco.titulo}, ${insightsFinais.pontoFraco.media.toFixed(2)}): ${insightsFinais.pontoFraco.texto}`,
            `Dispersão entre melhor e menor módulo: ${insightsFinais.dispersao.toFixed(2)}`,
          ]
        : []),
    ].filter(Boolean)
    try {
      await navigator.clipboard.writeText(linhas.join('\n'))
    } catch {
      // ignore
    }
  }

  const idsPerguntas = useMemo(() => listarIdsPerguntas(), [])

  const diagIndexInFlow = useMemo(() => {
    let n = 0
    for (let i = 0; i < stepIndex; i++) {
      if (screens[i]?.kind === 'diag') n++
    }
    return n
  }, [stepIndex, screens])

  const totalDiag = screens.filter((s) => s.kind === 'diag').length

  useEffect(() => {
    const s = screens[stepIndex]
    if (!s || s.kind !== 'diag') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setNotaEAvancar(s.pergunta.id, Number(e.key))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepIndex, screens, setNotaEAvancar])

  const handleQualTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    e.preventDefault()
    avancarQual()
  }

  const renderQualInput = (field: QualField) => {
    if (field === 'ehSocio') {
      return (
        <select
          className={inputClass}
          value={ehSocio}
          onChange={(e) => setEhSocio(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            if (ehSocio) {
              e.preventDefault()
              avancarQual()
            }
          }}
          autoFocus
        >
          <option value="" className="bg-slate-950">
            Selecione
          </option>
          <option value="sim" className="bg-slate-950">
            Sim
          </option>
          <option value="nao" className="bg-slate-950">
            Não
          </option>
        </select>
      )
    }
    if (field === 'quantosSocios') {
      return (
        <input
          className={inputClass}
          value={quantosSocios}
          onChange={(e) => setQuantosSocios(e.target.value)}
          placeholder="Ex.: 3 sócios"
          autoFocus
        />
      )
    }
    const long = ['maiorDesafio', 'meta12Meses', 'observacoesComercial'].includes(field)
    const common = { className: `${inputClass} ${long ? 'min-h-[120px]' : ''}`, autoFocus: true as const }
    switch (field) {
      case 'nomeEmpresa':
        return <input {...common} value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />
      case 'nomeResponsavel':
        return <input {...common} value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} />
      case 'cidadeEstado':
        return <input {...common} value={cidadeEstado} onChange={(e) => setCidadeEstado(e.target.value)} />
      case 'segmento':
        return <input {...common} value={segmento} onChange={(e) => setSegmento(e.target.value)} />
      case 'faturamentoMensal':
        return <input {...common} value={faturamentoMensal} onChange={(e) => setFaturamentoMensal(e.target.value)} />
      case 'tempoSetorSolar':
        return <input {...common} value={tempoSetorSolar} onChange={(e) => setTempoSetorSolar(e.target.value)} />
      case 'numFuncionarios':
        return <input {...common} value={numFuncionarios} onChange={(e) => setNumFuncionarios(e.target.value)} />
      case 'maiorDesafio':
        return (
          <textarea
            {...common}
            value={maiorDesafio}
            onChange={(e) => setMaiorDesafio(e.target.value)}
            onKeyDown={handleQualTextareaKeyDown}
          />
        )
      case 'treinamentoGestao':
        return <input {...common} value={treinamentoGestao} onChange={(e) => setTreinamentoGestao(e.target.value)} />
      case 'meta12Meses':
        return (
          <textarea
            {...common}
            value={meta12Meses}
            onChange={(e) => setMeta12Meses(e.target.value)}
            onKeyDown={handleQualTextareaKeyDown}
          />
        )
      case 'observacoesComercial':
        return (
          <textarea
            {...common}
            value={observacoesComercial}
            onChange={(e) => setObservacoesComercial(e.target.value)}
            onKeyDown={handleQualTextareaKeyDown}
            placeholder="Insights, objeções, perfil do lead..."
          />
        )
      default:
        return null
    }
  }

  const microInsights =
    current?.kind === 'micro' ? insightsMicroDia(current.diaIdx, scores) : null
  const microPct =
    microInsights && microInsights.mediaFase >= 1
      ? Math.min(100, Math.max(0, ((microInsights.mediaFase - 1) / 4) * 100))
      : 0

  const faseLabel = (idx: number) => {
    if (idx === 0) return 'Fase 1 · Identidade e estratégia'
    if (idx === 1) return 'Fase 2 · Expansão e operação'
    return 'Fase 3 · Ordem, finanças e equity'
  }

  return (
    <>
      <Helmet>
        <title>Diagnóstico ECE — Canal Solar</title>
        <meta
          name="description"
          content="Questionário de qualificação e diagnóstico dos 12 módulos ECE (Escale com Energia), com score e interpretação."
        />
      </Helmet>
      <div className="min-h-[100vh] bg-gradient-to-br from-primary-950 via-primary-900 to-black px-4 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <header className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Canal Solar" width={200} height={40} className="h-10 sm:h-12 w-auto" />
          </header>

          <div className="mb-6">
            <div className="flex justify-between items-end gap-3 mb-2">
              <span className="text-white/50 text-xs uppercase tracking-wider">Progresso</span>
              <span className="text-white/80 text-sm tabular-nums font-medium">
                {stepIndex + 1} / {screens.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-primary-400 to-emerald-400 transition-[width] duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Diagnóstico ECE</h1>
            <p className="text-white/55 text-sm mt-1">Escale com Energia · Canal Solar</p>
          </div>

          {erroPasso && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-100 text-sm">
              {erroPasso}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 sm:p-8 min-h-[320px] flex flex-col">
            {current?.kind === 'qual' && (
              <form
                key={`qual-${animToken}-${stepIndex}`}
                className="ece-animate-question flex-1 flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault()
                  avancarQual()
                }}
              >
                <p className="text-primary-300/90 text-xs font-medium uppercase tracking-wide mb-2">
                  Qualificação do lead
                </p>
                <h2 className="text-white text-lg sm:text-xl font-medium leading-snug mb-6">
                  {QUAL_LABELS[current.field].label}
                  {QUAL_LABELS[current.field].optional && (
                    <span className="text-white/45 font-normal text-base"> ({QUAL_LABELS[current.field].hint})</span>
                  )}
                </h2>
                <div className="flex-1">{renderQualInput(current.field)}</div>
                {['maiorDesafio', 'meta12Meses', 'observacoesComercial'].includes(current.field) && (
                  <p className="text-white/35 text-xs mt-2">Enter para OK · Shift+Enter para nova linha</p>
                )}
                <div className="mt-8 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={stepIndex === 0}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm border border-white/20 disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium border border-primary-400/30"
                  >
                    {current.field === 'observacoesComercial' && !observacoesComercial.trim()
                      ? 'Pular'
                      : 'OK'}
                  </button>
                </div>
              </form>
            )}

            {current?.kind === 'introDiag' && (
              <div key={`intro-diag-${animToken}`} className="ece-animate-question flex-1 flex flex-col">
                <p className="text-primary-300/90 text-xs font-medium uppercase tracking-wide mb-2">
                  Diagnóstico ECE
                </p>
                <h2 className="text-white text-xl sm:text-2xl font-semibold leading-snug mb-4">
                  Objetivo deste diagnóstico
                </h2>
                <div className="space-y-4 text-white/75 text-sm sm:text-base leading-relaxed flex-1">
                  <p>
                    Este questionário avalia <strong className="text-white/95 font-medium">o quanto a sua empresa está preparada para escalar</strong> no setor — de propósito e estratégia a vendas, operação e finanças.
                  </p>
                  <p>
                    Ao final, você verá um <strong className="text-white/95 font-medium">mapa em radar</strong> dos 12 módulos, o score geral e <strong className="text-white/95 font-medium">quais pontos merecem mais atenção</strong> para chegar ao objetivo de crescimento com mais previsibilidade e menos retrabalho.
                  </p>
                  <p className="text-white/55 text-sm">
                    Responda com sinceridade: não existem respostas certas ou erradas — o valor está em enxergar gaps e prioridades.
                  </p>
                </div>
                <div className="mt-8 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm border border-white/20"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium border border-primary-400/30"
                  >
                    Começar o diagnóstico
                  </button>
                </div>
              </div>
            )}

            {current?.kind === 'diag' && (
              <div key={`diag-${animToken}-${stepIndex}`} className="ece-animate-question flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3 text-[11px] sm:text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/75 border border-white/10">
                    {faseLabel(current.diaIdx)}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-100 border border-primary-400/25">
                    {current.modulo.tituloCompleto}
                  </span>
                  <span className="text-white/40 self-center">
                    Diagnóstico {diagIndexInFlow + 1}/{totalDiag}
                  </span>
                </div>

                {current.diaIdx === 0 &&
                  current.modulo.id === '1.1' &&
                  current.pergunta.id === '1.1.1' && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setMostrarEscala((v) => !v)}
                        className="text-sky-300/90 text-sm hover:underline"
                      >
                        {mostrarEscala ? 'Ocultar escala 1–5' : 'Ver escala de avaliação (1 a 5)'}
                      </button>
                      {mostrarEscala && (
                        <ul className="mt-3 space-y-1.5 text-white/65 text-xs sm:text-sm border border-white/10 rounded-xl p-3 bg-white/5">
                          {ESCALA_AVALIACAO_ECE.map((e) => (
                            <li key={e.valor}>
                              <span className="text-white font-semibold">{e.valor}</span> — {e.texto}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                <p className="text-white/50 font-mono text-xs mb-2">{current.pergunta.id}</p>
                <h2 className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-8">
                  {current.pergunta.texto}
                </h2>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNotaEAvancar(current.pergunta.id, n)}
                      className={`min-w-[52px] sm:min-w-[56px] px-4 py-3 rounded-xl border text-base font-semibold transition-all duration-200 ${
                        scores[current.pergunta.id] === n
                          ? 'bg-primary-500/50 border-primary-400/70 text-white scale-[1.02] shadow-lg shadow-primary-900/40'
                          : 'bg-white/5 border-white/15 text-white/90 hover:border-white/35 hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-white/35 text-xs mt-4">Dica: use as teclas 1 a 5 no teclado.</p>

                <div className="mt-8 flex justify-start">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm border border-white/20"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            )}

            {current?.kind === 'micro' && microInsights && (
              <div key={`micro-${animToken}-${stepIndex}`} className="ece-animate-micro flex-1 flex flex-col items-center text-center">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#eceGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * microPct) / 100}
                      className="transition-[stroke-dashoffset] duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="eceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white/50 text-[10px] uppercase tracking-wider">Média da fase</span>
                    <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                      {microInsights.mediaFase.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-primary-200/90 text-xs font-semibold uppercase tracking-wider mb-1">
                  {BLOCOS_DIAGNOSTICO_ECE[current.diaIdx].titulo}
                </p>
                <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">
                  {MICRO_COPY[current.diaIdx]?.titulo ?? 'Fase concluída'}
                </h2>
                <p className="text-white/65 text-sm max-w-md mb-8">{MICRO_COPY[current.diaIdx]?.subtitulo}</p>

                <div className="w-full grid sm:grid-cols-2 gap-3 text-left mb-8">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-emerald-200/90 text-xs font-medium uppercase mb-1">Ponto forte nesta fase</p>
                    <p className="text-white text-sm font-medium">{microInsights.melhor.titulo}</p>
                    <p className="text-emerald-100/80 text-lg font-bold tabular-nums mt-1">
                      {microInsights.melhor.media.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="text-amber-200/90 text-xs font-medium uppercase mb-1">Atenção / oportunidade</p>
                    <p className="text-white text-sm font-medium">{microInsights.atencao.titulo}</p>
                    <p className="text-amber-100/80 text-lg font-bold tabular-nums mt-1">
                      {microInsights.atencao.media.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm border border-white/20"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold border border-primary-400/30 shadow-lg shadow-primary-950/50"
                  >
                    {current.diaIdx < 2 ? 'Continuar diagnóstico' : 'Ver resultado final'}
                  </button>
                </div>
              </div>
            )}

            {current?.kind === 'micro' && !microInsights && (
              <div className="text-center py-8 text-white/70 text-sm">
                Não foi possível calcular o micro diagnóstico. Use Voltar e confira as respostas desta fase.
              </div>
            )}

            {current?.kind === 'resumo' && scoreGeral !== null && interpretacao && (
              <div key={`resumo-${animToken}`} className="ece-animate-question space-y-8">
                <div>
                  <h2 className="text-white font-semibold text-xl">Resumo do diagnóstico ECE</h2>
                  <p className="text-white/55 text-sm mt-1">Radar dos 12 módulos, interpretação geral e insights</p>
                </div>

                <div className={`rounded-xl border p-5 ${classeInterpretacao(interpretacao.cor)}`}>
                  <p className="text-sm opacity-90">Score geral da empresa</p>
                  <p className="text-4xl font-bold mt-1 tabular-nums">{scoreGeral.toFixed(2)}</p>
                  <p className="text-sm mt-3">
                    <span className="opacity-80">Faixa: {interpretacao.faixa}</span>
                  </p>
                  <p className="text-base mt-2 font-medium">{interpretacao.rotulo}</p>
                </div>

                <DiagnosticoEceRadarChart data={radarSeries} />

                {insightsFinais && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">Insights do diagnóstico</h3>
                    <p className="text-white/45 text-xs">
                      Com base nas médias por módulo: maior destaque e maior oportunidade de evolução.
                      <span className="block mt-1">
                        Amplitude entre melhor e menor módulo:{' '}
                        <span className="text-white/70 tabular-nums">{insightsFinais.dispersao.toFixed(2)}</span>
                        {insightsFinais.dispersao < 0.5 && ' — perfil bastante equilibrado entre áreas.'}
                      </span>
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-5 text-left">
                        <p className="text-emerald-300/95 text-xs font-semibold uppercase tracking-wide mb-2">
                          Ponto forte
                        </p>
                        <p className="text-white font-medium text-base mb-1">{insightsFinais.pontoForte.titulo}</p>
                        <p className="text-emerald-200/90 text-2xl font-bold tabular-nums mb-3">
                          {insightsFinais.pontoForte.media.toFixed(2)}
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed">{insightsFinais.pontoForte.texto}</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-5 text-left">
                        <p className="text-amber-300/95 text-xs font-semibold uppercase tracking-wide mb-2">
                          Ponto de atenção
                        </p>
                        <p className="text-white font-medium text-base mb-1">{insightsFinais.pontoFraco.titulo}</p>
                        <p className="text-amber-200/90 text-2xl font-bold tabular-nums mb-3">
                          {insightsFinais.pontoFraco.media.toFixed(2)}
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed">{insightsFinais.pontoFraco.texto}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-white/70 text-sm font-medium mb-3">Tabela por módulo</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {mediasModulo.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 flex justify-between items-center gap-2"
                      >
                        <span className="text-white/85 text-sm">{m.titulo}</span>
                        <span className="text-white font-semibold tabular-nums">{m.media.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/80 text-sm font-medium mb-2">Interpretação do score geral</p>
                  <ul className="text-white/65 text-xs space-y-2">
                    <li>1,0 – 2,0 — Crítico — empresa sem estrutura básica de gestão</li>
                    <li>2,1 – 3,0 — Atenção — várias áreas em fase inicial</li>
                    <li>3,1 – 3,9 — Em desenvolvimento — boas bases, mas gaps importantes</li>
                    <li>4,0 – 4,5 — Bom — empresa bem estruturada, refinamentos necessários</li>
                    <li>4,6 – 5,0 — Referência — gestão de alto nível</li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copiarResumo}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium border border-primary-400/30"
                  >
                    Copiar resumo
                  </button>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/20"
                  >
                    Novo diagnóstico
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-white/35 text-xs mt-8">
            {idsPerguntas.length} itens · fluxo tipo Typeform · micro diagnósticos ao fim de cada fase
          </p>
        </div>
      </div>
    </>
  )
}
