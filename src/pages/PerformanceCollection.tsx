import { Link } from 'react-router-dom';

export default function PerformanceCollection() {
  const aeroSpecs = [
    { value: '150%', desc: 'Increase in Downforce', icon: 'air' },
    { value: 'Carbon Fiber', desc: 'Extensive Lightweighting', icon: 'line_weight' }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen pb-16">
      <style>{`
        .carbon-pattern {
          background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
        }
        .glass-panel {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      <main className="flex-grow pt-12 pb-24 text-black">
        {/* Hero Section */}
        <section className="max-w-container-max-width mx-auto px-grid-margin mb-16 relative">
          <div className="h-[450px] md:h-[500px] w-full rounded-xl overflow-hidden relative group shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent"></div>
            <div className="absolute bottom-12 left-12 max-w-lg text-white">
              <span className="inline-block px-4 py-2 bg-surface/20 backdrop-blur-md border border-outline-variant/30 text-on-primary font-label-caps text-label-caps rounded mb-4 tracking-widest uppercase">
                Apex Series
              </span>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 uppercase">
                PERFORMANCE<br/>COLLECTION
              </h1>
              <p className="font-body-lg text-body-lg text-on-primary/80">
                Engineering pushed to the absolute limit. A curated selection of track-focused machines designed for pure adrenaline, presented in immaculate detail.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Grid: Porsche & McLaren */}
        <section className="max-w-container-max-width mx-auto px-grid-margin mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
            
            {/* Card 1: Porsche 911 GT3 (Bento Large) */}
            <article className="lg:col-span-8 flex flex-col bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-[0px_20px_50px_rgba(0,0,0,0.04)] group bg-white">
              <div className="h-96 md:h-[450px] w-full relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Porsche 911 GT3 in white studio space." 
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                />
                <div className="absolute top-6 right-6 glass-panel bg-surface-container-lowest/70 border border-outline-variant/20 px-4 py-2 rounded shadow-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Track Ready</span>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tighter">
                      Porsche 911 GT3
                    </h3>
                    <span className="font-body-lg text-body-lg text-secondary font-bold">2024</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    A naturally aspirated masterpiece. The GT3 delivers an unfiltered connection between driver, machine, and tarmac, stripping away the unnecessary to reveal pure dynamic brilliance.
                  </p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8 border-t border-outline-variant/20 pt-6">
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">0-60 MPH</span>
                    <span className="font-headline-md text-headline-md text-primary">3.2s</span>
                  </div>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Horsepower</span>
                    <span className="font-headline-md text-headline-md text-primary">502 hp</span>
                  </div>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Top Speed</span>
                    <span className="font-headline-md text-headline-md text-primary">197 mph</span>
                  </div>
                </div>
                
                <Link 
                  to="/car/porsche-911-gt3"
                  className="mt-8 inline-block text-center py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300"
                >
                  Configure Porsche 911 GT3
                </Link>
              </div>
            </article>

            {/* Side Panel / Texture Feature */}
            <aside className="lg:col-span-4 flex flex-col gap-grid-gutter">
              <div className="bg-white border border-outline-variant/20 rounded-xl p-8 shadow-[0px_20px_50px_rgba(0,0,0,0.04)] h-full flex flex-col relative overflow-hidden justify-between">
                <div className="absolute inset-0 carbon-pattern opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                  <h4 className="font-label-caps text-label-caps text-secondary-fixed-dim mb-8 tracking-widest uppercase border-b border-outline-variant/20 pb-4">
                    Aerodynamics
                  </h4>
                  <ul className="space-y-6">
                    {aeroSpecs.map((spec, idx) => (
                      <li key={idx} className="flex items-center space-x-4">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl">{spec.icon}</span>
                        <div>
                          <span className="block font-headline-md text-headline-md text-primary">{spec.value}</span>
                          <span className="font-body-md text-body-md text-on-surface-variant">{spec.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 pt-8 mt-12">
                  <Link 
                    to="/inventory"
                    className="w-full text-center block py-4 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary-fixed-dim hover:text-primary transition-colors duration-300"
                  >
                    Explore Dynamics
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </section>

        {/* Secondary Grid */}
        <section className="max-w-container-max-width mx-auto px-grid-margin mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
            
            {/* Card 2: McLaren Artura */}
            <article className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-[0px_20px_50px_rgba(0,0,0,0.04)] group flex flex-col bg-white">
              <div className="h-80 w-full relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="McLaren Artura close-up exhaust design." 
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-surface-container-high text-primary font-label-caps text-label-caps rounded mb-4 tracking-widest uppercase text-[10px]">Hybrid V6</span>
                  <h3 className="font-headline-md text-headline-md text-primary uppercase tracking-tighter mb-2">
                    McLaren Artura
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Next-generation high-performance hybrid architecture. Relentless innovation meeting electrified power.
                  </p>
                </div>
                <Link 
                  to="/car/mclaren-artura"
                  className="mt-8 inline-block pb-1 border-b border-primary text-primary font-label-caps text-label-caps tracking-widest uppercase hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim transition-colors duration-300 self-start"
                >
                  View Specifications
                </Link>
              </div>
            </article>

            {/* Detail / Atmosphere Image */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_20px_50px_rgba(0,0,0,0.04)] h-full min-h-[400px] relative group bg-white">
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Forged alloy wheel and carbon-ceramic brake caliper." 
                src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-primary/10"></div>
              <div className="absolute top-8 left-8">
                <h4 className="font-headline-lg text-headline-lg text-white leading-tight">UNCOMPROMISING<br/>DETAIL</h4>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
