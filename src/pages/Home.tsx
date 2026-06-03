import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import FeaturedVehicles from '../components/home/FeaturedVehicles';
import Experience from '../components/home/Experience';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <>
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .text-stroke {
          -webkit-text-stroke: 1px rgba(0,0,0,0.3);
          color: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="overflow-x-hidden">
        <Hero />
        <Stats />
        <FeaturedVehicles />
        <Experience />
        <CTABanner />
      </div>
    </>
  );
}
