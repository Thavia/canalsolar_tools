import { useEffect, useMemo, useState } from 'react';
import { tarifaFioBService, FioBData } from '../services/tarifaFioBService';
import SearchableSelect from './SearchableSelect';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

function formatPct(n: number | null | undefined) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function formatCurrency(n: number | null | undefined) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatWhatsApp(value: string): string {
  const numbers = value.replace(/\D/g, '');
  const limited = numbers.slice(0, 11);
  
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 11) {
    const ddd = limited.slice(0, 2);
    const firstPart = limited.slice(2, limited.length - 4);
    const lastPart = limited.slice(limited.length - 4);
    return `(${ddd}) ${firstPart}-${lastPart}`;
  }
  
  return limited;
}

function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  };
}

export default function SimuladorFioBPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FioBData[]>([]);

  const [selectedArea, setSelectedArea] = useState<string>('');

  // Form states
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tarifaFioBService.list();
      setData(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const areas = useMemo(() => {
    return data.map((item) => item.sigla).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [data]);

  const selectedData = useMemo(() => {
    if (!selectedArea) return null;
    return data.find((item) => item.sigla === selectedArea) || null;
  }, [data, selectedArea]);

  // Calcular percentuais dinamicamente
  const calculatedValues = useMemo(() => {
    if (!selectedData) return null;

    const valor = selectedData.valor;
    const tusd = selectedData.tusd;
    const sessentaPctFioB = selectedData.sessenta_pct_fio_b;

    const tarifaTotal = selectedData.pct_fio_b_na_tarifa > 0 
      ? (valor / selectedData.pct_fio_b_na_tarifa) * 100 
      : tusd;

    const pctFioBNaTarifa = tarifaTotal > 0 ? (valor / tarifaTotal) * 100 : 0;
    const pctFioBNaTusd = tusd > 0 ? (valor / tusd) * 100 : 0;
    const pctSessentaFioBNaTusd = tusd > 0 ? (sessentaPctFioB / tusd) * 100 : 0;
    const pctSessentaFioBNaTarifa = tarifaTotal > 0 ? (sessentaPctFioB / tarifaTotal) * 100 : 0;

    return {
      pctFioBNaTarifa: Number(pctFioBNaTarifa.toFixed(2)),
      pctFioBNaTusd: Number(pctFioBNaTusd.toFixed(2)),
      pctSessentaFioBNaTusd: Number(pctSessentaFioBNaTusd.toFixed(2)),
      pctSessentaFioBNaTarifa: Number(pctSessentaFioBNaTarifa.toFixed(2)),
      tarifaTotal,
    };
  }, [selectedData]);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !whatsapp || !email || !selectedArea) {
      setSubmitError('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError('Por favor, insira um e-mail válido.');
      return;
    }

    const whatsappNumbers = whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10) {
      setSubmitError('Por favor, insira um WhatsApp válido.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const utmParams = getUTMParams();
      
      const payload = {
        identifier: 'simulador_fiob',
        Nome: nome,
        'E-mail': email,
        WhatsApp: whatsappNumbers,
        'Área de concessão': selectedArea,
        area_de_concessao: selectedArea,
        'Página de conversão': 'Simulador Fio B',
        Cargo: '',
        'Há quanto tempo atua no setor fotovoltaico?': '',
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
      };

      await axios.post(
        'https://workflow.softeo.com.br/webhook/8494e5c6-fba5-4870-841d-ba4354ede405',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSubmitSuccess(true);
      setFormSubmitted(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Erro ao enviar lead:', err);
      setSubmitError('Erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Simulador Fio B - Canal Solar</title>
      </Helmet>
      <div className="min-h-[100vh] bg-gradient-to-br from-primary-950 via-primary-900 to-black flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="text-center">
            <div className="text-white text-2xl sm:text-3xl font-semibold">Fio B na Tarifa de Energia</div>
            <div className="text-white/60 text-sm mt-2">Base de dados ANEEL</div>          
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 backdrop-blur p-5 sm:p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-100 text-sm">
                {error}
              </div>
            )}

            {!formSubmitted ? (
              <div className="mt-6">
                <div className="p-6 bg-gradient-to-br from-primary-600/10 to-primary-800/10 border border-primary-400/20 rounded-xl">
                  <div className="text-white text-xl font-semibold mb-3 text-center">
                    📊 Veja o impacto do Fio B na sua região
                  </div>
                  <div className="text-white/70 text-sm mb-6 text-center">
                    Preencha o formulário abaixo para ver o impacto do Fio B na sua região
                  </div>

                  {submitSuccess && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-100 text-sm text-center">
                      ✅ Dados enviados com sucesso! Carregando resultados...
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-100 text-sm text-center">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Área de concessão *</label>
                      <SearchableSelect
                        value={selectedArea}
                        onChange={setSelectedArea}
                        options={areas.map((a) => ({ value: a, label: a }))}
                        placeholder={loading ? 'Carregando…' : 'Selecione uma área de concessão…'}
                        disabled={loading || submitting}
                        searchable
                        allowClear
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/60 mb-1">Nome completo *</label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/60 mb-1">WhatsApp *</label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={handleWhatsAppChange}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/60 mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !nome || !whatsapp || !email || !selectedArea}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      {submitting ? 'Enviando...' : 'Ver resultados completos'}
                    </button>

                    <div className="text-white/40 text-xs text-center">
                      Ao enviar, você concorda em receber comunicações do Canal Solar
                    </div>
                  </form>
                </div>
              </div>
            ) : selectedData ? (
              <div className="mt-6">
                <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-400/30 rounded-xl p-6 mb-6">
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-2">% de 60% do Fio B na Tarifa Total (2026)</div>
                    <div className="text-white text-6xl font-bold tracking-tight">
                      {formatPct(calculatedValues?.pctSessentaFioBNaTarifa)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs uppercase tracking-wider mb-3">Valores (R$ / KWh)</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-white/60 text-xs">Valor do Fio B</div>
                        <div className="text-white text-lg font-semibold">{formatCurrency(selectedData.valor / 1000)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">TUSD</div>
                        <div className="text-white text-lg font-semibold">{formatCurrency(selectedData.tusd / 1000)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">60% do Fio B</div>
                        <div className="text-white text-lg font-semibold">
                          {formatCurrency(selectedData.sessenta_pct_fio_b / 1000)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs uppercase tracking-wider mb-3">Percentuais</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-white/60 text-xs">% do Fio B na Tarifa Total</div>
                        <div className="text-white text-lg font-semibold">
                          {formatPct(calculatedValues?.pctFioBNaTarifa)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">% do Fio B na TUSD</div>
                        <div className="text-white text-lg font-semibold">
                          {formatPct(calculatedValues?.pctFioBNaTusd)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">% de 60% do Fio B na TUSD</div>
                        <div className="text-white text-lg font-semibold">
                          {formatPct(calculatedValues?.pctSessentaFioBNaTusd)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:col-span-2">
                    <div className="text-white/50 text-xs uppercase tracking-wider mb-3">Custo de Referência</div>
                    <div>
                      <div className="text-white/60 text-xs">Quanto custa o Fio B a cada 100 kWh</div>
                      <div className="text-white text-2xl font-semibold mt-1">
                        {formatCurrency(selectedData.custo_fio_b_100kwh)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Sobre os dados</div>
                  <div className="text-white/60 text-xs leading-relaxed">
                    Esta página utiliza dados da ANEEL extraídos em 08/01/2026. Os valores representam a componente
                    Fio B da TUSD para cada área de concessão de energia
                    elétrica do Brasil. O percentual de 60% do Fio B representa a parcela não compensável de energia injetada em 
                    sistemas de geração distribuída a partir de 2026.
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setSelectedArea('');
                      setNome('');
                      setWhatsapp('');
                      setEmail('');
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors duration-200"
                  >
                    🔄 Nova consulta
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-center text-sm text-red-400">Distribuidora não encontrada.</div>
            )}
          </div>

          <div className="mt-4 text-center text-white/40 text-xs">
            Última atualização: 08 de janeiro de 2026
          </div>

          <div className="mt-4 text-center text-white/40 text-center">  
            <img src="https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp" alt="CANAL SOLAR" className="h-10 w-auto mx-auto" />
          </div>
        </div>
      </div>
    </>
  );
}

