import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpecsGrid from '../components/details/SpecsGrid';
import CarGallery from '../components/details/CarGallery';
import StickyCTA from '../components/details/StickyCTA';

const UNSPLASH_ACCESS_KEY = '8BkmB_ys_AlL0PGtIlP8_4Y2Gpkk3cUXT4wVKlh9Qcg';

const CARS_DETAILS_DATA: Record<string, {
  name: string;
  price: string;
  tagline: string;
  description: string;
  image: string;
  videoUrl: string;
  specs: {
    engine: string;
    hp: string;
    torque: string;
    acceleration: string;
    aeroVal: number;
    responseVal: number;
    stabilityVal: number;
  }
}> = {
  'porsche-911-gt3': {
    name: 'Porsche 911 GT3',
    price: '$182,900',
    tagline: '9000 RPM MOTORSPORT PURITY',
    description: 'Born in Flacht, bred for the racetrack. Experience raw mechanical connection and motorsport precision.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/OGEEQ9VEEmc',
    specs: {
      engine: '4.0L FLAT-6',
      hp: '502 HP',
      torque: '346 LB-FT',
      acceleration: '3.2 SEC',
      aeroVal: 92,
      responseVal: 98,
      stabilityVal: 97
    }
  },
  'mclaren-artura': {
    name: 'McLaren Artura',
    price: '$233,000',
    tagline: 'HYBRID SUPERCAR REVOLUTION',
    description: 'The next-generation high-performance hybrid. A masterclass in lightweight carbon fiber and explosive power.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/gZGOz6sir40',
    specs: {
      engine: '3.0L V6 HYBRID',
      hp: '671 HP',
      torque: '531 LB-FT',
      acceleration: '3.0 SEC',
      aeroVal: 95,
      responseVal: 96,
      stabilityVal: 94
    }
  },
  'ferrari-roma': {
    name: 'Ferrari Roma',
    price: '$243,360',
    tagline: 'LA NUOVA DOLCE VITA',
    description: 'Italian sophistication reimagined. The Ferrari Roma combines clean styling with a twin-turbocharged V8 engine.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/5wjBHDogyko',
    specs: {
      engine: '3.9L V8 TWIN-TURBO',
      hp: '612 HP',
      torque: '561 LB-FT',
      acceleration: '3.4 SEC',
      aeroVal: 90,
      responseVal: 94,
      stabilityVal: 93
    }
  },
  'tesla-model-s-plaid': {
    name: 'Tesla Model S Plaid',
    price: '$89,990',
    tagline: '1020 HP ELECTRIC FORCE',
    description: 'Beyond supercar speeds. The Model S Plaid achieves peak torque instantly with its revolutionary tri-motor setup.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/k0oMa2jWXaM',
    specs: {
      engine: 'TRI-MOTOR ELECTRIC',
      hp: '1020 HP',
      torque: '1050 LB-FT',
      acceleration: '1.99 SEC',
      aeroVal: 89,
      responseVal: 99,
      stabilityVal: 95
    }
  },
  'taycan-turbo-s': {
    name: 'Porsche Taycan Turbo S',
    price: '$194,900',
    tagline: 'ELECTRIC TRACK PRECISION',
    description: 'Soul, electrified. Porsche racetrack capabilities translated into a high-voltage, high-performance daily driving machine.',
    image: 'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/n4sL19W5i_Y',
    specs: {
      engine: 'DUAL ELECTRIC MOTORS',
      hp: '750 HP',
      torque: '774 LB-FT',
      acceleration: '2.6 SEC',
      aeroVal: 91,
      responseVal: 98,
      stabilityVal: 98
    }
  },
  'bespoke-720s': {
    name: 'Bespoke McLaren 720S',
    price: '$310,500',
    tagline: 'MSO EXCLUSIVE SCULPTURE',
    description: 'Limited edition supercar. Every curve and carbon panel is customized by McLaren Special Operations.',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/hJ814Jq2w_4',
    specs: {
      engine: '4.0L V8 TWIN-TURBO',
      hp: '710 HP',
      torque: '568 LB-FT',
      acceleration: '2.8 SEC',
      aeroVal: 97,
      responseVal: 95,
      stabilityVal: 94
    }
  },
  'phantom-zenith': {
    name: 'Phantom Zenith',
    price: '$245,000',
    tagline: 'SILENT MAJESTY & ELECTRIFIED POWER',
    description: 'The pinnacle of silent luxury. Handcrafted leather meets a state-of-the-art dual-motor electric drivetrain.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/3UjQ4C824dE',
    specs: {
      engine: 'DUAL MOTOR ELECTRIC',
      hp: '650 HP',
      torque: '710 LB-FT',
      acceleration: '3.8 SEC',
      aeroVal: 91,
      responseVal: 95,
      stabilityVal: 96
    }
  },
  'apex-gtr': {
    name: 'Apex GT-R',
    price: '$310,000',
    tagline: 'TRACK-DOMINATING HYBRID HYPERCAR',
    description: 'Pure motorsport DNA. A twin-turbocharged V8 engine paired with high-performance electric motors to deliver immediate response and massive downforce.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/Fw07wGfA3uA',
    specs: {
      engine: '4.0L V8 HYBRID',
      hp: '1020 HP',
      torque: '850 LB-FT',
      acceleration: '1.9 SEC',
      aeroVal: 99,
      responseVal: 99,
      stabilityVal: 98
    }
  },
  'lumina-s-class': {
    name: 'Lumina S-Class',
    price: '$185,000',
    tagline: 'COUTURE COMFORT & TURBO V6',
    description: 'The absolute reference of executive class mobility. Sleek styling, advanced air suspension, and couture prestige.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/7tN19E9H2cM',
    specs: {
      engine: '3.0L V6 TWIN-TURBO',
      hp: '450 HP',
      torque: '420 LB-FT',
      acceleration: '4.2 SEC',
      aeroVal: 88,
      responseVal: 90,
      stabilityVal: 92
    }
  },
  'aston-martin-vantage': {
    name: 'Aston Martin Vantage',
    price: '$191,000',
    tagline: 'PREDATORY SPORTING INSTINCT',
    description: 'An independent spirit, Vantage is a beautiful car of exceptional proportions. A twin-turbocharged V8 engine provides explosive performance.',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/yQ07lS3l50c',
    specs: {
      engine: '4.0L V8 TWIN-TURBO',
      hp: '503 HP',
      torque: '505 LB-FT',
      acceleration: '3.5 SEC',
      aeroVal: 90,
      responseVal: 94,
      stabilityVal: 93
    }
  },
  'audi-r8': {
    name: 'Audi R8 Coupe',
    price: '$158,600',
    tagline: 'GENETICALLY ENGINEERED RACING DNA',
    description: 'The final chapter of a naturally aspirated icon. The Audi R8 delivers visceral power from its mid-mounted V10 engine.',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/z4a6yHpeGts',
    specs: {
      engine: '5.2L V10 FSI',
      hp: '602 HP',
      torque: '413 LB-FT',
      acceleration: '3.2 SEC',
      aeroVal: 91,
      responseVal: 96,
      stabilityVal: 95
    }
  },
  'lamborghini-huracan': {
    name: 'Lamborghini Huracán',
    price: '$248,000',
    tagline: 'THE SENSATION OF HIGH VELOCITY',
    description: 'Designed to cut through the air and perform on track. Experience the roar of the atmospheric V10 engine.',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/g239s1fT_gM',
    specs: {
      engine: '5.2L V10 ATMOSPHERIC',
      hp: '631 HP',
      torque: '443 LB-FT',
      acceleration: '2.9 SEC',
      aeroVal: 95,
      responseVal: 98,
      stabilityVal: 96
    }
  },
  'bentley-continental': {
    name: 'Bentley Continental GT',
    price: '$235,000',
    tagline: 'THE DEEPEST DEFINITION OF GRAND TOURING',
    description: 'Stunning design meets unparalleled craftsmanship and exhilarating performance. The ultimate grand tourer.',
    image: 'https://images.unsplash.com/photo-1618843479619-f41987ba05a3?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/D3D6a0F71aE',
    specs: {
      engine: '6.0L W12 TWIN-TURBO',
      hp: '626 HP',
      torque: '664 LB-FT',
      acceleration: '3.6 SEC',
      aeroVal: 89,
      responseVal: 92,
      stabilityVal: 95
    }
  },
  'bmw-i8': {
    name: 'BMW i8 Roadster',
    price: '$147,500',
    tagline: 'THE ICONIC HYBRID SPORTS CAR',
    description: 'Electric performance meets sports car styling. The carbon-fiber passenger cell and hybrid layout redefine dynamics.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/gG_eP2A7Tbg',
    specs: {
      engine: '1.5L 3-CYL HYBRID',
      hp: '369 HP',
      torque: '420 LB-FT',
      acceleration: '4.4 SEC',
      aeroVal: 91,
      responseVal: 93,
      stabilityVal: 92
    }
  },
  'corvette-z06': {
    name: 'Corvette Z06',
    price: '$112,000',
    tagline: 'AMERICAN FLAT-PLANE SCREAMER',
    description: 'The high-revving naturally aspirated V8 delivers an unmatched mechanical symphony, paired with racetrack aerodynamics.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/WJ_p-iN3-98',
    specs: {
      engine: '5.5L V8 FLAT-PLANE',
      hp: '670 HP',
      torque: '460 LB-FT',
      acceleration: '2.6 SEC',
      aeroVal: 94,
      responseVal: 95,
      stabilityVal: 94
    }
  }
};

const DEFAULT_CAR = {
  name: 'AERO S-700',
  price: '$284,000',
  tagline: 'SERIES VII / PERFORMANCE',
  description: 'Engineering perfected. A symphony of carbon fiber and visceral power designed for those who refuse to compromise.',
  image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  videoUrl: 'https://www.youtube-nocookie.com/embed/OGEEQ9VEEmc',
  specs: {
    engine: '4.0L V8 TWIN-TURBO',
    hp: '710 HP',
    torque: '568 LB-FT',
    acceleration: '2.8 SEC',
    aeroVal: 98,
    responseVal: 94,
    stabilityVal: 96
  }
};

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const car = id ? (CARS_DETAILS_DATA[id] || DEFAULT_CAR) : DEFAULT_CAR;
  const [carImage, setCarImage] = useState(car.image);
  const [videoOpen, setVideoOpen] = useState(false);

  // Focus locking for scroll when video modal is open
  useEffect(() => {
    if (videoOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [videoOpen]);

  // Fetch image dynamically on load
  useEffect(() => {
    let active = true;
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(car.name)}+car&per_page=1`,
          { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
        );
        if (res.ok) {
          const data = await res.json();
          const imgUrl = data.results?.[0]?.urls?.regular;
          if (imgUrl && active) {
            setCarImage(imgUrl);
          }
        }
      } catch (e) {
        console.warn("Unsplash details fetch error, using local fallback", e);
      }
    };

    setCarImage(car.image); // Reset to base image first
    fetchImage();

    return () => {
      active = false;
    };
  }, [car]);

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      <style>{`
        .glass-nav {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10"></div>
        <img 
          className="w-full h-full object-cover animate-fade-in" 
          alt={car.name} 
          src={carImage} 
        />
        <div className="absolute bottom-24 left-0 w-full z-20">
          <div className="max-w-container-max-width mx-auto px-grid-margin">
            <div className="max-w-3xl">
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim mb-4 block tracking-widest uppercase">
                {car.tagline}
              </span>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6 uppercase">
                {car.name}
              </h1>
              <p className="font-body-lg text-body-lg text-white/80 max-w-xl">
                {car.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Grid with animated progress bars */}
      <SpecsGrid specs={car.specs} />

      {/* Cinematic Showcase Section */}
      <section className="max-w-container-max-width mx-auto px-grid-margin py-16 md:py-24">
        <div className="mb-10 text-center md:text-left">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] block mb-2 font-bold">CINEMATIC PRESENTATION</span>
          <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg text-primary uppercase font-extrabold tracking-tight">Watch the Film</h2>
        </div>
        
        <div 
          onClick={() => setVideoOpen(true)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/15 group cursor-pointer"
        >
          {/* Cover image */}
          <img 
            src={carImage} 
            alt={`Watch film for ${car.name}`} 
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
          />
          {/* Dimming and vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/70 transition-all duration-300"></div>
          
          {/* Animated Glowing Play Button in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-secondary-fixed-dim transition-all duration-500">
              <div className="absolute inset-0 rounded-full border border-secondary-fixed-dim/40 animate-ping group-hover:duration-75"></div>
              <span className="material-symbols-outlined text-[40px] md:text-[56px] text-white group-hover:text-secondary-fixed-dim transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </div>
            <span className="font-label-caps text-white group-hover:text-secondary-fixed-dim text-xs md:text-sm tracking-[0.35em] uppercase font-bold text-shadow">
              Play Ad Film
            </span>
          </div>
        </div>
      </section>

      {/* Detailed Horizontal Gallery */}
      <CarGallery />

      {/* YouTube Ad Player Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10 animate-fade-in animate-slide-up">
          
          {/* Exit Modal Button */}
          <button 
            onClick={() => setVideoOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 rounded-full border border-white/20 hover:border-secondary-fixed-dim text-white hover:text-secondary-fixed-dim flex items-center justify-center transition-all cursor-pointer shadow-lg bg-black/80"
            aria-label="Close Video Player"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          
          {/* Embedded Responsive Player */}
          <div className="w-full max-w-5xl aspect-video relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            <iframe
              src={`${car.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={`Cinematic film for ${car.name}`}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Bottom video description text */}
          <div className="mt-8 text-center text-white/50 max-w-xl">
            <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.2em] font-bold block mb-1 uppercase">{car.tagline}</span>
            <p className="font-body-md text-xs tracking-wide">Press ESC or click the Close button to return to specifications.</p>
          </div>
        </div>
      )}

      {/* Sticky bottom booking banner */}
      <StickyCTA carName={car.name} carPrice={car.price} />
      
      {/* Spacer to avoid sticky CTA overlap */}
      <div className="h-[120px]" />
    </div>
  );
}
