import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  type: 'image' | 'video';
  url: string;
  title: string;
  tagline: string;
}

const HERO_SLIDES: Slide[] = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80',
    title: 'Drive Beyond Ordinary',
    tagline: '9000 RPM MOTORSPORT PURITY'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1800&q=80',
    title: 'Pure Performance Unleashed',
    tagline: 'BESPOKE MOTORSPORT ENGINEERING'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1800&q=80',
    title: 'Italian Sophistication',
    tagline: 'LA NUOVA DOLCE VITA'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1800&q=80',
    title: 'The Future Electrified',
    tagline: 'ZERO EMISSIONS. INFINITE EMOTION.'
  }
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Mouse parallax movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientX - window.innerWidth / 2) * 0.005;
    const y = (e.clientY - window.innerHeight / 2) * 0.005;
    setParallax({ x, y });
  };

  // Auto-play slides
  useEffect(() => {
    const slideDuration = HERO_SLIDES[activeIndex].type === 'video' ? 8000 : 5000;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <section 
      className="relative h-[calc(100vh-64px)] w-full flex items-center justify-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background Slides (Cross-fade) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {slide.type === 'video' ? (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover scale-[1.05]"
                style={{
                  transform: `translate(${parallax.x}px, ${parallax.y}px)`
                }}
              >
                <source src={slide.url} type="video/mp4" />
              </video>
            ) : (
              <img 
                className="w-full h-full object-cover scale-[1.05]" 
                alt={slide.title} 
                src={slide.url}
                style={{
                  transform: `translate(${parallax.x}px, ${parallax.y}px)`
                }}
              />
            )}
          </div>
        ))}
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/50 z-10 pointer-events-none"></div>
      </div>
      
      {/* Slide Text Content Overlay */}
      <div className="relative z-20 text-center px-grid-margin max-w-4xl">
        <span className="font-label-caps text-label-caps text-secondary-fixed-dim mb-4 tracking-[0.25em] block animate-pulse uppercase">
          {HERO_SLIDES[activeIndex].tagline}
        </span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-base drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 select-none uppercase">
          {HERO_SLIDES[activeIndex].title}
        </h1>
        
        {/* Intact CTA Action Buttons */}
        <div className="flex flex-col md:flex-row gap-grid-gutter justify-center mt-12">
          <Link 
            to="/inventory" 
            className="bg-primary text-on-primary text-center px-10 py-5 font-label-caps text-label-caps transition-all hover:bg-secondary-fixed-dim hover:text-on-background active:scale-95 shadow-xl border border-transparent hover:border-secondary-fixed-dim"
          >
            Explore Collection
          </Link>
          <Link 
            to="/test-drive" 
            className="glass-panel text-center border border-white/30 text-white px-10 py-5 font-label-caps text-label-caps transition-all hover:border-secondary-fixed-dim hover:text-primary hover:bg-white active:scale-95"
          >
            Book Test Drive
          </Link>
        </div>
      </div>
      
      {/* Carousel Navigation Indicators (Dots) */}
      <div className="absolute bottom-16 z-35 flex gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === activeIndex 
                ? 'bg-secondary-fixed-dim w-10 shadow-lg' 
                : 'bg-white/40 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-20 pointer-events-none">
        <span className="material-symbols-outlined text-white/50 text-3xl">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}
