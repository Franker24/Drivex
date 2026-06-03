import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop bg-primary text-on-primary">
      <div className="max-w-container-max-width mx-auto px-grid-margin text-center">
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-12">
          Your Journey Begins Here.
        </h2>
        <Link 
          to="/test-drive"
          className="inline-block bg-on-primary text-primary px-12 py-6 font-label-caps text-label-caps hover:bg-secondary-fixed-dim hover:text-primary transition-all active:scale-95 shadow-lg"
        >
          RESERVE YOUR ALLOCATION
        </Link>
      </div>
    </section>
  );
}
