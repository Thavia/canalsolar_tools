import { Helmet } from '../utils/helmet';
import capaEbook from '../assets/capa_ebook_fiob.webp';
import topoEbook from '../assets/topo_ebook_fiob.webp';

export default function LandingPage() {
  const handleGoToCalculator = () => {
    window.location.href = '/calculadora';
  };

  return (
    <>
      <Helmet>
        <title>E-book Gratuito Fio B - Canal Solar</title>
        <meta name="description" content="Baixe gratuitamente o e-book sobre Fio B na Geração Distribuída em 2026. Entenda como a cobrança funciona e calcule o impacto na sua conta de energia." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-black">
        {/* Header with Logo */}
        <header className="relative z-50 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto flex justify-center">
            <img 
              src="https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp" 
              alt="CANAL SOLAR" 
              width={200}
              height={40}
              className="h-12 w-auto" 
            />
          </div>
        </header>

        {/* Hero Section - E-book */}
        <section className="relative overflow-hidden">
          {/* Background com padrão de painéis solares */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzE1MWQ0NyIvPjxwYXRoIGQ9Ik0wIDUwaDEwME01MCAwaDUwIiBzdHJva2U9IiMyYTNhOGIiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Book Images */}
              <div className="relative">
                <div className="relative z-10">
                  {/* Physical Book */}
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-2xl"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                      {/* Book Cover - Using real image */}
                      <div className="aspect-[3/4] rounded-lg relative overflow-hidden">
                        <img 
                          src={capaEbook} 
                          alt="Capa do E-book Fio B na Geração Distribuída" 
                          width={900}
                          height={1200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Book spine (visible on the left) */}
                      <div className="absolute -left-4 top-6 bottom-6 w-4 bg-white rounded-l-lg shadow-lg flex items-center">
                        <div className="transform -rotate-90 origin-center whitespace-nowrap">
                          <span className="text-[8px] font-bold text-slate-700">FIO B NA GERAÇÃO DISTRIBUÍDA EM 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tablet overlay */}
                  <div className="absolute top-12 right-0 w-72 transform rotate-[8deg] opacity-95 hidden lg:block">
                    <div className="bg-black rounded-2xl p-3 shadow-2xl">
                      <div className="aspect-[3/4] rounded-lg relative overflow-hidden">
                        <img 
                          src={capaEbook} 
                          alt="E-book Fio B no tablet" 
                          width={900}
                          height={1200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Content */}
              <div className="text-center lg:text-left">
                <div className="inline-block bg-red-600/20 border border-red-600/30 rounded-full px-4 py-2 mb-6">
                  <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">E-BOOK GRATUITO</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Fio B na Geração Distribuída
                </h1>
                
                <h2 className="text-2xl sm:text-3xl font-semibold text-white/90 mb-6">
                  Sua conta de energia vai mudar em 2026?
                </h2>
                
                <p className="text-lg text-white/80 mb-4 leading-relaxed">
                  Em 2026 consumidores com energia solar enquadrados como GD2 passam a pagar <span className="font-bold text-red-400">60% do Fio B</span> sobre a energia compensada.
                </p>
                
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Entenda a teoria completa no e-book do Canal Solar e depois calcule, na prática, quanto essa cobrança vai pesar no seu bolso.
                </p>
                
                <button
                  onClick={handleGoToCalculator}
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🧮 Calcule seu Fio B e ganhe o e-book
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section - O que está acontecendo com o Fio B? */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${topoEbook})`,
            }}
          >
            {/* Overlay para melhorar legibilidade */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              O que está acontecendo com o Fio B?
            </h2>
            
            <div className="bg-primary-900 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 mb-8">
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                Com a <span className="font-semibold text-primary-400">Lei nº 14.300/2022</span>, o modelo de compensação de energia mudou.
              </p>
              
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Quem não tem direito adquirido entra em um regime de transição, no qual:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-lg text-white/90">
                    O Fio B deixa de ser totalmente compensado
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-lg text-white/90">
                    A cobrança aumenta ano a ano
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-lg text-white/90">
                    Em 2026, <span className="font-bold text-red-400">60% do Fio B</span> passa a ser pago diretamente na fatura
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section - Teoria e Prática */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-primary-900/50 to-primary-950/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-6">
              Entenda a teoria e calcule na prática
            </h2>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* E-book - Teoria */}
                <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-600/30 rounded-xl p-6">
                  <div className="text-5xl mb-4 text-center">📚</div>
                  <h3 className="text-white font-bold text-xl mb-3 text-center">E-book Gratuito</h3>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Entenda a teoria completa sobre o Fio B na Geração Distribuída em 2026
                  </p>
                  <ul className="text-white/70 text-sm space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✓</span>
                      <span>Como funciona a cobrança do Fio B</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✓</span>
                      <span>Impacto na sua conta de energia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✓</span>
                      <span>Regime de transição explicado</span>
                    </li>
                  </ul>
                  <div className="text-center text-white/60 text-xs italic">
                    Disponível após calcular seu Fio B
                  </div>
                </div>
                
                {/* Calculadora - Prática */}
                <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-600/30 rounded-xl p-6">
                  <div className="text-5xl mb-4 text-center">🧮</div>
                  <h3 className="text-white font-bold text-xl mb-3 text-center">Calculadora de Fio B</h3>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Calcule na prática o impacto do Fio B na sua região
                  </p>
                  <ul className="text-white/70 text-sm space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400">✓</span>
                      <span>Simule por região de concessão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400">✓</span>
                      <span>Veja valores e percentuais reais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-400">✓</span>
                      <span>Dados atualizados da ANEEL</span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <button
                      onClick={handleGoToCalculator}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Calcular agora
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-800/30 border border-primary-600/20 rounded-xl p-6 text-center">
                <p className="text-white/90 text-lg mb-4">
                  <span className="font-semibold">Complete a calculadora</span> e ganhe acesso ao <span className="font-semibold text-red-400">e-book gratuito</span> com toda a teoria sobre o Fio B
                </p>
                <button
                  onClick={handleGoToCalculator}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🧮 Calcule seu Fio B e ganhe o e-book
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <img 
              src="https://bcb27500.delivery.rocketcdn.me/wp-content/uploads/2024/05/LOGO-CANAL-SOLAR-VERSAO-4-copiar.webp" 
              alt="CANAL SOLAR" 
              width={200}
              height={40}
              className="h-10 w-auto mx-auto mb-4" 
            />
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Canal Solar. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
