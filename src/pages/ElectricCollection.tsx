import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, useSprings, animated } from '@react-spring/web';

export default function ElectricCollection() {
  const [inView, setInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Stats counting springs
  const statsSprings = {
    acceleration: useSpring({
      val: inView ? 1.9 : 5.0,
      config: { mass: 1, tension: 35, friction: 12 }
    }),
    range: useSpring({
      val: inView ? 520 : 0,
      config: { mass: 1, tension: 30, friction: 14 }
    }),
    sustainability: useSpring({
      val: inView ? 100 : 0,
      config: { mass: 1, tension: 35, friction: 15 }
    })
  };

  const electricCars = [
    {
      id: 'tesla-model-s-plaid',
      name: 'Tesla Model S Plaid',
      subtitle: 'Tri Motor All-Wheel Drive',
      price: '$109,990',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      alt: 'Tesla Model S Plaid in white showroom.',
      range: '396 mi',
      topSpeed: '200 mph',
      inStock: true
    },
    {
      id: 'taycan-turbo-s',
      name: 'Taycan Turbo S',
      subtitle: 'Dual Motor All-Wheel Drive',
      price: '$194,900',
      image: 'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Porsche Taycan Turbo S in minimalist showroom.',
      range: '222 mi',
      charging: '22.5 mins (5-80%)',
      inStock: false
    }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen pb-16">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <main className="py-12 text-black">
        {/* Hero Banner */}
        <section className="relative h-[500px] min-h-[400px] w-full max-w-container-max-width mx-auto mb-16 px-grid-margin">
          <div className="w-full h-full rounded-xl overflow-hidden relative shadow-lg">
            <img 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Futuristic electric supercar in bright white studio." 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80" 
            />
            {/* Reduced shading overlay (from background/95 to background/35) */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 max-w-2xl text-black bg-white/75 backdrop-blur-md p-8 rounded-xl border border-white/40 shadow-xl">
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full font-label-caps text-label-caps text-primary mb-4 tracking-widest uppercase">
                The Future of Performance
              </span>
              <h1 className="font-display-lg text-headline-lg md:text-[56px] text-primary mb-4 uppercase font-extrabold leading-tight">
                Electric Collection
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Zero emissions. Infinite exhilaration. Discover a curated selection of the world's most advanced electric supercars, engineered for a new era of driving.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section ref={statsRef} className="max-w-container-max-width mx-auto px-grid-margin mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter">
            
            {/* Stat 1: Plaid */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between items-start min-h-[200px] hover:shadow-xl transition-all duration-500 bg-white border-l-4 border-l-secondary-fixed-dim">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary-fixed-dim font-bold">bolt</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  <animated.span>
                    {statsSprings.acceleration.val.to(v => `${v.toFixed(1)}s`)}
                  </animated.span>
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-2">0-60 MPH (Plaid)</p>
              </div>
            </div>

            {/* Stat 2: Lucid Range */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between items-start min-h-[200px] hover:shadow-xl transition-all duration-500 bg-white border-l-4 border-l-primary">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary font-bold">battery_charging_full</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  <animated.span>
                    {statsSprings.range.val.to(v => `${Math.floor(v)} mi`)}
                  </animated.span>
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-2">Max Range (Lucid)</p>
              </div>
            </div>

            {/* Stat 3: Sustainable */}
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between items-start min-h-[200px] hover:shadow-xl transition-all duration-500 bg-white border-l-4 border-l-secondary-fixed-dim">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary-fixed-dim font-bold">eco</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  <animated.span>
                    {statsSprings.sustainability.val.to(v => `${Math.floor(v)}%`)}
                  </animated.span>
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-2">Sustainable Energy</p>
              </div>
            </div>

          </div>
        </section>

        {/* Featured Vehicles Grid */}
        <section className="max-w-container-max-width mx-auto px-grid-margin mb-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-widest block mb-2">POWER ELECTRIFIED</span>
              <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-extrabold">Featured Models</h2>
            </div>
            <Link 
              to="/inventory"
              className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1 hover:text-secondary-fixed-dim hover:border-secondary-fixed-dim transition-all"
            >
              View All Electric
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
            {electricCars.map((car) => (
              <div key={car.id} className="group relative rounded-xl overflow-hidden bg-white border border-outline-variant/30 shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-surface-container-low">
                  <img 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    alt={car.alt} 
                    src={car.image} 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded font-label-caps text-label-caps text-secondary-fixed-dim uppercase">
                      Electric
                    </span>
                    {car.inStock && (
                      <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed font-label-caps text-label-caps rounded uppercase font-bold">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md bg-gradient-to-r from-[#ffe6b3] via-[#e5c188] to-[#be9a5f] bg-clip-text text-transparent group-hover:brightness-110 transition-all font-extrabold uppercase">
                        {car.name}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">{car.subtitle}</p>
                    </div>
                    <p className="font-headline-md text-headline-md text-primary font-extrabold">{car.price}</p>
                  </div>
                  <div className="flex gap-6 mt-6 border-t border-outline-variant/30 pt-6">
                    {car.range && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Range</p>
                        <p className="font-body-md text-body-md text-primary font-semibold">{car.range}</p>
                      </div>
                    )}
                    {car.topSpeed && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Top Speed</p>
                        <p className="font-body-md text-body-md text-primary font-semibold">{car.topSpeed}</p>
                      </div>
                    )}
                    {car.charging && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Charging</p>
                        <p className="font-body-md text-body-md text-primary font-semibold">{car.charging}</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to={`/car/${car.id}`}
                    className="block text-center w-full mt-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 font-bold tracking-widest rounded-lg shadow-sm"
                  >
                    Explore Configuration
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
