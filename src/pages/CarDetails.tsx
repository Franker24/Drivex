import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import SpecsGrid from '../components/details/SpecsGrid';
import CarGallery from '../components/details/CarGallery';
import StickyCTA from '../components/details/StickyCTA';
import VehicleConfigurator3D from '../components/3d/VehicleConfigurator3D';
import { EngineSoundSynth } from '../utils/engineSynth';

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
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=1200&q=80',
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
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
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
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
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
}



export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const car = id ? (CARS_DETAILS_DATA[id] || DEFAULT_CAR) : DEFAULT_CAR;
  const [videoOpen, setVideoOpen] = useState(false);

  const getInitialColor = (carId: string) => {
    if (carId.includes('roma')) return '#ba1a1a';
    if (carId.includes('gt3')) return '#e8e8e8';
    if (carId.includes('zenith')) return '#e5c188';
    return '#11131c';
  };

  const [detailsPaintColor, setDetailsPaintColor] = useState(getInitialColor(id || ''));
  const [detailsWheelStyle, setDetailsWheelStyle] = useState('Standard Alloys');

  // --- Soundboard Engine Synthesis State ---
  const getEngineType = (carId: string): 'v8' | 'v10' | 'flat6' | 'electric' | 'default' => {
    const cid = carId.toLowerCase();
    if (cid.includes('gt3')) return 'flat6';
    if (cid.includes('huracan') || cid.includes('r8')) return 'v10';
    if (cid.includes('plaid') || cid.includes('taycan') || cid.includes('zenith')) return 'electric';
    if (cid.includes('roma') || cid.includes('720s') || cid.includes('artura') || cid.includes('vantage') || cid.includes('gtr') || cid.includes('corvette')) return 'v8';
    return 'default';
  };

  const [engineSynth, setEngineSynth] = useState<EngineSoundSynth | null>(null);
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [currentRPM, setCurrentRPM] = useState(800);
  const [throttle, setThrottle] = useState(0);

  const engineType = getEngineType(id || '');
  const maxRPM = engineType === 'flat6' ? 9000 : engineType === 'electric' ? 12000 : engineType === 'v10' ? 8500 : 7500;

  useEffect(() => {
    const synth = new EngineSoundSynth(engineType);
    synth.registerRPMCallback((rpm) => {
      setCurrentRPM(Math.round(rpm));
    });
    setEngineSynth(synth);
    setIsEngineOn(false);
    setThrottle(0);
    setCurrentRPM(engineType === 'electric' ? 0 : 800);

    return () => {
      synth.stop();
    };
  }, [id, engineType]);

  const handleToggleEngine = () => {
    if (!engineSynth) return;
    if (isEngineOn) {
      engineSynth.stop();
      setIsEngineOn(false);
      setThrottle(0);
      setCurrentRPM(engineType === 'electric' ? 0 : 800);
    } else {
      engineSynth.start();
      setIsEngineOn(true);
    }
  };

  const handleThrottleChange = (val: number) => {
    setThrottle(val);
    if (engineSynth && isEngineOn) {
      engineSynth.setThrottle(val);
    }
  };

  const handleRevStart = () => {
    if (!isEngineOn) return;
    handleThrottleChange(1.0);
  };

  const handleRevEnd = () => {
    handleThrottleChange(0.0);
  };

  // --- Financing & Leasing Calculator State ---
  const carPriceNumber = parseInt(car.price.replace(/[^0-9]/g, '')) || 150000;
  const [downPayment, setDownPayment] = useState(Math.round(carPriceNumber * 0.2));
  const [calcTerm, setCalcTerm] = useState(36);
  const [calcApr, setCalcApr] = useState(4.9);

  useEffect(() => {
    setDownPayment(Math.round(carPriceNumber * 0.2));
  }, [id, carPriceNumber]);

  // Calculations
  const residualFactors: Record<number, number> = {
    24: 0.62,
    36: 0.55,
    48: 0.48,
    60: 0.42,
    72: 0.35
  };
  const residualValue = carPriceNumber * (residualFactors[calcTerm] || 0.55);
  const capCost = Math.max(0, carPriceNumber - downPayment);
  const depreciationFee = Math.max(0, (capCost - residualValue) / calcTerm);
  const moneyFactor = calcApr / 2400;
  const rentCharge = (capCost + residualValue) * moneyFactor;
  const leasePayment = depreciationFee + rentCharge;
  const totalLeaseCost = leasePayment * calcTerm + downPayment;

  const loanAmount = Math.max(0, carPriceNumber - downPayment);
  const monthlyRate = (calcApr / 100) / 12;
  const financePayment = monthlyRate > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, calcTerm)) / (Math.pow(1 + monthlyRate, calcTerm) - 1)
    : loanAmount / calcTerm;
  const totalFinancedCost = financePayment * calcTerm + downPayment;
  const financeInterest = Math.max(0, financePayment * calcTerm - loanAmount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  useEffect(() => {
    setDetailsPaintColor(getInitialColor(id || ''));
  }, [id]);

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
          src={car.image} 
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

      {/* 3D Configurator Showroom Section */}
      <section className="bg-[#0b0b0b] text-white py-20 border-t border-b border-white/5">
        <div className="max-w-container-max-width mx-auto px-grid-margin grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] block font-bold uppercase">
              Bespoke Showroom
            </span>
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg text-white uppercase font-extrabold tracking-tight">
              Interactive 3D Showroom
            </h2>
            <p className="font-body-md text-white/70 leading-relaxed">
              Experience the {car.name} in an immersive 3D digital studio. Modify the paint finish in real-time, inspect aerodynamic shapes, and spin the car to view it from any angle.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Paint color selectors */}
              <div>
                <p className="text-[10px] font-label-caps text-white/50 tracking-wider uppercase mb-2">Exterior Paint</p>
                <div className="flex gap-3">
                  {[
                    { name: 'Obsidian Black', hex: '#11131c' },
                    { name: 'Chalk White', hex: '#e8e8e8' },
                    { name: 'Monza Red', hex: '#ba1a1a' },
                    { name: 'Liquid Gold', hex: '#e5c188' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setDetailsPaintColor(color.hex)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 cursor-pointer ${
                        detailsPaintColor === color.hex ? 'border-secondary-fixed-dim scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Wheel Selector */}
              <div className="pt-2">
                <p className="text-[10px] font-label-caps text-white/50 tracking-wider uppercase mb-2">Wheel Design</p>
                <div className="flex gap-2">
                  {['Standard Alloys', 'Dark Track Rims'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setDetailsWheelStyle(style)}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                        detailsWheelStyle === style 
                          ? 'border-secondary-fixed-dim text-secondary-fixed-dim bg-secondary-fixed-dim/5' 
                          : 'border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-white/5'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sensory Engine Soundboard */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <p className="text-[10px] font-label-caps text-white/50 tracking-wider uppercase mb-1">Acoustic Engine Soundboard</p>
                  <p className="text-[9.5px] text-white/40 leading-relaxed mb-3">
                    Ignite the virtual engine and press-and-hold the throttle to hear the acoustic signature of this machine.
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6">
                    {/* Left: Ignition Switch & RPM Dial */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      {/* circular RPM gauge */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-225" viewBox="0 0 120 120">
                          {/* Track */}
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            className="stroke-white/5 fill-none"
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 50 * 0.75} ${2 * Math.PI * 50 * 0.25}`}
                            strokeLinecap="round"
                          />
                          {/* Active level */}
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            className={`fill-none transition-all duration-75 ${
                              isEngineOn 
                                ? currentRPM > maxRPM * 0.85
                                  ? 'stroke-red-500'
                                  : 'stroke-secondary-fixed-dim' 
                                : 'stroke-transparent'
                            }`}
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 50 * 0.75}`}
                            strokeDashoffset={2 * Math.PI * 50 * 0.75 * (1 - currentRPM / maxRPM)}
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className={`text-[13px] font-mono font-bold leading-none ${isEngineOn ? 'text-white' : 'text-white/20'}`}>
                            {isEngineOn ? currentRPM : '0'}
                          </span>
                          <span className="text-[8px] font-label-caps text-white/40 tracking-wider mt-1">RPM</span>
                        </div>
                      </div>
                      
                      {/* Ignition button */}
                      <button
                        type="button"
                        onClick={handleToggleEngine}
                        className={`px-4 py-2 rounded-lg text-[9px] font-label-caps tracking-widest font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isEngineOn
                            ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 hover:scale-105'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
                        <span>{isEngineOn ? 'Engine Stop' : 'Engine Start'}</span>
                      </button>
                    </div>

                    {/* Right: Throttle Rev Button / Info */}
                    <div className="flex-grow w-full space-y-3">
                      <div>
                        <span className="text-[8px] font-label-caps text-secondary-fixed-dim font-bold block uppercase tracking-wider">
                          Active Signature: {engineType.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-white/60 block mt-0.5 font-medium leading-normal">
                          {engineType === 'electric' 
                            ? 'Futuristic variable-pitch dual electromagnetic drive whine' 
                            : engineType === 'flat6'
                              ? 'High-revving naturally aspirated Flat-6 with 9,000 RPM redline'
                              : engineType === 'v10'
                                ? 'Mid-mounted naturally aspirated V10 exhaust scream'
                                : 'Twin-turbocharged crossplane V8 performance rumble'
                          }
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="space-y-2">
                        {/* Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-label-caps text-white/40">
                            <span>Idle</span>
                            <span>Throttle: {Math.round(throttle * 100)}%</span>
                            <span>Max Rev</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={throttle}
                            onChange={(e) => handleThrottleChange(parseFloat(e.target.value))}
                            disabled={!isEngineOn}
                            className="w-full accent-secondary-fixed-dim bg-white/10 rounded-lg h-1 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                          />
                        </div>

                        {/* Press and hold button */}
                        <button
                          type="button"
                          onMouseDown={handleRevStart}
                          onMouseUp={handleRevEnd}
                          onMouseLeave={handleRevEnd}
                          onTouchStart={handleRevStart}
                          onTouchEnd={handleRevEnd}
                          disabled={!isEngineOn}
                          className="w-full bg-secondary-fixed-dim hover:bg-white text-black disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 border border-transparent font-bold text-[9px] font-label-caps py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">speed</span>
                          <span>Press & Hold to Rev</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/15 h-[300px] md:h-[350px]">
              <VehicleConfigurator3D paintColor={detailsPaintColor} wheelStyle={detailsWheelStyle} />
            </div>
          </div>
          
        </div>
      </section>

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
            src={car.image} 
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

      {/* Leasing & Finance Calculator Section */}
      <section className="bg-[#0b0b0b] text-white py-20 border-t border-white/5">
        <div className="max-w-container-max-width mx-auto px-grid-margin">
          <div className="mb-12 text-center">
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] block mb-2 font-bold uppercase">Acquisition Studio</span>
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg text-white uppercase font-extrabold tracking-tight">Leasing & Finance Calculator</h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto mt-2">Compare bespoke luxury lease acquisition with premium amortized financing terms configured for this vehicle.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Sliders (7 cols) */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="font-label-caps text-[11px] text-secondary-fixed-dim tracking-wider font-extrabold uppercase pb-3 border-b border-white/5">Configure Acquisition Profile</h3>
              
              {/* Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/70">Down Payment</span>
                  <span className="text-white font-mono">{formatCurrency(downPayment)} <span className="text-white/40">({Math.round(downPayment / carPriceNumber * 100)}%)</span></span>
                </div>
                <input
                  type="range"
                  min={Math.round(carPriceNumber * 0.1)}
                  max={Math.round(carPriceNumber * 0.5)}
                  step={1000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full accent-secondary-fixed-dim bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-label-caps text-white/30">
                  <span>Min: 10% ({formatCurrency(carPriceNumber * 0.1)})</span>
                  <span>Max: 50% ({formatCurrency(carPriceNumber * 0.5)})</span>
                </div>
              </div>

              {/* Term Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white/70 block">Financing Term</span>
                <div className="grid grid-cols-5 gap-2">
                  {[24, 36, 48, 60, 72].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCalcTerm(m)}
                      className={`py-2.5 rounded-lg border text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                        calcTerm === m 
                          ? 'border-secondary-fixed-dim text-secondary-fixed-dim bg-secondary-fixed-dim/5' 
                          : 'border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-white/5'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>

              {/* APR Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/70">Interest Rate (APR)</span>
                  <span className="text-white font-mono">{calcApr.toFixed(1)}% APR</span>
                </div>
                <input
                  type="range"
                  min={2.9}
                  max={9.9}
                  step={0.1}
                  value={calcApr}
                  onChange={(e) => setCalcApr(parseFloat(e.target.value))}
                  className="w-full accent-secondary-fixed-dim bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-label-caps text-white/30">
                  <span>Min: 2.9%</span>
                  <span>Max: 9.9%</span>
                </div>
              </div>
            </div>

            {/* Right: Results Comparison Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Lease Estimate Card */}
              <div className="bg-[#121212] border border-secondary-fixed-dim/20 rounded-2xl p-6 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 bg-secondary-fixed-dim text-black font-label-caps text-[8px] font-extrabold px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                  RECOMMENDED
                </div>
                <span className="text-[9px] font-label-caps text-white/50 tracking-wider block uppercase">BESPOKE LEASE ACQUISITION</span>
                <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
                  {formatCurrency(leasePayment)}
                  <span className="text-xs text-white/40 font-normal">/ mo</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-[11px] text-white/60">
                  <div className="flex justify-between">
                    <span>Capitalized Cost:</span>
                    <span className="font-semibold text-white">{formatCurrency(capCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term Residual ({Math.round((residualFactors[calcTerm] || 0.55)*100)}%):</span>
                    <span className="font-semibold text-white">{formatCurrency(residualValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rent Charge:</span>
                    <span className="font-semibold text-white">{formatCurrency(rentCharge * calcTerm)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5 font-semibold text-white">
                    <span>Total Lease Investment:</span>
                    <span className="text-secondary-fixed-dim">{formatCurrency(totalLeaseCost)}</span>
                  </div>
                </div>
              </div>

              {/* Finance Estimate Card */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-xl">
                <span className="text-[9px] font-label-caps text-white/50 tracking-wider block uppercase">AMORTIZED PURCHASE LOAN</span>
                <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
                  {formatCurrency(financePayment)}
                  <span className="text-xs text-white/40 font-normal">/ mo</span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-[11px] text-white/60">
                  <div className="flex justify-between">
                    <span>Amount Financed:</span>
                    <span className="font-semibold text-white">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Finance Interest:</span>
                    <span className="font-semibold text-white">{formatCurrency(financeInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5 font-semibold text-white">
                    <span>Total Financed Cost:</span>
                    <span className="text-secondary-fixed-dim">{formatCurrency(totalFinancedCost)}</span>
                  </div>
                </div>
              </div>
            </div>
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
