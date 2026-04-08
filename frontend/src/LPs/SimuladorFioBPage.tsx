import { useEffect, useMemo, useState } from 'react';
import { tarifaFioBService, FioBData } from '../services/tarifaFioBService';
import SearchableSelect from '../components/SearchableSelect';
import { Helmet } from '../utils/helmet';
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

function getCookieValue(name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
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
  const [perfil, setPerfil] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [faturamento, setFaturamento] = useState('');
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
    const sessentaPctFioB = 0.6 *  valor;
    const tarifaTotal = selectedData.tusd_te;

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
    
    if (!nome || !whatsapp || !email || !selectedArea || !perfil) {
      setSubmitError('Por favor, preencha todos os campos.');
      return;
    }

    if (perfil === 'Integrador' && (!empresa || !cargo || !faturamento)) {
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
      const payload = {
        identifier: 'simulador_fiob',
        name: nome,
        email: email,
        phone: whatsappNumbers,
        area_de_concessao: selectedArea,
        perfil: perfil,
        empresa: perfil === 'Integrador' ? empresa : '',
        cargo: perfil === 'Integrador' ? cargo : '',
        faturamento: perfil === 'Integrador' ? faturamento : '',
        pagina_conversao: 'Simulador Fio B',
        traffic_source: getCookieValue('__trf.src') || ''
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
            <div className="text-white text-2xl sm:text-3xl font-semibold">Impacto do Fio B na Tarifa de Energia</div>
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
                      <label className="block text-xs text-white/60 mb-1">Concessionária de energia *</label>
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

                    <div>
                      <label className="block text-xs text-white/60 mb-1">Eu sou *</label>
                      <select
                        value={perfil}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setPerfil(nextValue);
                          if (nextValue !== 'Integrador') {
                            setEmpresa('');
                            setCargo('');
                            setFaturamento('');
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                        disabled={submitting}
                        required
                      >
                        <option value="" className="bg-slate-950 text-white">Selecione uma opção</option>
                        <option value="Integrador" className="bg-slate-950 text-white">Integrador</option>
                        <option value="Consumidor Final" className="bg-slate-950 text-white">Consumidor Final</option>
                      </select>
                    </div>

                    {perfil === 'Integrador' && (
                      <>
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Nome da empresa *</label>
                          <input
                            type="text"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            placeholder="Nome da empresa"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                            disabled={submitting}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 mb-1">Qual o seu cargo na empresa? *</label>
                          <select
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                            disabled={submitting}
                            required
                          >
                            <option value="" className="bg-slate-950 text-white">Selecione uma opção</option>
                            <option value="Sócio ou Fundador" className="bg-slate-950 text-white">Sócio ou Fundador</option>
                            <option value="Diretor" className="bg-slate-950 text-white">Diretor</option>
                            <option value="Gerente" className="bg-slate-950 text-white">Gerente</option>
                            <option value="Coordenador" className="bg-slate-950 text-white">Coordenador</option>
                            <option value="Supervisor" className="bg-slate-950 text-white">Supervisor</option>
                            <option value="Analista" className="bg-slate-950 text-white">Analista</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 mb-1">
                            E qual o faturamento anual da sua empresa? *
                          </label>
                          <select
                            value={faturamento}
                            onChange={(e) => setFaturamento(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/50"
                            disabled={submitting}
                            required
                          >
                            <option value="" className="bg-slate-950 text-white">Selecione uma opção</option>
                            <option value="Ainda não faturamos" className="bg-slate-950 text-white">Ainda não faturamos</option>
                            <option value="Até R$250 mil ao ano" className="bg-slate-950 text-white">Até R$250 mil ao ano</option>
                            <option value="De R$250 mil a R$500 mil ao ano" className="bg-slate-950 text-white">
                              De R$250 mil a R$500 mil ao ano
                            </option>
                            <option value="De R$500 mil a R$1 milhão ao ano" className="bg-slate-950 text-white">
                              De R$500 mil a R$1 milhão ao ano
                            </option>
                            <option value="De R$1 milhão a R$5 milhões ao ano" className="bg-slate-950 text-white">
                              De R$1 milhão a R$5 milhões ao ano
                            </option>
                            <option value="De R$5 a R$10 milhões ao ano" className="bg-slate-950 text-white">
                              De R$5 a R$10 milhões ao ano
                            </option>
                            <option value="De R$10 a R$50 milhões ao ano" className="bg-slate-950 text-white">
                              De R$10 a R$50 milhões ao ano
                            </option>
                          </select>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={
                        submitting ||
                        !nome ||
                        !whatsapp ||
                        !email ||
                        !selectedArea ||
                        !perfil ||
                        (perfil === 'Integrador' && (!empresa || !cargo || !faturamento))
                      }
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
                {formSubmitted && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-primary-600/10 to-primary-800/10 border border-primary-400/20 rounded-xl">
                    <div className="text-white text-sm font-semibold mb-3 text-center">
                      📊 Resultado da Simulação
                    </div>
                    <div className="text-white/70 text-xs mb-4 text-center">
                      Concessionária de energia: <span className="font-semibold">{selectedArea}</span>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-white/60 mb-2">Trocar área de concessão</label>
                      <SearchableSelect
                        value={selectedArea}
                        onChange={(newArea) => {
                          setSelectedArea(newArea);
                          // Recalculará automaticamente via useMemo quando selectedArea mudar
                        }}
                        options={areas.map((a) => ({ value: a, label: a }))}
                        placeholder="Selecione outra área de concessão…"
                        disabled={loading}
                        searchable
                        allowClear={false}
                      />
                      <div className="text-white/40 text-xs mt-2 text-center">
                        Os dados serão recalculados automaticamente ao trocar a área
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Impacto de 60% do Fio B */}
                  <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-400/30 rounded-xl p-6">
                    <div className="text-center">
                      <div className="text-white/60 text-sm mb-2">Impacto de 60% do Fio B na Tarifa Total (2026)</div>
                      <div className="text-white/60 text-sm mb-2">Os calculos foram arredondados em duas casas decimais</div>
                      <div className="text-white text-6xl font-bold tracking-tight">
                        {formatPct(calculatedValues?.pctSessentaFioBNaTarifa)}
                      </div>
                      <div className="text-white text-sm mb-2">
                
                        </div>
                    </div>
                  </div>

                  {/* E-book Download Section */}
                  <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-600/30 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">📚</div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        Entenda a teoria completa
                      </h3>
                      <p className="text-white/80 text-sm mb-4">
                        Agora que você viu o impacto na prática, baixe gratuitamente o e-book do Canal Solar e entenda toda a teoria sobre o Fio B na Geração Distribuída em 2026.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📖</div>
                        <p className="text-white/70 text-sm">Como funciona a cobrança</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <p className="text-white/70 text-sm">Impacto na sua conta</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">⚖️</div>
                        <p className="text-white/70 text-sm">Regime de transição</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        onClick={() => window.open('https://canalsolar.com.br/wp-content/uploads/2026/01/Ebook-FIo-B_Final_v5.pdf', '_blank')}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                      >
                        📥 DOWNLOAD E-BOOK
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs  tracking-wider mb-3">VALORES (R$ / KWh)</div>
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
                        <div className="text-white/60 text-xs">TE</div>
                        <div className="text-white text-lg font-semibold">{formatCurrency(selectedData.te / 1000)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">60% do Fio B na TUSD</div>
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
                      setPerfil('');
                      setEmpresa('');
                      setCargo('');
                      setFaturamento('');
                      setSubmitSuccess(false);
                      setSubmitError(null);
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors duration-200"
                  >
                    🔄 Nova simulação completa
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
            <img
              src="https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp"
              alt="CANAL SOLAR"
              width={200}
              height={40}
              className="h-10 w-auto mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}





