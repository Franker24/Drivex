import { Link } from 'react-router-dom';

export default function Experience() {
  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-grid-margin grid grid-cols-1 md:grid-cols-12 gap-grid-gutter items-center">
        <div className="md:col-span-5 mb-12 md:mb-0">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim">BEYOND THE DRIVE</span>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-primary mt-4 mb-8 leading-tight">
            Crafting the Future of Mobility.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            At DRIVEX, we don't just sell cars; we curate masterpieces. Every vehicle in our gallery is selected for its engineering excellence, aesthetic purity, and the visceral emotion it evokes from the driver. 
          </p>
          <Link className="inline-flex items-center gap-4 group" to="/about">
            <span className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1 group-hover:border-secondary-fixed-dim transition-colors">
              THE EXPERIENCE
            </span>
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="md:col-span-7 relative">
          <div className="aspect-[4/5] md:aspect-video overflow-hidden rounded-lg shadow-2xl">
            <img 
              className="w-full h-full object-cover" 
              alt="A top-down view of a modern showroom with polished white marble floors reflecting soft overhead lighting." 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
          {/* Overlapping Glass Card */}
          <div className="absolute -bottom-10 -left-10 hidden md:block w-72 p-10 glass-panel border border-white/40 shadow-2xl">
            <span 
              className="material-symbols-outlined text-4xl text-primary mb-4" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <h4 className="font-headline-md text-headline-md mb-2">Purity</h4>
            <p className="font-body-md text-on-surface-variant">
              Uncompromising standards in every detail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
