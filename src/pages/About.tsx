import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function About() {
  const [inView, setInView] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [bentoInView, setBentoInView] = useState(false);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBentoInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (bentoRef.current) {
      observer.observe(bentoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Hero animations
  const heroLeftSpring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(40px)',
    config: { mass: 1, tension: 150, friction: 22 }
  });

  const heroRightSpring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(30px)',
    config: { mass: 1, tension: 120, friction: 20 }
  });

  const badgeSpring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0px) rotate(0deg)' : 'translateX(-50px) rotate(-3deg)',
    delay: 500,
    config: { mass: 1, tension: 160, friction: 18 }
  });

  // Bento Legacy animations
  const bentoLeftSpring = useSpring({
    opacity: bentoInView ? 1 : 0,
    transform: bentoInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { mass: 1, tension: 130, friction: 20 }
  });

  const bentoRightTopSpring = useSpring({
    opacity: bentoInView ? 1 : 0,
    transform: bentoInView ? 'translateY(0px)' : 'translateY(50px)',
    delay: 200,
    config: { mass: 1, tension: 130, friction: 20 }
  });

  const bentoRightBottomSpring = useSpring({
    opacity: bentoInView ? 1 : 0,
    transform: bentoInView ? 'translateY(0px)' : 'translateY(50px)',
    delay: 400,
    config: { mass: 1, tension: 130, friction: 20 }
  });

  // Numeric count-up springs
  const bentoRareSpring = useSpring({
    val: bentoInView ? 50 : 0,
    config: { mass: 1, tension: 35, friction: 15 }
  });

  const bentoShowroomsSpring = useSpring({
    val: bentoInView ? 12 : 0,
    config: { mass: 1, tension: 35, friction: 15 }
  });

  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden pb-16">
      <style>{`
        .glass-panel {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.7);
        }
        .dark .glass-panel {
          background: rgba(26, 28, 28, 0.7);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-floating {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <main className="pb-24 text-black">
        {/* Hero Section */}
        <section ref={heroRef} className="max-w-container-max-width mx-auto px-grid-margin mb-16 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter items-center">
            
            {/* Left Column (Text elements animates up) */}
            <animated.div style={heroLeftSpring} className="col-span-1 md:col-span-6 space-y-8 z-10">
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase">
                Engineering<br />meets Art.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Since 1984, DRIVEX has curated the world's most exceptional vehicles. We don't just sell cars; we deliver cinematic automotive experiences.
              </p>
              <button 
                type="button"
                className="bg-[#111111] text-white px-8 py-4 font-label-caps text-label-caps hover:bg-primary transition-colors active:scale-95"
              >
                DISCOVER OUR HERITAGE
              </button>
            </animated.div>
            
            {/* Right Column (Image scale-in) */}
            <div className="col-span-1 md:col-span-6 relative mt-12 md:mt-0">
              <animated.div style={heroRightSpring} className="aspect-[4/5] rounded-DEFAULT overflow-hidden bg-surface-container relative shadow-2xl">
                <img 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000" 
                  alt="Detail shot of a classic luxury car's polished curves." 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" 
                />
              </animated.div>
              {/* Glass floating element */}
              <animated.div 
                style={badgeSpring} 
                className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-DEFAULT shadow-[0px_20px_50px_rgba(0,0,0,0.06)] hidden md:block max-w-xs border border-white/50 text-black animate-floating"
              >
                <p className="font-label-caps text-label-caps text-primary mb-2">EST. 1984</p>
                <p className="font-headline-md text-headline-md text-primary">40 Years of Pursuit of Perfection.</p>
              </animated.div>
            </div>
          </div>
        </section>

        {/* Bento Grid: The DRIVEX Legacy */}
        <section ref={bentoRef} className="max-w-container-max-width mx-auto px-grid-margin mb-24">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim block mb-4">OUR STORY</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-[56px] md:leading-[64px] tracking-tight text-primary uppercase">
                The DRIVEX Legacy
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter md:grid-rows-[minmax(300px,_auto)_minmax(300px,_auto)]">
            
            {/* Large Feature Image (Animates from bottom) */}
            <animated.div style={bentoLeftSpring} className="col-span-1 md:col-span-8 md:row-span-2 rounded-DEFAULT overflow-hidden relative group min-h-[400px] shadow-lg">
              <img 
                className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Interior view of a high-end luxury vehicle." 
                src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1200&q=80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="font-headline-md text-headline-md text-white mb-2 uppercase">Uncompromising Craftsmanship</h3>
                <p className="font-body-md text-body-md text-white/80 max-w-lg">
                  Every vehicle in our collection represents the pinnacle of automotive engineering and design excellence.
                </p>
              </div>
            </animated.div>

            {/* Text Stats Card (Animates with delay, counts up) */}
            <animated.div style={bentoRightTopSpring} className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-surface-container-high rounded-DEFAULT p-8 flex flex-col justify-center shadow-[0px_20px_50px_rgba(0,0,0,0.02)] bg-white text-black">
              <div className="space-y-8">
                <div>
                  <p className="font-display-lg text-display-lg text-primary mb-1">
                    <animated.span>
                      {bentoRareSpring.val.to((val) => `${Math.floor(val)}+`)}
                    </animated.span>
                  </p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Rare Models Curated</p>
                </div>
                <div className="h-px w-full bg-surface-container-high"></div>
                <div>
                  <p className="font-display-lg text-display-lg text-primary mb-1">
                    <animated.span>
                      {bentoShowroomsSpring.val.to((val) => `${Math.floor(val)}`)}
                    </animated.span>
                  </p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Global Showrooms</p>
                </div>
              </div>
            </animated.div>

            {/* Smaller Image Card (Animates with longer delay) */}
            <animated.div style={bentoRightBottomSpring} className="col-span-1 md:col-span-4 rounded-DEFAULT overflow-hidden relative group min-h-[250px] shadow-lg">
              <img 
                className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Silver car wheel in white studio." 
                src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80" 
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm">
                <span className="bg-primary text-white px-6 py-3 font-label-caps text-label-caps">VIEW GALLERY</span>
              </div>
            </animated.div>

          </div>
        </section>
      </main>
    </div>
  );
}
