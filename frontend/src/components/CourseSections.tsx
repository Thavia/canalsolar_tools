type Testimonial = {
  quote: string
  name: string | null
  title: string | null
  company: string | null
  image: string | null
}

type VideoItem = {
  src: string
  title: string
}

export function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  return (
    <section className="mx-auto px-6 py-14">
      <style>
        {`
          @keyframes testimonial-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <div className="mt-8 overflow-hidden px-6 py-8">
        <div
          className="flex w-max gap-6"
          style={{
            animation: 'testimonial-scroll 32s linear infinite',
          }}
        >
          {[...items, ...items].map((testimonial, index) => (
            <div
              key={`${testimonial.name ?? 'depo'}-${index}`}
              className="w-56 shrink-0 rounded-2xl bg-slate-950/40 p-4 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.9)]"
            >
              <div className="overflow-hidden rounded-xl border border-white/10">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={`Depoimento de ${testimonial.name ?? 'aluno'}`}
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
  )
}

export function VideosSection({
  title,
  subtitle,
  videos,
}: {
  title: string
  subtitle: string
  videos: VideoItem[]
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-4 text-sm text-white/70">{subtitle}</p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.src}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.9)]"
          >
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <iframe
                src={video.src}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CouponBanner({
  message,
  buttonText,
  href,
}: {
  message: string
  buttonText: string
  href: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_70px_-45px_rgba(15,23,42,0.9)]">
        <div className="text-sm text-white/70">{message}</div>
        <a
          href={href}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
        >
          {buttonText}
        </a>
      </div>
    </section>
  )
}

export function PricingSection({
  id,
  eyebrow,
  title,
  description,
  installmentText,
  upfrontText,
  ctaText,
  ctaHref,
  badges,
}: {
  id?: string
  eyebrow: string
  title: string
  description: string
  installmentText: string
  upfrontText: string
  ctaText: string
  ctaHref: string
  badges?: string[]
}) {
  const defaultBadges = [
    'Acesso imediato',
    'Pagamento seguro',
    'Garantia de 7 dias',
    'Suporte na plataforma',
  ]
  const badgeItems = badges?.length ? badges : defaultBadges
  const badgeIcons = [
    <svg key="time" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v10l4 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>,
    <svg key="lock" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>,
    <svg key="shield" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>,
    <svg key="support" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>,
  ]

  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.9)]">
        <div className="text-xs uppercase tracking-[0.3em] text-white/50">{eyebrow}</div>
        <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm text-white/70">{description}</p>
        <div className="mt-6 text-3xl font-semibold">{installmentText}</div>
        <div className="mt-2 text-sm text-white/70">{upfrontText}</div>
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
        >
          {ctaText}
        </a>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-white/60">
          {badgeItems.map((label, index) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              {badgeIcons[index % badgeIcons.length]}
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FloatingCouponBanner({
  message,
  buttonText,
  href,
  className,
}: {
  message: string
  buttonText: string
  href: string
  className?: string
}) {
  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur ${className ?? ''}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">{message}</div>
        <a
          href={href}
          className="inline-flex items-center justify-center rounded-lg bg-red-500 px-5 py-2  font-semibold text-white transition hover:bg-red-400"
        >
          {buttonText}
        </a>
      </div>
    </div>
  )
}

export function FaqSection({
  title,
  items,
}: {
  title: string
  items: { question: string; answer: string }[]
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
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
  )
}

export function ValueGridSection({
  id,
  title,
  subtitle,
  items,
  afterText,
  highlightText,
  ctaText,
  ctaHref,
}: {
  id?: string
  title: string
  subtitle: string
  items: { title: string; text: string }[]
  afterText?: string
  highlightText?: string
  ctaText: string
  ctaHref: string
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.75)]">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="mt-4 text-lg text-white/70">{subtitle}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/60">
                  ●
                </span>
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <p className="mt-3 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
        {afterText ? (
          <p className="mt-8 text-sm text-white/70">{afterText}</p>
        ) : null}
        {highlightText ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-base text-white/80">
            <span className="inline-flex items-center gap-2 font-semibold text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {highlightText}
            </span>
          </div>
        ) : null}
        <div className="mt-6 text-center">
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  )
}

export function AboutCanalSolarSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.9)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-left">
            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">Sobre o Canal Solar</div>
            <h2 className="mt-3 text-2xl font-semibold">
              Maior plataforma multicanais de energias renováveis do mundo
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Autoridade que forma profissionais e move o mercado. O Canal Solar conecta informação, educação e
              indústria, assumindo responsabilidade real pela capacitação que o setor precisa.
            </p>
            <div className="mt-6 text-xs text-white/50">
              <img
                src="https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp"
                alt="Canal Solar"
                width={200}
                height={40}
                className="h-10 w-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/60 to-transparent px-8 py-10 text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">Público único</div>
              <div className="mt-4 text-5xl font-semibold text-white sm:text-6xl">
                +26
                <span className="align-top text-xl font-semibold text-white/70 sm:text-2xl"> milhões</span>
              </div>
              <div className="mt-3 text-sm text-white/70">
                Pessoas impactadas com conteúdo técnico e educativo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FooterCopyright() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center">
        <img
          src="https://cursos.canalsolar.com.br/wp-content/uploads/2025/03/CANAL-EDUCACIONAL-LOGO-VERSAO-2.png"
          alt="Canal Solar Educacional"
          width={200}
          height={40}
          className="h-10 w-auto"
          loading="lazy"
          decoding="async"
        />
        <div className="text-sm text-white/70">2026 © DIREITOS RESERVADOS</div>
        <div className="text-xs text-white/60">CNPJ: 59.832.151/0001-59</div>
      </div>
    </footer>
  )
}
