import { useRef } from 'react';

export default function CarGallery() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1200&q=80',
      alt: 'Luxurious cabin interior with premium leather and carbon fiber.',
      widthClass: 'min-w-[320px] md:min-w-[800px]'
    },
    {
      src: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      alt: 'Macro shot of custom leather steering wheel and paddle shifters.',
      widthClass: 'min-w-[280px] md:min-w-[500px]'
    },
    {
      src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      alt: 'Low-angle view of customized LED taillights and quad exhausts.',
      widthClass: 'min-w-[320px] md:min-w-[800px]'
    }
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-white text-black">
      <div className="max-w-container-max-width mx-auto px-grid-margin mb-12 flex justify-between items-end">
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tight">
          Gallery Experience
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-4 border border-outline-variant hover:border-secondary-fixed-dim transition-colors active:scale-95 flex items-center justify-center"
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-4 border border-outline-variant hover:border-secondary-fixed-dim transition-colors active:scale-95 flex items-center justify-center"
            aria-label="Next image"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-grid-gutter overflow-x-auto hide-scrollbar px-grid-margin scroll-smooth"
      >
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`${img.widthClass} h-[400px] md:h-[500px] bg-surface-container overflow-hidden`}
          >
            <img className="w-full h-full object-cover" alt={img.alt} src={img.src} />
          </div>
        ))}
      </div>
    </section>
  );
}
