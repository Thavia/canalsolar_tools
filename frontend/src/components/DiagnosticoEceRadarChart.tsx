import { useEffect, useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export type RadarDatum = { subject: string; score: number }

type Props = {
  data: RadarDatum[]
  className?: string
}

function ChartBody({ data }: { data: RadarDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={340}>
      <RadarChart cx="50%" cy="52%" outerRadius="72%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.12)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'rgba(255,255,255,0.72)', fontSize: 10 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tickCount={6}
          tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 9 }}
          axisLine={false}
          stroke="rgba(255,255,255,0.15)"
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(15, 21, 56, 0.95)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#fff',
          }}
          formatter={(value) => {
            const n = typeof value === 'number' ? value : Number(value)
            return [Number.isFinite(n) ? n.toFixed(2) : '—', 'Score']
          }}
          labelFormatter={(label) => String(label)}
        />
        <Radar
          name="Média do módulo"
          dataKey="score"
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.32}
          strokeWidth={2}
          dot={{ r: 3, fill: '#7dd3fc', strokeWidth: 0 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default function DiagnosticoEceRadarChart({ data, className = '' }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || data.length === 0) {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 min-h-[340px] flex items-center justify-center text-white/45 text-sm ${className}`}
      >
        Carregando gráfico…
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-b from-sky-950/40 to-black/20 p-2 sm:p-4 ${className}`}>
      <p className="text-center text-white/70 text-sm font-medium mb-1">Perfil por módulo (1 a 5)</p>
      <p className="text-center text-white/40 text-xs mb-2">Quanto mais próximo da borda externa, melhor a avaliação média</p>
      <div className="h-[min(380px,70vw)] w-full max-w-xl mx-auto">
        <ChartBody data={data} />
      </div>
    </div>
  )
}
