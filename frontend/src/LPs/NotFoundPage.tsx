import { Helmet } from '../utils/helmet'
import { FooterCopyright } from '../components/CourseSections'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Página não encontrada | Canal Solar</title>
        <meta name="description" content="Página não encontrada. Acesse os cursos do Canal Solar." />
      </Helmet>
      <div className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20">
          <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/60 to-transparent p-10 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.85)]">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">Erro 404</div>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Esta página não foi encontrada
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
              O endereço pode ter sido alterado ou não existe mais. Você pode voltar para a área
              de cursos e continuar sua navegação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://cursos.canalsolar.com.br/cursos"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
              >
                Ver cursos disponíveis
              </a>
            </div>
          </div>
       
      
        <FooterCopyright />
        </section>
      </div>
     
    </>
  )
}
