import { useEffect, useRef, useState } from 'react'
import { Helmet } from '../utils/helmet'
import heroBackground from '../assets/bg_curso_homer_sam.webp'
import {
  AboutCanalSolarSection,
  FooterCopyright,
  FaqSection,
  PricingSection,
  TestimonialsSlider,
  ValueGridSection,
  VideosSection,
  FloatingCouponBanner,
} from '../components/CourseSections'

const checkoutUrl = 'https://checkout.canalsolar.com.br/checkout/homer-202602-curso-homer-e-sam'
const certificateImageUrl =
  'https://cursos.canalsolar.com.br/wp-content/uploads/2025/04/certificado-LP-6.webp'

const targetAudience = [
  'Engenheiros eletricistas',
  'Projetistas de sistemas solares e híbridos',
  'Profissionais que atuam com BESS',
  'Consultores energéticos',
  'Integradores que querem atuar em projetos maiores',
  'Profissionais que querem elevar o nível técnico e financeiro dos seus projetos',
]

const notForYou = [
  'Quem busca conteúdo introdutório ou superficial.',
  'Quem não pretende atuar com projetos de simulação energética.',
  'Quem evita análise técnica e econômica baseada em dados.',
]

const formatAccessItems = [
  'Online gravado, com conteúdo disponível 24/7.',
  'Acesso por 12 meses.',
  'Estudo no próprio ritmo.',
  'Tira dúvidas na plataforma.',
  'Acesso no celular pelo app do Canal Solar ou no computador.',
  'Certificado e materiais de apoio.',
]

const modules = [
  {
    title: 'Módulo 1 · Fundamentos de Simulação Energética',
    subtitle: 'Conceitos-base para modelagem correta de sistemas híbridos',
    application: 'Base conceitual para construção de modelos energéticos consistentes.',
    items: [
      'Introdução à modelagem e simulação de sistemas energéticos',
      'Conceitos de otimização aplicados a sistemas FV e armazenamento',
      'Principais parâmetros de medição e fontes de dados',
      'Irradiância, temperatura e perfis de carga',
    ],
  },
  {
    title: 'Módulo 2 · Indicadores Técnicos e Econômicos',
    subtitle: 'Como interpretar desempenho e viabilidade de projetos',
    application: 'Leitura crítica de resultados técnicos e econômicos para tomada de decisão.',
    items: [
      'Indicadores técnicos: PR, geração de energia, eficiência, SOC, DOD e C-Rate',
      'Indicadores econômicos: LCOE, LCOS, TIR, ROI e Payback',
      'Relação entre operação, desempenho e retorno financeiro',
    ],
  },
  {
    title: 'Módulo 3 · Conhecendo o Software SAM',
    subtitle: 'Estrutura, lógica e tipos de projetos',
    application: 'Entendimento da ferramenta antes do dimensionamento.',
    items: [
      'Instalação e interface do NREL System Advisor Model (SAM)',
      'Tipos de projetos: fotovoltaico e armazenamento',
      'Estrutura de dados e organização dos projetos',
      'Fórum e documentação do SAM',
    ],
  },
  {
    title: 'Módulo 4 · Dimensionamento de Sistemas de Armazenamento com SAM',
    subtitle: 'Modelagem detalhada de sistemas FV + BESS',
    application: 'Dimensionamento técnico-econômico completo no SAM.',
    items: [
      'Bases solarimétricas e dados de entrada (TMY, satélite, resolução temporal)',
      'Estrutura de arquivos CSV compatíveis com o SAM',
      'Importação de módulos e inversores',
      'Tipos de baterias: eficiência vs ciclos',
      'Estratégias de controle e operação',
      'Configuração de sistemas FV e perfis de carga',
      'Parâmetros de inversores, perdas e eficiência',
      'Análise de produção, perdas e desempenho horário',
      'Avaliação econômica',
    ],
  },
  {
    title: 'Módulo 5 · Estudos de Casos Práticos com SAM',
    subtitle: 'Simulações reais e análise de cenários',
    application: 'Avaliação de cenários reais e impacto operacional.',
    items: [
      'Análise de sensibilidade e otimização de dimensionamento',
      'Sistema comercial com tarifação horária dinâmica (1,4 MWp – Time Shifting)',
      'Simulação com demanda de 500 kW (Time Shifting + Peak Shaving)',
      'Sistema off-grid 100% (FV + BESS)',
    ],
  },
  {
    title: 'Módulo 6 · Conhecendo o Software HOMER',
    subtitle: 'Estrutura, lógica de otimização e diferenças de versão',
    application: 'Entendimento da lógica de otimização do HOMER.',
    items: [
      'Diferença entre HOMER Grid e HOMER Pro',
      'Instalação, interface e estrutura de dados',
      'Configuração inicial de projetos',
    ],
  },
  {
    title: 'Módulo 7 · Dimensionamento de Sistemas de Armazenamento com HOMER',
    subtitle: 'Modelagem avançada de sistemas híbridos e microrredes',
    application: 'Construção de modelos híbridos completos no HOMER.',
    items: [
      'Importação e exportação de perfis de carga e dados climáticos',
      'Configuração de tarifas de energia elétrica',
      'Modelagem de fontes: FV, diesel e baterias',
      'Importação de dados de geração do PVSyst',
    ],
  },
  {
    title: 'Módulo 8 · Estudos de Casos Práticos com HOMER',
    subtitle: 'Comparação de estratégias e resultados',
    application: 'Escolha da ferramenta e da estratégia correta para cada tipo de projeto.',
    items: [
      'Sistema comercial com tarifação horária (1,4 MWp – Time Shifting)',
      'Simulação com demanda de 500 kW (Time Shifting + Peak Shaving)',
      'Sistema com microrrede (FV + BESS + Diesel)',
      'Exportação de relatórios e interpretação de resultados técnicos e financeiros',
      'Comparação de resultados: SAM × HOMER',
    ],
  },
]

const testimonials = [
  {
    quote: 'Apostila do curso foi realmente uma bíblia',
    name: 'Luiz Cláudio',
    title: 'CEO',
    company: 'Viridian Ecoenergia',
    image: null,
  },
  {
    quote: 'Melhor curso que já vi no mercado',
    name: 'Paulo Henrique',
    title: 'Engenheiro',
    company: 'MANSERV',
    image: 'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Paulo-Henrique-1.webp',
  },
  {
    quote: 'Melhor curso que já vi no mercado',
    name: 'Paulo Henrique',
    title: 'Engenheiro',
    company: 'MANSERV',
    image: 'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Jose-Marcos-1.webp',
  },
  {
    quote: 'Fiz todos os cursos do Canal Solar!',
    name: 'Charley Alves',
    title: 'CEO',
    company: 'Ecotop Energia Renovaveis LTDA',
    image: null,
  },
  {
    quote: '',
    name: null,
    title: null,
    company: null,
    image: 'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Rafael-1.webp',
  },
  {
    quote: '',
    name: null,
    title: null,
    company: null,
    image: 'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/Henrique-copiar.webp',
  },
  {
    quote: 'Eu comprei 5 cursos para meus funcionários',
    name: 'Elieser Bastos',
    title: 'Engenheiro Eletricista',
    company: 'Agro Comercial Afubra',
    image: null,
  },
  {
    quote: '',
    name: null,
    title: null,
    company: null,
    image: 'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Luiz-Saunders-1.webp',
  },
]

const faqItems = [
  {
    question: 'O curso é ao vivo ou gravado?',
    answer:
      'O curso é online e ao vivo, com aulas transmitidas em tempo real conforme o cronograma divulgado. Após as aulas, o conteúdo fica gravado para revisão dentro do período de acesso.',
  },
  {
    question: 'Por quanto tempo o acesso fica disponível?',
    answer:
      'O acesso fica disponível por 12 meses, permitindo que você estude no seu próprio ritmo, reveja aulas e aprofunde os conteúdos conforme sua necessidade profissional.',
  },
  {
    question: 'Existe certificação?',
    answer:
      'Sim. Após a conclusão da formação, você realiza um teste de certificação para validação do conhecimento adquirido e emissão do certificado.',
  },
  {
    question: 'Preciso ter experiência prévia com HOMER ou SAM?',
    answer:
      'Não é obrigatório. O curso começa pelos fundamentos de simulação energética e apresenta a estrutura e lógica de cada software antes de avançar para os estudos de caso. No entanto, é recomendado ter base técnica em energia elétrica ou fotovoltaica.',
  },
  {
    question: 'O curso é focado apenas em simulação?',
    answer:
      'Não. O foco é modelagem correta, interpretação de resultados e tomada de decisão técnica e econômica, utilizando HOMER e SAM como ferramentas de apoio — não como fim.',
  },
  {
    question: 'Os estudos de caso são reais?',
    answer:
      'Sim. Os estudos de caso envolvem cenários reais de sistemas comerciais, off-grid, microrredes, time shifting e peak shaving, com análise técnica e financeira completa.',
  },
  {
    question: 'Posso assistir no celular?',
    answer:
      'Sim. O acesso é liberado tanto pelo app do Canal Solar quanto pelo computador, permitindo acompanhar as aulas de onde preferir.',
  },
  {
    question: 'O curso é indicado para quem?',
    answer:
      'Engenheiros, projetistas, consultores e profissionais do setor elétrico que precisam avaliar viabilidade técnica e econômica de sistemas híbridos e com armazenamento, com segurança e critério.',
  },
  {
    question: 'Terei suporte durante o curso?',
    answer:
      'Sim. Durante as aulas ao vivo, você pode tirar dúvidas diretamente com os instrutores, além de acessar os materiais e interagir conforme a dinâmica do curso.',
  },
]

export default function CursoHomerSamPage() {
  const modulesSectionRef = useRef<HTMLElement | null>(null)
  const [showFloatingCta, setShowFloatingCta] = useState(false)

  useEffect(() => {
    const target = modulesSectionRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFloatingCta(true)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return (
    <>
    <Helmet>
        <title>Curso Homer & Sam - Canal Solar Educacional</title>
      <meta name="description" content="Aprenda a simular projetos de energia solar com baterias de verdade com os softwares Homer & Sam" />
      <meta name="keywords" content="Homer, Sam, energia solar, baterias, simulação, projetos, cursos, educação, energia" />
      <meta name="author" content="Canal Solar Educacional" />
    </Helmet>
    <div className="min-h-screen bg-slate-950 text-white">
      <style>
        {`
          @keyframes hero-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <section
        className="bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 13, 30, 0.95), rgba(9, 13, 30, 0.65)), url('${heroBackground}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="border-b border-white/10 bg-slate-950/70">
          <div className="overflow-hidden">
            <div
              className="flex w-max gap-10 whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70"
              style={{ animation: 'hero-marquee 18s linear infinite' }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index}>ONLINE AO VIVO DE 9 A 12 DE FEVEREIRO</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-white/50">CURSO HOMER & SAM</div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">

                <span className="block text-white/80">Aprenda
                  a simular projetos de energia solar com baterias de verdade com os softwares Homer & Sam</span>
              </h1>

              <div className="mt-6 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70">
                Apenas 50 vagas disponíveis
              </div>
              <div className="mt-8 mb-4 items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#conhecer-curso"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
                >
                  QUERO CONHECER O CURSO
                </a>
                <div className="text-sm mt-3 text-white/60">Aproveite a condição especial de lançamento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ValueGridSection
        id="conhecer-curso"
        title="Do modelo técnico à decisão econômica"
        subtitle="Você vai aprender a analisar projetos de geração solar, sistemas híbridos e soluções com BESS considerando:"
        items={[
          {
            title: 'Tipologias de aplicação',
            text: 'Backup, microrredes, off-grid, time shifting e peak shaving.',
          },
          {
            title: 'Indicadores técnicos',
            text: 'PR, eficiência, SOC, DOD, perdas e desempenho horário.',
          },
          {
            title: 'Indicadores econômicos',
            text: 'VPL, TIR, payback, LCOE e LCOS.',
          },
          {
            title: 'Estratégias de operação',
            text: 'Cenários de uso que mudam completamente o resultado do projeto.',
          },
          {
            title: 'Decisão baseada em dados',
            text: 'Simulações como suporte técnico e econômico em decisões reais.',
          },
          {
            title: 'Aplicações de alto impacto',
            text: 'Projetos próprios, consultorias, viabilidade e apresentações.',
          },
        ]}
        afterText="O objetivo não é só rodar simulações, mas usar esses estudos como apoio técnico e econômico em decisões de alto impacto — seja em projetos próprios, consultorias, estudos de viabilidade ou apresentações para investidores e clientes."
        ctaText="MÓDULOS DO CURSO"
        ctaHref="#modulos"
      />


      <TestimonialsSlider items={testimonials} />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Para quem é o curso</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {targetAudience.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 text-lg" aria-hidden="true">
                    ✅
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-base font-semibold">Para quem não é o curso</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {notForYou.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 text-lg" aria-hidden="true">
                    ❌
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

     
      <section ref={modulesSectionRef} id="modulos" className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Módulos do curso</h2>
            <p className="mt-2 text-sm text-white/60">8 módulos · 16 horas ao vivo · 12 meses de acesso</p>
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">FORMAÇÃO TÉCNICA ORIENTADA À DECISÃO</div>
        </div>
        <div className="mt-6 space-y-3">
          {modules.map((module) => (
            <details
              key={module.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.9)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white/90">{module.title}</div>
                  {module.subtitle ? (
                    <div className="mt-1 text-xs text-white/60">{module.subtitle}</div>
                  ) : null}
                </div>
                <span className="text-white/60 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {module.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {module.application ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                  <span className="font-semibold text-white/80">Aplicação prática:</span> {module.application}
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_70px_-45px_rgba(15,23,42,0.9)]">
          <p className="text-sm text-white/70">
            Entre para o nível profissional do setor energético aprendendo com softwares globalmente
            usados para simulação energética avançada.
          </p>
        </div>
      </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">📅 Cronograma de aulas ao vivo</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>• 09/02 segunda - 18:30 às 22:30</li>
              <li>• 10/02 terça - 18:30 às 22:30</li>
              <li>• 11/02 quarta - 18:30 às 22:30</li>
              <li>• 12/02 quinta - 18:30 às 22:30</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-300" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 3.5a8.54 8.54 0 0 0-7.43 12.73L3 21l4.95-1.58a8.54 8.54 0 1 0 4.09-15.92Zm4.98 12.08c-.2.56-1.16 1.03-1.78 1.16-.42.08-.97.14-1.58-.06-.37-.12-.85-.27-1.47-.54-2.58-1.12-4.27-3.76-4.4-3.93-.12-.18-1.05-1.4-1.05-2.67s.66-1.9.9-2.16c.24-.26.53-.33.71-.33h.51c.17 0 .4-.05.63.48.24.56.82 2.01.89 2.15.07.14.12.3.02.48-.1.18-.15.3-.3.46-.15.16-.32.36-.45.48-.15.15-.31.31-.13.61.18.3.8 1.32 1.72 2.14 1.19 1.06 2.19 1.38 2.5 1.53.31.15.5.12.69-.08.2-.2.8-.93 1.02-1.25.22-.32.44-.27.75-.16.31.12 1.98.93 2.32 1.1.34.17.57.25.65.39.08.14.08.8-.12 1.36Z" />
                </svg>
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">WhatsApp</span>
            </div>
            <h3 className="text-base font-semibold text-white">Não consegue acompanhar ao vivo?</h3>
            <p className="mt-3">
              As gravações ficam disponíveis por 6 meses e grupo de tira dúvidas no WhatsApp com seus professores.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Certificação Canal Solar: Conquiste a Credibilidade no Mercado Solar!
            </h2>
            <p className="mt-4 text-sm text-white/75">
              A Certificação Canal Solar atesta seu domínio das melhores práticas em energia solar.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              <div>
                <span className="font-semibold text-white">Como funciona?</span> Após a conclusão da Formação, você terá
                acesso a um teste de certificação para validar seus conhecimentos.
              </div>
              <div>
                <span className="font-semibold text-white">Aprovado?</span> Seu desempenho será reconhecido com um
                certificado que valida suas competências técnicas e profissionais.
              </div>
              <div>
                <span className="font-semibold text-white">Seja um profissional de referência:</span> A Certificação é
                o selo de qualidade que impulsiona sua carreira e atrai as melhores oportunidades!
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.9)]">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
              <img
                src={certificateImageUrl}
                alt="Certificação Canal Solar"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="w-full px-6 py-14"
        style={{
          backgroundImage:
            "url('https://cursos.canalsolar.com.br/wp-content/uploads/2025/02/LP-cursos-comunidade-educacional-copiar-1.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: 'cover',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Online e gravado</h2>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {formatAccessItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-4 w-2 rounded-full bg-secondary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <VideosSection
        title="Saiba o que falam sobre o Canal Solar Educacional"
        subtitle="Os depoimentos refletem a nossa missão: formar profissionais preparados para fortalecer o setor, assumir novos desafios e encontrar espaço para crescer."
        videos={[
          {
            src: 'https://www.youtube.com/embed/vcuZjiLe3ls',
            title: 'Adrissamara Guirra - Sublime Sola',
          },
          {
            src: 'https://www.youtube.com/embed/S2F603NlBUA',
            title: 'Charley - CEO DA ECOTOP',
          },
          {
            src: 'https://www.youtube.com/embed/lXrjF54jO-w',
            title: 'Flavio Salviano - Solar Prime',
          },
        ]}
      />

      <PricingSection
        eyebrow="COMECE AGORA"
        title="Acesso imediato ao curso completo"
        description="Liberação automática após o pagamento"
        installmentText="12x de R$ 97,90"
        upfrontText="ou R$ 979,00 à vista"
        ctaText="Comprar agora"
        ctaHref={checkoutUrl}
        badges={[
          'Acesso imediato',
          'Pagamento seguro',
          'Garantia de 7 dias',
          'Suporte na plataforma',
        ]}
      />

      <FaqSection title="FAQ" items={faqItems} />

      <AboutCanalSolarSection />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_70px_-45px_rgba(15,23,42,0.9)]">
          <h2 className="text-2xl font-semibold">Pronto para elevar seu nível técnico?</h2>
          <p className="mt-3 text-sm text-white/70">
            Treinamento prático com softwares globais para simulação energética avançada.
          </p>
          <a
            href={checkoutUrl}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
          >
            Garantir minha vaga
          </a>
        </div>
      </section>
 
      <FloatingCouponBanner
        message="Cupom HOMER10 • 10% de desconto comprando agora"
        buttonText="Aplicar cupom e comprar"
        href={checkoutUrl}
        className={`transition-transform transition-opacity duration-700 ease-out ${
          showFloatingCta ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      /> 

      <FooterCopyright />
    </div>
    </>
  

  )
}