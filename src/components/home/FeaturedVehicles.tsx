import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSprings, animated } from '@react-spring/web';

interface Vehicle {
  id: string;
  name: string;
  price: string;
  tags?: string[];
  image: string;
  alt: string;
}

export default function FeaturedVehicles() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const vehicles: Vehicle[] = [
    {
      id: 'phantom-zenith',
      name: 'Phantom Zenith',
      price: '$245,000',
      tags: ['ELECTRIC', 'AVAILABLE'],
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      alt: "Close-up of a midnight black supercar's rear lights and carbon fiber diffuser."
    },
    {
      id: 'apex-gtr',
      name: 'Apex GT-R',
      price: '$310,000',
      tags: ['HYBRID', 'TRACK FOCUS'],
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      alt: "Front profile of an aggressive grey high-performance track sports car in a dark studio setting."
    },
    {
      id: 'lumina-s-class',
      name: 'Lumina S-Class',
      price: '$185,000',
      tags: ['LUXURY', 'V6 TURBO'],
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      alt: "A profile view of a charcoal grey luxury sedan driving through a minimalist urban environment."
    }
  ];

  // Staggered slide and fade-in springs
  const springs = useSprings(
    vehicles.length,
    vehicles.map((_, index) => ({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0px)' : 'translateY(40px)',
      delay: index * 180,
      config: { tension: 180, friction: 22 }
    }))
  );

  return (
    <section ref={containerRef} className="py-section-gap-mobile md:py-section-gap-desktop overflow-hidden bg-background">
      <div className="max-w-container-max-width mx-auto px-grid-margin mb-12 flex justify-between items-end">
        <div>
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] block mb-2">CURATED SELECTION</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
            The 2024 Collection
          </h2>
        </div>
        <div className="hidden md:flex gap-4">
          <button 
            className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-md"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button 
            className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-md"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-grid-gutter overflow-x-auto hide-scrollbar px-grid-margin pb-12 snap-x scroll-smooth"
      >
        {springs.map((style, idx) => {
          const car = vehicles[idx];
          return (
            <animated.div key={car.id} style={style} className="flex-none snap-start">
              <Link 
                to={`/car/${car.id}`}
                className="block w-[320px] md:w-[480px] group"
              >
                <div className="relative h-[400px] md:h-[600px] overflow-hidden bg-surface-container rounded-xl shadow-lg border border-outline-variant/10">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    alt={car.alt} 
                    src={car.image}
                  />
                  {car.tags && car.tags.length > 0 && (
                    <div className="absolute top-6 left-6 flex gap-2">
                      {car.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="bg-black/80 backdrop-blur-md px-3 py-1 font-label-caps text-[10px] tracking-widest text-secondary-fixed-dim rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary-fixed-dim transition-colors tracking-tight">
                      {car.name}
                    </h3>
                    <p className="font-body-md text-on-surface-variant mt-1">
                      Starting at <span className="text-secondary-fixed-dim font-bold">{car.price}</span>
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 group-hover:text-secondary-fixed-dim transition-all duration-300">
                    arrow_forward
                  </span>
                </div>
              </Link>
            </animated.div>
          );
        })}
      </div>
    </section>
  );
}
