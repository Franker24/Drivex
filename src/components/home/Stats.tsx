import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Stats() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const hpSpring = useSpring({
    val: inView ? 800 : 0,
    config: { mass: 1, tension: 35, friction: 15 }
  });

  const speedSpring = useSpring({
    val: inView ? 3.2 : 6.0,
    config: { mass: 1, tension: 40, friction: 16 }
  });

  const fleetSpring = useSpring({
    val: inView ? 50 : 0,
    config: { mass: 1, tension: 35, friction: 15 }
  });

  return (
    <section ref={ref} className="py-section-gap-mobile md:py-section-gap-desktop bg-[#080808] relative z-20 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-secondary-fixed-dim/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-container-max-width mx-auto px-grid-margin relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stat 1: Horsepower */}
          <div className="bg-[#121212]/40 border border-white/5 backdrop-blur-md hover:border-secondary-fixed-dim/30 hover:shadow-[0_0_40px_rgba(229,193,136,0.04)] transition-all duration-500 rounded-2xl p-8 flex flex-col items-center text-center group">
            <span className="material-symbols-outlined text-[40px] text-secondary-fixed-dim/80 group-hover:text-secondary-fixed-dim group-hover:scale-110 transition-all duration-300 mb-4 select-none">
              bolt
            </span>
            <p className="font-display-lg text-[48px] md:text-[64px] bg-gradient-to-r from-secondary-fixed-dim via-white to-white bg-clip-text text-transparent mb-2 tabular-nums font-extrabold tracking-tighter leading-none select-none">
              <animated.span>
                {hpSpring.val.to((val) => `${Math.floor(val)}+`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-white/50 group-hover:text-white/80 transition-colors tracking-widest text-xs uppercase font-medium mt-1">
              HORSEPOWER AVG.
            </p>
          </div>

          {/* Stat 2: Acceleration */}
          <div className="bg-[#121212]/40 border border-white/5 backdrop-blur-md hover:border-secondary-fixed-dim/30 hover:shadow-[0_0_40px_rgba(229,193,136,0.04)] transition-all duration-500 rounded-2xl p-8 flex flex-col items-center text-center group">
            <span className="material-symbols-outlined text-[40px] text-secondary-fixed-dim/80 group-hover:text-secondary-fixed-dim group-hover:scale-110 transition-all duration-300 mb-4 select-none">
              timer
            </span>
            <p className="font-display-lg text-[48px] md:text-[64px] bg-gradient-to-r from-secondary-fixed-dim via-white to-white bg-clip-text text-transparent mb-2 tabular-nums font-extrabold tracking-tighter leading-none select-none">
              <animated.span>
                {speedSpring.val.to((val) => `${val.toFixed(1)}s`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-white/50 group-hover:text-white/80 transition-colors tracking-widest text-xs uppercase font-medium mt-1">
              0-60 PERFORMANCE
            </p>
          </div>

          {/* Stat 3: Luxury Fleet */}
          <div className="bg-[#121212]/40 border border-white/5 backdrop-blur-md hover:border-secondary-fixed-dim/30 hover:shadow-[0_0_40px_rgba(229,193,136,0.04)] transition-all duration-500 rounded-2xl p-8 flex flex-col items-center text-center group">
            <span className="material-symbols-outlined text-[40px] text-secondary-fixed-dim/80 group-hover:text-secondary-fixed-dim group-hover:scale-110 transition-all duration-300 mb-4 select-none">
              garage
            </span>
            <p className="font-display-lg text-[48px] md:text-[64px] bg-gradient-to-r from-secondary-fixed-dim via-white to-white bg-clip-text text-transparent mb-2 tabular-nums font-extrabold tracking-tighter leading-none select-none">
              <animated.span>
                {fleetSpring.val.to((val) => `${Math.floor(val)}+`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-white/50 group-hover:text-white/80 transition-colors tracking-widest text-xs uppercase font-medium mt-1">
              LUXURY FLEET
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
