import { useEffect, useRef, useState } from 'react';
import { Helmet } from '../utils/helmet';
import { AboutCanalSolarSection, FooterCopyright, PricingSection } from '../components/CourseSections';

const checkoutUrl = 'https://checkout.canalsolar.com.br/checkout/hidrogenio-verde';

const heroImageUrl =
  'https://cursos.canalsolar.com.br/wp-content/uploads/2024/02/LP-Hidrogenio-Verde-copiar.webp';
const certificateImageUrl =
  'https://cursos.canalsolar.com.br/wp-content/uploads/2025/04/certificado-LP-6.webp';
const logoUrl =
  'https://cursos.canalsolar.com.br/wp-content/uploads/2025/03/CANAL-EDUCACIONAL-LOGO-VERSAO-5.png';


  const heroTitle = 'Atue na transição energética com foco em Hidrogênio Verde';
  const heroDescription = 'Curso Hidrogênio Verde: Tecnologias, Custos e Transição Energética do Brasil. Conteúdo técnico para decisões de investimento, viabilidade e projetos reais.';
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
    image:
      'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Paulo-Henrique-1.webp',
  },
  {
    quote: 'Melhor curso que já vi no mercado',
    name: 'Paulo Henrique',
    title: 'Engenheiro',
    company: 'MANSERV',
    image:
      'https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Jose-Marcos-1.webp',
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
    image:  "https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Rafael-1.webp",
  },  {
    quote: '',
    name: null,
    title: null,
    company: null,
    image:  "https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/Henrique-copiar.webp",
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
    image:  "https://cursos.canalsolar.com.br/wp-content/uploads/2024/01/AnyConv.com__Luiz-Saunders-1.webp",
  },
];

const targetAudience = [
  'Engenheiros eletricistas, mecânicos, de produção e áreas correlatas.',
  'Profissionais atuantes no setor elétrico, energético e industrial.',
  'Gestores técnicos, gestores industriais e líderes de projetos energéticos.',
  'Consultores de energia, sustentabilidade e descarbonização.',
  'Estudantes avançados, pós-graduandos e pesquisadores com base técnica sólida.',
  'Profissionais que analisam viabilidade técnica e econômica de projetos energéticos.',
  'Quem precisa entender custos, CAPEX, OPEX e LCOH aplicados ao hidrogênio verde.',
  'Profissionais que desejam se posicionar tecnicamente em transição energética e H2V.',
  'Quem busca aumentar renda, empregabilidade ou senioridade técnica no setor de energia.',
  'Profissionais interessados em aplicações reais do H2V na indústria, logística, siderurgia, fertilizantes e exportação.',
  'Quem quer impacto prático e decisões baseadas em dados.'
];

const notForYou = [
  'Quem busca conteúdo introdutório ou explicações superficiais.',
  'Quem não possui base técnica mínima em energia, engenharia ou indústria.',
  'Quem espera um curso motivacional ou conceitual sem números e análises.',
  'Quem não pretende atuar ou se aprofundar em transição energética.',
  'Quem busca soluções rápidas ou promessas fáceis de mercado.',
  'Quem não tem interesse em analisar custos, viabilidade econômica ou riscos.',
  'Quem procura um curso genérico apenas para “ter um certificado”.'
];
const curriculum = [
  {
    title: 'Módulo 1 · Fundamentos do Hidrogênio Verde',
    subtitle: 'Conceitos-base e visão de mercado',
    application: 'Base para decisões técnicas e visão estratégica do setor.',
    items: [
      'Introdução ao curso',
      'Hidrogênio Verde: conceitos e definições',
      'O hidrogênio no mercado de energia',
      'Panorama do mercado de hidrogênio',
      'Aplicações não energéticas do hidrogênio',
      'Questionário – Módulo I',
    ],
  },
  {
    title: 'Módulo 2 · Rotas Tecnológicas',
    subtitle: 'Comparativo de tecnologias de produção',
    application: 'Suporte para escolha técnica de rota produtiva.',
    items: [
      'Rotas tecnológicas de produção de hidrogênio',
      'Questionário – Módulo II',
    ],
  },
  {
    title: 'Módulo 3 · Custos e Viabilidade Econômica',
    subtitle: 'Custos, preço e viabilidade',
    application: 'Base para análises de CAPEX, OPEX e LCOH.',
    items: [
      'Custos de produção do hidrogênio',
      'Questionário – Módulo III',
    ],
  },
  {
    title: 'Módulo 4 · Brasil, Sistema Elétrico e Expansão Energética',
    subtitle: 'Contexto energético brasileiro',
    application: 'Entendimento da demanda e expansão do sistema.',
    items: [
      'Panorama do parque gerador brasileiro',
      'Necessidade de contratação de energia',
      'Premissas para expansão do sistema',
      'Expansão indicativa',
      'Questionário – Módulo IV',
    ],
  },
  {
    title: 'Módulo 5 · Hidrogênio Verde e Sustentabilidade',
    subtitle: 'Descarbonização e aplicações',
    application: 'Base para decisões ambientais e setoriais.',
    items: [
      'Revisão dos conceitos de hidrogênio verde',
      'Importância ambiental e descarbonização',
      'Aplicações do hidrogênio verde – Parte I',
      'Aplicações do hidrogênio verde – Parte II',
      'Questionário – Módulo V',
    ],
  },
  {
    title: 'Módulo 6 · Eletrolisadores',
    subtitle: 'Tecnologias, custos e critérios técnicos',
    application: 'Critérios práticos para seleção de tecnologia.',
    items: [
      'Introdução aos eletrolisadores',
      'Tecnologias de eletrolisadores – Parte I',
      'Tecnologias de eletrolisadores – Parte II',
      'Tecnologias de eletrolisadores – Parte III',
      'Estrutura de custos dos eletrolisadores',
      'Questionário – Módulo VI',
    ],
  },
  {
    title: 'Módulo 7 · Transporte e Armazenamento',
    subtitle: 'Logística e infraestrutura',
    application: 'Avaliação logística e segurança do projeto.',
    items: [
      'Fundamentos de transporte e armazenamento',
      'Transporte por dutos',
      'Transporte por navios',
      'Armazenamento de hidrogênio verde',
      'Questionário – Módulo VII',
    ],
  },
  {
    title: 'Módulo 8 · Hidrogênio Verde no Mundo',
    subtitle: 'Tendências globais e Brasil',
    application: 'Benchmarking internacional e oportunidades.',
    items: [
      'Europa',
      'Estados Unidos',
      'Exportação de hidrogênio verde',
      'Mercado atual no Brasil',
      'Questionário – Módulo VIII',
    ],
  },
  {
    title: 'Módulo 9 · Políticas Públicas',
    subtitle: 'Regulação e incentivos',
    application: 'Leitura estratégica de políticas para projetos.',
    items: [
      'Políticas públicas aplicadas ao hidrogênio verde',
      'Questionário – Módulo IX',
    ],
  },
  {
    title: 'Módulo 10 · Potencial Técnico de Produção',
    subtitle: 'Estimativas e limites de produção',
    application: 'Avaliação técnica de capacidade produtiva.',
    items: [
      'Avaliação do potencial técnico de produção',
      'Questionário – Módulo X',
    ],
  },
  {
    title: 'Módulo 11 · Principais Atores e Mercado Potencial',
    subtitle: 'Stakeholders e demanda',
    application: 'Mapeamento de atores e oportunidades.',
    items: [
      'Principais atores do mercado',
      'Mercado potencial do hidrogênio verde',
      'Questionário – Módulo XI',
    ],
  },
  {
    title: 'Módulo 12 · Projetos Atuais',
    subtitle: 'Projetos em desenvolvimento',
    application: 'Referências reais para comparação.',
    items: [
      'Projetos de hidrogênio verde em desenvolvimento',
      'Questionário – Módulo XII',
    ],
  },
  {
    title: 'Módulo 13 · Crédito de Carbono e Hidrogênio Verde',
    subtitle: 'Receitas ambientais e integração',
    application: 'Integração com instrumentos de carbono.',
    items: [
      'Integração entre crédito de carbono e hidrogênio verde',
      'Questionário – Módulo XIII',
    ],
  },
  {
    title: 'Módulo 14 · Estudos de Caso',
    subtitle: 'Casos brasileiros relevantes',
    application: 'Lições práticas para projetos nacionais.',
    items: [
      'Ceará e energia renovável',
      'Porto de Pecém e hidrogênio verde',
      'Questionário – Módulo XIV',
    ],
  },
  {
    title: 'Módulo 15 · Fontes de Energia Offshore',
    subtitle: 'Bases e aplicação no Brasil',
    application: 'Integração com fontes offshore.',
    items: [
      'Fundamentos das fontes offshore',
      'Energia offshore aplicada ao Brasil',
      'Questionário – Módulo XV',
    ],
  },
  {
    title: 'Módulo 16 · Hidrogênio Verde e Planejamento Energético',
    subtitle: 'Planejamento de longo prazo',
    application: 'Visão sistêmica para planejamento energético.',
    items: [
      'Planejamento energético – Parte I',
      'Planejamento energético – Parte II',
      'Questionário – Módulo XVI',
    ],
  },
  {
    title: 'Módulo 17 · Críticas e Desafios',
    subtitle: 'Riscos e limitações',
    application: 'Antecipação de riscos e barreiras.',
    items: [
      'Limitações, riscos e desafios do hidrogênio verde',
      'Questionário – Módulo XVII',
    ],
  },
  {
    title: 'Módulo 18 · Encerramento',
    subtitle: 'Síntese e feedback',
    application: 'Consolidação do aprendizado.',
    items: [
      'Resumo geral do curso',
      'Pesquisa de satisfação',
    ],
  },
];

const bonusItems = [
  'Certificação Canal Solar com prova de validação técnica.',
  'Apostila digital e artigos técnicos exclusivos.',
  'Testes por módulo para reforço do aprendizado.',
  'Acesso ao app do Canal Solar para estudo no celular.',
  'Acesso ao chat para tirar dúvidas com os professores.',
  'Acesso a comunidade para compartilhar experiências e conhecimentos.',
  'Participação em programas de recompensas dos alunos do canal solar',
  'Possibilidade de contar seu case de sucesso ao vivo no Podcast Papo Solar'
];

const formatAccessItems = [
  'Online gravado, com conteúdo disponível 24/7.',
  'Acesso por 12 meses.',
  'Estudo no próprio ritmo.',
  'Tira dúvidas na plataforma.',
  'Acesso no celular pelo app do Canal Solar ou no computador.',
  'Exercícios por módulo para fixação do aprendizado.',
];

const faqItems = [
  {
    question: 'Quais tecnologias e rotas de produção são abordadas?',
    answer:
      'O curso cobre eletrolisadores alcalino, PEM e SOEC, além de rotas logísticas, armazenamento e aplicações industriais.',
  },
  {
    question: 'O curso é adequado para quem precisa avaliar viabilidade econômica?',
    answer:
      'Sim. Há foco em custos, LCOH e impacto do preço de energia, além de critérios técnicos para decisão.',
  },
  {
    question: 'Por quanto tempo o acesso fica disponível?',
    answer: 'O acesso fica disponível por 12 meses, com estudo no próprio ritmo.',
  },
  {
    question: 'Existe certificação?',
    answer:
      'Sim. Após concluir a formação, você realiza o teste de certificação para validar o conhecimento.',
  },
  {
    question: 'Posso assistir no celular?',
    answer: 'Sim. O acesso é liberado no app do Canal Solar e também no computador.',
  },
];

export default function CursoOnlineHidrogenioVerdePage() {
  const modulesSectionRef = useRef<HTMLElement | null>(null);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const target = modulesSectionRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFloatingCta(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Curso Hidrogênio Verde | Tecnologias, Custos e Transição no Brasil</title>
        <meta
          name="description"
          content="Curso online gravado sobre hidrogênio verde: tecnologias, custos, mercado e regulação no Brasil. 12h, acesso por 12 meses, testes por módulo e apostila técnica."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white pb-28">
        <section
          className="bg-gradient-to-br from-primary-950 via-primary-900 to-slate-100"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(9, 13, 30, 0.92), rgba(9, 13, 30, 0)), url('${heroImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-center justify-between">
              <img
                src={logoUrl}
                alt="Canal Solar Educacional"
                width={140}
                height={28}
                className="h-5 w-auto"
              />            
            </div>
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{heroTitle}</h1>
                <p className="mt-4 text-base text-white/70 sm:text-lg">
                {heroDescription}
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    href="#conhecer-o-curso"
                    className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
                  >
                    Conhecer o curso
                  </a>
                  <div className="text-sm text-white/60">Acesso imediato • Pagamento seguro • 7 dias de garantia</div>
                </div>
              </div>
            
            </div>
          </div>
        </section>

        <section id="conhecer-o-curso" className="mx-auto max-w-6xl px-6 py-7">
          <div className="p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.75)]">
            <div className="text-center">
              <h2 className="text-3xl font-semibold">
                Capacitação técnica para atuar com hidrogênio verde no Brasil
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Adquira o conhecimento essencial para avaliar custos, viabilidade e aplicações do H₂V em diferentes
                setores da economia brasileira.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 20h16" />
                    <path d="M7 16V8" />
                    <path d="M12 16V4" />
                    <path d="M17 16v-6" />
                  </svg>
                  <span className="text-sm font-semibold">Rotas tecnológicas</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Compare alcalina, PEM e SOEC e os impactos em <strong>CAPEX</strong>, <strong>OPEX</strong> e eficiência.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19h16" />
                    <path d="M6 16V8" />
                    <path d="M10 16V6" />
                    <path d="M14 16v-4" />
                    <path d="M18 16V9" />
                  </svg>
                  <span className="text-sm font-semibold">LCOH e sensibilidade</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Aprenda a calcular <strong>LCOH</strong> e testar energia elétrica, fator de capacidade e financiamento.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20" />
                    <path d="M5 12h14" />
                    <path d="M7 5c4 4 6 10 10 14" />
                  </svg>
                  <span className="text-sm font-semibold">Logística completa</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Compressão, liquefação, amônia/LOHC, armazenamento e transporte.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M9 21V9h6v12" />
                  </svg>
                  <span className="text-sm font-semibold">Aplicações industriais</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Viabilidade em siderurgia, fertilizantes, refino e mobilidade pesada.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l-1 18H7L6 3z" />
                    <path d="M9 7h6" />
                  </svg>
                  <span className="text-sm font-semibold">Regulação e políticas</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Interprete políticas públicas, certificações e exigências regulatórias.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                <div className="flex items-center gap-3 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16" />
                    <path d="M7 6v12" />
                    <path d="M17 6v12" />
                    <path d="M7 18h10" />
                  </svg>
                  <span className="text-sm font-semibold">Mercado brasileiro</span>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  Avalie custos, projetos e demanda do H₂V no Brasil.
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-base text-white/80">
              <span className="inline-flex items-center gap-2 font-semibold text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Curso ideal para engenheiros, analistas e profissionais da área energética que buscam uma formação
                técnica sólida e melhores oportunidades no mercado de trabalho.
              </span>
            </div>
            <div className="mt-6 text-center">
              <a
                href="#para-quem"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
              >
               MÓDULOS DO CURSO
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto  px-6 py-14">
          <div className="mt-8 overflow-hidden px-6 py-8">
            <div
              className="flex w-max gap-6"
              style={{
                animation: 'testimonial-scroll 32s linear infinite',
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="w-56 shrink-0 rounded-2xl  bg-slate-950/40 p-4 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.9)]"
                >
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={`Depoimento de ${testimonial.name}`}
                        className="aspect-[9/16] w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="aspect-[9/16] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4">
                        <div className="flex h-full flex-col justify-between">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">Depoimento</div>
                          <div className="text-sm font-semibold text-white/90">“{testimonial.quote}”</div>
                          <div className="text-[11px] text-white/70">
                            <div className="font-semibold text-white">{testimonial.name}</div>
                            <div>{testimonial.title}</div>
                            <div>{testimonial.company}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="para-quem" className="mx-auto max-w-6xl px-6 py-14 scroll-mt-20">
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

    

        <section ref={modulesSectionRef} className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Módulos do curso</h2>
              <p className="mt-2 text-sm text-white/60">
                18 módulos · 60 aulas · 12 meses de acesso
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">O MAIS COMPLETO DO MERCADO</div>
          </div>
          <div className="mt-6 space-y-3">
            {curriculum.map((module) => (
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
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
             
              <ul className="mt-6 space-y-3  text-white/80">
                {bonusItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
                <ul className="space-y-3 text-sm text-white/80">
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

        <PricingSection
          id="comprar"
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

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Saiba o que falam sobre o Canal Solar Educacional</h2>
            <p className="mt-4 text-sm text-white/70">
              Os depoimentos refletem a nossa missão: formar profissionais preparados para fortalecer o setor,
              assumir novos desafios e encontrar espaço para crescer.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.9)]">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/vcuZjiLe3ls"
                  title="Depoimento Canal Solar Educacional 1"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.9)]">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/S2F603NlBUA"
                  title="Depoimento Canal Solar Educacional 2"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.9)]">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/lXrjF54jO-w"
                  title="Depoimento Canal Solar Educacional 3"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <summary className="cursor-pointer text-sm font-semibold text-white/90">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm text-white/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <AboutCanalSolarSection />

        <FooterCopyright />

        <div
          className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur transition-all duration-500 ease-out ${
            showFloatingCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Cupom <span className="font-semibold text-white">H2V</span> • 10% de desconto comprando agora
            </div>
            <a
              href={checkoutUrl}
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary-400"
            >
              RESGATAR CUPOM DE DESCONTO
            </a>
          </div>
        </div>
      </div>
    </>
  );
}


