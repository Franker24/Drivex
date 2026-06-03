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
    <section ref={ref} className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-lowest relative z-20">
      <div className="max-w-container-max-width mx-auto px-grid-margin">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter text-center">
          
          <div className="p-8">
            <p className="font-display-lg text-[48px] md:text-[72px] text-primary mb-2 tabular-nums font-extrabold tracking-tighter">
              <animated.span>
                {hpSpring.val.to((val) => `${Math.floor(val)}+`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
              HORSEPOWER AVG.
            </p>
          </div>

          <div className="p-8 border-y md:border-y-0 md:border-x border-outline-variant/30">
            <p className="font-display-lg text-[48px] md:text-[72px] text-primary mb-2 tabular-nums font-extrabold tracking-tighter">
              <animated.span>
                {speedSpring.val.to((val) => `${val.toFixed(1)}s`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
              0-60 PERFORMANCE
            </p>
          </div>

          <div className="p-8">
            <p className="font-display-lg text-[48px] md:text-[72px] text-primary mb-2 tabular-nums font-extrabold tracking-tighter">
              <animated.span>
                {fleetSpring.val.to((val) => `${Math.floor(val)}+`)}
              </animated.span>
            </p>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
              LUXURY FLEET
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
