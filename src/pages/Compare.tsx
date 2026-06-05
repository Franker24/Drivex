import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { db, User } from '../services/db';
import AuthModal from '../components/AuthModal';
import VehicleConfigurator3D from '../components/3d/VehicleConfigurator3D';

interface VehicleSpec {
  engine: string;
  hp: number;
  hpStr: string;
  torque: string;
  acceleration: number;
  accelerationStr: string;
  aeroVal: number;
  responseVal: number;
  stabilityVal: number;
}

interface CompareVehicle {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceFormatted: string;
  type: string;
  image: string;
  alt: string;
  specs: VehicleSpec;
}

const VEHICLES_DATABASE: CompareVehicle[] = [
  {
    id: 'phantom-zenith',
    name: 'Phantom Zenith',
    brand: 'DRIVEX',
    price: 245000,
    priceFormatted: '$245,000',
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Midnight black Phantom Zenith in gallery.',
    specs: {
      engine: 'DUAL MOTOR ELECTRIC',
      hp: 650,
      hpStr: '650 HP',
      torque: '710 LB-FT',
      acceleration: 3.8,
      accelerationStr: '3.8 SEC',
      aeroVal: 91,
      responseVal: 95,
      stabilityVal: 96
    }
  },
  {
    id: 'apex-gtr',
    name: 'Apex GT-R',
    brand: 'DRIVEX',
    price: 310000,
    priceFormatted: '$310,000',
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    alt: 'Apex GT-R carbon edition.',
    specs: {
      engine: '4.0L V8 HYBRID',
      hp: 1020,
      hpStr: '1020 HP',
      torque: '850 LB-FT',
      acceleration: 1.9,
      accelerationStr: '1.9 SEC',
      aeroVal: 99,
      responseVal: 99,
      stabilityVal: 98
    }
  },
  {
    id: 'lumina-s-class',
    name: 'Lumina S-Class',
    brand: 'DRIVEX',
    price: 185000,
    priceFormatted: '$185,000',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    alt: 'Lumina S-Class premium luxury sedan.',
    specs: {
      engine: '3.0L V6 TWIN-TURBO',
      hp: 450,
      hpStr: '450 HP',
      torque: '420 LB-FT',
      acceleration: 4.2,
      accelerationStr: '4.2 SEC',
      aeroVal: 88,
      responseVal: 90,
      stabilityVal: 92
    }
  },
  {
    id: 'porsche-911-gt3',
    name: 'Porsche 911 GT3',
    brand: 'PORSCHE',
    price: 182900,
    priceFormatted: '$182,900',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Silver Porsche 911 GT3.',
    specs: {
      engine: '4.0L FLAT-6',
      hp: 502,
      hpStr: '502 HP',
      torque: '346 LB-FT',
      acceleration: 3.2,
      accelerationStr: '3.2 SEC',
      aeroVal: 92,
      responseVal: 98,
      stabilityVal: 97
    }
  },
  {
    id: 'mclaren-artura',
    name: 'McLaren Artura',
    brand: 'MCLAREN',
    price: 233000,
    priceFormatted: '$233,000',
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    alt: 'McLaren Artura.',
    specs: {
      engine: '3.0L V6 HYBRID',
      hp: 671,
      hpStr: '671 HP',
      torque: '531 LB-FT',
      acceleration: 3.0,
      accelerationStr: '3.0 SEC',
      aeroVal: 95,
      responseVal: 96,
      stabilityVal: 94
    }
  },
  {
    id: 'ferrari-roma',
    name: 'Ferrari Roma',
    brand: 'FERRARI',
    price: 243360,
    priceFormatted: '$243,360',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vibrant red Ferrari Roma.',
    specs: {
      engine: '3.9L V8 TWIN-TURBO',
      hp: 612,
      hpStr: '612 HP',
      torque: '561 LB-FT',
      acceleration: 3.4,
      accelerationStr: '3.4 SEC',
      aeroVal: 90,
      responseVal: 94,
      stabilityVal: 93
    }
  },
  {
    id: 'tesla-model-s-plaid',
    name: 'Tesla Model S Plaid',
    brand: 'TESLA',
    price: 89990,
    priceFormatted: '$89,990',
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    alt: 'Tesla Model S Plaid.',
    specs: {
      engine: 'TRI-MOTOR ELECTRIC',
      hp: 1020,
      hpStr: '1020 HP',
      torque: '1050 LB-FT',
      acceleration: 1.99,
      accelerationStr: '1.99 SEC',
      aeroVal: 89,
      responseVal: 99,
      stabilityVal: 95
    }
  },
  {
    id: 'taycan-turbo-s',
    name: 'Porsche Taycan Turbo S',
    brand: 'PORSCHE',
    price: 194900,
    priceFormatted: '$194,900',
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Porsche Taycan Turbo S.',
    specs: {
      engine: 'DUAL ELECTRIC MOTORS',
      hp: 750,
      hpStr: '750 HP',
      torque: '774 LB-FT',
      acceleration: 2.6,
      accelerationStr: '2.6 SEC',
      aeroVal: 91,
      responseVal: 98,
      stabilityVal: 98
    }
  },
  {
    id: 'bespoke-720s',
    name: 'Bespoke McLaren 720S',
    brand: 'MCLAREN',
    price: 310500,
    priceFormatted: '$310,500',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bespoke McLaren 720S.',
    specs: {
      engine: '4.0L V8 TWIN-TURBO',
      hp: 710,
      hpStr: '710 HP',
      torque: '568 LB-FT',
      acceleration: 2.8,
      accelerationStr: '2.8 SEC',
      aeroVal: 97,
      responseVal: 95,
      stabilityVal: 94
    }
  },
  {
    id: 'aston-martin-vantage',
    name: 'Aston Martin Vantage',
    brand: 'ASTON MARTIN',
    price: 191000,
    priceFormatted: '$191,000',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Aston Martin Vantage',
    specs: {
      engine: '4.0L V8 TWIN-TURBO',
      hp: 503,
      hpStr: '503 HP',
      torque: '505 LB-FT',
      acceleration: 3.5,
      accelerationStr: '3.5 SEC',
      aeroVal: 90,
      responseVal: 94,
      stabilityVal: 93
    }
  },
  {
    id: 'audi-r8',
    name: 'Audi R8 Coupe',
    brand: 'AUDI',
    price: 158600,
    priceFormatted: '$158,600',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    alt: 'Audi R8 Coupe',
    specs: {
      engine: '5.2L V10',
      hp: 602,
      hpStr: '602 HP',
      torque: '413 LB-FT',
      acceleration: 3.2,
      accelerationStr: '3.2 SEC',
      aeroVal: 91,
      responseVal: 96,
      stabilityVal: 95
    }
  },
  {
    id: 'lamborghini-huracan',
    name: 'Lamborghini Huracán',
    brand: 'LAMBORGHINI',
    price: 248000,
    priceFormatted: '$248,000',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Lamborghini Huracán',
    specs: {
      engine: '5.2L V10',
      hp: 631,
      hpStr: '631 HP',
      torque: '443 LB-FT',
      acceleration: 2.9,
      accelerationStr: '2.9 SEC',
      aeroVal: 95,
      responseVal: 98,
      stabilityVal: 96
    }
  },
  {
    id: 'bentley-continental',
    name: 'Bentley Continental GT',
    brand: 'BENTLEY',
    price: 235000,
    priceFormatted: '$235,000',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1618843479619-f41987ba05a3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bentley Continental GT',
    specs: {
      engine: '6.0L W12 TWIN-TURBO',
      hp: 626,
      hpStr: '626 HP',
      torque: '664 LB-FT',
      acceleration: 3.6,
      accelerationStr: '3.6 SEC',
      aeroVal: 89,
      responseVal: 92,
      stabilityVal: 95
    }
  },
  {
    id: 'bmw-i8',
    name: 'BMW i8 Roadster',
    brand: 'BMW',
    price: 147500,
    priceFormatted: '$147,500',
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    alt: 'BMW i8 Roadster',
    specs: {
      engine: '1.5L 3-CYLINDER HYBRID',
      hp: 369,
      hpStr: '369 HP',
      torque: '420 LB-FT',
      acceleration: 4.4,
      accelerationStr: '4.4 SEC',
      aeroVal: 91,
      responseVal: 93,
      stabilityVal: 92
    }
  },
  {
    id: 'corvette-z06',
    name: 'Corvette Z06',
    brand: 'CHEVROLET',
    price: 112000,
    priceFormatted: '$112,000',
    type: 'Combustion',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Corvette Z06',
    specs: {
      engine: '5.5L V8',
      hp: 670,
      hpStr: '670 HP',
      torque: '460 LB-FT',
      acceleration: 2.6,
      accelerationStr: '2.6 SEC',
      aeroVal: 94,
      responseVal: 95,
      stabilityVal: 94
    }
  }
];

export default function Compare() {
  const [car1Id, setCar1Id] = useState('phantom-zenith');
  const [car2Id, setCar2Id] = useState('apex-gtr');

  // Build & Price Modal States
  const [configuringCar, setConfiguringCar] = useState<CompareVehicle | null>(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedWheel, setSelectedWheel] = useState('standard');
  const [selectedInterior, setSelectedInterior] = useState('standard');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buildSubmitted, setBuildSubmitted] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  
  // Stripe Sandbox states
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const handleAuth = () => {
      setCurrentUser(db.getCurrentUser());
    };
    window.addEventListener('auth_change', handleAuth);
    return () => window.removeEventListener('auth_change', handleAuth);
  }, []);

  const handleAuthSuccess = () => {
    const activeUser = db.getCurrentUser();
    if (activeUser && configuringCar) {
      const selectedPaintObj = colors.find(c => c.id === selectedColor) || colors[0];
      const selectedWheelObj = wheels.find(w => w.id === selectedWheel) || wheels[0];
      const selectedInteriorObj = interiors.find(i => i.id === selectedInterior) || interiors[0];

      db.addGarageItem({
        userId: activeUser.id,
        carId: configuringCar.id,
        carName: configuringCar.name,
        paint: { name: selectedPaintObj.name, hex: selectedPaintObj.hex, price: selectedPaintObj.price },
        wheels: { name: selectedWheelObj.name, price: selectedWheelObj.price },
        interior: { name: selectedInteriorObj.name, price: selectedInteriorObj.price },
        totalPrice: finalPrice
      });

      setSaveSuccess('Configuration saved successfully to My Garage!');
      setTimeout(() => setSaveSuccess(''), 3000);
    }
  };

  const handleSaveConfig = () => {
    if (!configuringCar) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const selectedPaintObj = colors.find(c => c.id === selectedColor) || colors[0];
    const selectedWheelObj = wheels.find(w => w.id === selectedWheel) || wheels[0];
    const selectedInteriorObj = interiors.find(i => i.id === selectedInterior) || interiors[0];

    db.addGarageItem({
      userId: currentUser.id,
      carId: configuringCar.id,
      carName: configuringCar.name,
      paint: { name: selectedPaintObj.name, hex: selectedPaintObj.hex, price: selectedPaintObj.price },
      wheels: { name: selectedWheelObj.name, price: selectedWheelObj.price },
      interior: { name: selectedInteriorObj.name, price: selectedInteriorObj.price },
      totalPrice: finalPrice
    });

    setSaveSuccess('Configuration saved successfully to My Garage!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleanNum)) return 'Mastercard';
    if (/^3[47]/.test(cleanNum)) return 'Amex';
    return 'Credit Card';
  };

  const handleStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 15) {
      setPaymentError('Invalid card number. Must be 15 or 16 digits.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      setPaymentError('Invalid expiry. Format MM/YY.');
      return;
    }
    if (cardCvc.length < 3) {
      setPaymentError('Invalid CVC.');
      return;
    }
    if (!cardName) {
      setPaymentError('Please enter cardholder name.');
      return;
    }

    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      
      const paintObj = colors.find(c => c.id === selectedColor) || colors[0];
      const wheelObj = wheels.find(w => w.id === selectedWheel) || wheels[0];
      const interiorObj = interiors.find(i => i.id === selectedInterior) || interiors[0];

      db.addBooking({
        userId: currentUser?.id,
        name: cardName,
        email: currentUser?.email || 'guest@stripe-sandbox.com',
        phone: '+1 (555) STRIPE',
        carId: configuringCar?.id || '',
        carName: configuringCar?.name || '',
        date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        timeSlot: '02:00 PM - 04:00 PM',
        status: 'approved',
        notes: `PRE-PAID RESERVE ($5,000 hold authorized via Stripe Simulator). Client: ${cardName}. Config specs - Paint: ${paintObj.name}, Wheels: ${wheelObj.name}, Interior: ${interiorObj.name}.`
      });

      setTimeout(() => {
        setStripeModalOpen(false);
        setPaymentSuccess(false);
        setConfiguringCar(null);
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setCardName('');
      }, 2500);

    }, 2000);
  };

  const car1 = VEHICLES_DATABASE.find(c => c.id === car1Id) || VEHICLES_DATABASE[0];
  const car2 = VEHICLES_DATABASE.find(c => c.id === car2Id) || VEHICLES_DATABASE[1];

  const colors = [
    { id: 'black', name: 'Obsidian Black Metallic', price: 0, hex: '#11131c' },
    { id: 'white', name: 'Guards Chalk White', price: 1500, hex: '#e8e8e8' },
    { id: 'red', name: 'Monza Racing Red', price: 2800, hex: '#ba1a1a' },
    { id: 'gold', name: 'DRIVEX Liquid Gold', price: 4500, hex: '#e5c188' }
  ];

  const wheels = [
    { id: 'standard', name: '20" Sport Aero Alloy', price: 0 },
    { id: 'track', name: '21" Forged Carbon Track Wheels', price: 5500 }
  ];

  const interiors = [
    { id: 'standard', name: 'Premium Full Grain Nappa Leather', price: 0 },
    { id: 'alcantara', name: 'Race Alcantara & Matte Carbon Trim', price: 3800 }
  ];

  // Dynamic Price Calculation
  const finalPrice = configuringCar 
    ? configuringCar.price + 
      (colors.find(c => c.id === selectedColor)?.price || 0) +
      (wheels.find(w => w.id === selectedWheel)?.price || 0) +
      (interiors.find(i => i.id === selectedInterior)?.price || 0)
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleBuildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBuildSubmitted(true);
  };

  const openConfigurator = (car: CompareVehicle) => {
    setConfiguringCar(car);
    setSelectedColor('black');
    setSelectedWheel('standard');
    setSelectedInterior('standard');
    setBuyerName('');
    setBuyerEmail('');
    setBuildSubmitted(false);
  };

  // spring animations for modal
  const modalSpring = useSpring({
    opacity: configuringCar ? 1 : 0,
    transform: configuringCar ? 'scale(1)' : 'scale(0.95)',
    pointerEvents: configuringCar ? 'auto' : 'none' as const,
    config: { tension: 300, friction: 26 }
  });

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pb-16">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .golden-border-hover:hover {
          border-color: #e5c188;
          box-shadow: 0 10px 30px -15px rgba(229, 193, 136, 0.3);
        }
      `}</style>

      {/* Comparison Header */}
      <section className="max-w-container-max-width mx-auto px-grid-margin pt-16 pb-8 text-center text-black">
        <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.25em] block mb-3 uppercase">PERFORMANCE EVALUATOR</span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-headline-lg text-primary uppercase font-extrabold tracking-tight">
          Compare Models
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4">
          Analyze the engineering precision and performance specs of our luxury fleet side-by-side. Select any two vehicles to begin.
        </p>
      </section>

      {/* Main Comparison Canvas */}
      <section className="max-w-container-max-width mx-auto px-grid-margin pb-24 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative">
          
          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/30 transform -translate-x-1/2 z-0"></div>

          {/* Column 1: Left Vehicle Selector & Card */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Vehicle Selector 1 */}
            <div className="w-full max-w-md mb-8 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant mb-2 tracking-widest uppercase">SELECT VEHICLE A</label>
              <select 
                value={car1Id}
                onChange={(e) => setCar1Id(e.target.value)}
                className="w-full bg-white border border-outline-variant/50 px-4 py-3 rounded-lg focus:ring-2 focus:ring-secondary-fixed-dim outline-none cursor-pointer font-semibold"
              >
                {VEHICLES_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>{c.brand} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="w-full aspect-[16/10] mb-8 relative rounded-xl overflow-hidden shadow-lg border border-outline-variant/10">
                <img 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                  alt={car1.alt} 
                  src={car1.image} 
                />
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 font-label-caps text-[10px] text-secondary-fixed-dim rounded tracking-widest">
                  {car1.type.toUpperCase()}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold uppercase tracking-tight">{car1.name}</h2>
              <p className="font-label-caps text-label-caps text-secondary-fixed-dim mt-2 tracking-widest uppercase">
                {car1.brand} • {formatCurrency(car1.price)}
              </p>

              {/* Dynamic Performance Spec Card */}
              <div className="w-full glass-panel rounded-xl p-8 border border-outline-variant/20 shadow-md mt-8 flex-grow">
                <h3 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4 uppercase tracking-wider">
                  Technical DNA
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ENGINE / DUAL-MOTOR</span>
                    <span className="font-body-md text-primary font-bold text-right">{car1.specs.engine}</span>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>HORSEPOWER</span>
                      <span className="text-primary font-bold">{car1.specs.hpStr}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${(car1.specs.hp / 1100) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>0-60 MPH (LAUCH SPRINT)</span>
                      <span className="text-primary font-bold">{car1.specs.accelerationStr}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      {/* Inverse: shorter time is better, so width = (10 - acceleration) * 10% */}
                      <div className="bg-secondary-fixed-dim h-full transition-all duration-700 ease-out" style={{ width: `${(10 - car1.specs.acceleration) * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>AERODYNAMIC DOWNFORCE</span>
                      <span className="text-primary font-bold">{car1.specs.aeroVal}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${car1.specs.aeroVal}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => openConfigurator(car1)}
                className="w-full mt-8 bg-primary text-on-primary py-4 font-label-caps text-label-caps rounded-lg hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 font-bold tracking-widest shadow-md active:scale-[0.99]"
              >
                BUILD & PRICE
              </button>
            </div>
          </div>

          {/* Column 2: Right Vehicle Selector & Card */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Vehicle Selector 2 */}
            <div className="w-full max-w-md mb-8 flex flex-col">
              <label className="font-label-caps text-[10px] text-on-surface-variant mb-2 tracking-widest uppercase">SELECT VEHICLE B</label>
              <select 
                value={car2Id}
                onChange={(e) => setCar2Id(e.target.value)}
                className="w-full bg-white border border-outline-variant/50 px-4 py-3 rounded-lg focus:ring-2 focus:ring-secondary-fixed-dim outline-none cursor-pointer font-semibold"
              >
                {VEHICLES_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>{c.brand} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="w-full aspect-[16/10] mb-8 relative rounded-xl overflow-hidden shadow-lg border border-outline-variant/10">
                <img 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
                  alt={car2.alt} 
                  src={car2.image} 
                />
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 font-label-caps text-[10px] text-secondary-fixed-dim rounded tracking-widest">
                  {car2.type.toUpperCase()}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold uppercase tracking-tight">{car2.name}</h2>
              <p className="font-label-caps text-label-caps text-secondary-fixed-dim mt-2 tracking-widest uppercase">
                {car2.brand} • {formatCurrency(car2.price)}
              </p>

              {/* Dynamic Performance Spec Card */}
              <div className="w-full glass-panel rounded-xl p-8 border border-outline-variant/20 shadow-md mt-8 flex-grow">
                <h3 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4 uppercase tracking-wider">
                  Technical DNA
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ENGINE / DUAL-MOTOR</span>
                    <span className="font-body-md text-primary font-bold text-right">{car2.specs.engine}</span>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>HORSEPOWER</span>
                      <span className="text-primary font-bold">{car2.specs.hpStr}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${(car2.specs.hp / 1100) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>0-60 MPH (LAUCH SPRINT)</span>
                      <span className="text-primary font-bold">{car2.specs.accelerationStr}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-secondary-fixed-dim h-full transition-all duration-700 ease-out" style={{ width: `${(10 - car2.specs.acceleration) * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>AERODYNAMIC DOWNFORCE</span>
                      <span className="text-primary font-bold">{car2.specs.aeroVal}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${car2.specs.aeroVal}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => openConfigurator(car2)}
                className="w-full mt-8 bg-transparent border-2 border-primary text-primary py-4 font-label-caps text-label-caps rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-bold tracking-widest shadow-md active:scale-[0.99]"
              >
                BUILD & PRICE
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Build & Price Customization Modal */}
      {configuringCar && (
        <animated.div 
          style={modalSpring}
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-10"
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-y-auto md:overflow-hidden border border-outline-variant/30 relative flex flex-col md:flex-row text-black max-h-[95vh] md:max-h-[90vh]">
            
            {/* Modal Exit Button */}
            <button 
              onClick={() => setConfiguringCar(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/80 hover:bg-secondary-fixed-dim text-white hover:text-black rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left: Vehicle Show Image & Option Details */}
            <div className="w-full md:w-1/2 bg-surface-container-low p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline-variant/30 shrink-0">
              <div>
                <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.2em] uppercase">CUSTOM CONFIGURATOR</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-primary uppercase mt-1">{configuringCar.name}</h2>
                <p className="font-body-md text-on-surface-variant mt-2 text-xs md:text-sm">{configuringCar.brand} specification profile.</p>
                
                {/* 3D Configurator Canvas instead of static image */}
                <div className="mt-4 md:mt-6 rounded-xl overflow-hidden shadow-md border border-outline-variant/15 aspect-video h-[200px] md:h-[250px]">
                  <VehicleConfigurator3D 
                    paintColor={colors.find(c => c.id === selectedColor)?.hex || '#11131c'} 
                    wheelStyle={wheels.find(w => w.id === selectedWheel)?.name || 'standard'} 
                  />
                </div>
              </div>

              <div className="mt-6 md:mt-8 border-t border-outline-variant/20 pt-4 md:pt-6">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">TOTAL INVESTMENT</span>
                <div className="text-display-lg-mobile text-[28px] md:text-[34px] font-extrabold text-primary mt-1">
                  {formatCurrency(finalPrice)}
                </div>
                <div className="flex flex-col gap-1.5 mt-4 text-[12px] md:text-[13px] text-on-surface-variant font-medium">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span className="font-semibold">{formatCurrency(configuringCar.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Paint</span>
                    <span className="font-semibold text-secondary-fixed-dim">+{formatCurrency(colors.find(c => c.id === selectedColor)?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Wheels</span>
                    <span className="font-semibold text-secondary-fixed-dim">+{formatCurrency(wheels.find(w => w.id === selectedWheel)?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interior Trim</span>
                    <span className="font-semibold text-secondary-fixed-dim">+{formatCurrency(interiors.find(i => i.id === selectedInterior)?.price || 0)}</span>
                  </div>
                </div>

                {/* Save and Reserve Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                  {saveSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs p-2.5 rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="font-medium">{saveSuccess}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      className="bg-[#111] hover:bg-black text-white border border-[#222] font-semibold text-xs py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Save Config</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStripeModalOpen(true)}
                      className="bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(229,193,136,0.15)]"
                    >
                      <span className="material-symbols-outlined text-base">payments</span>
                      <span>Reserve</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/70 text-center italic">
                    * Reserve secures priority delivery with a refundable $5,000 hold.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Options Selection Forms & Submission */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-visible md:overflow-y-auto">
              {!buildSubmitted ? (
                <form onSubmit={handleBuildSubmit} className="space-y-8">
                  {/* Option 1: Paint Color */}
                  <div>
                    <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4">01. Select Exterior Paint</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedColor(c.id)}
                          className={`p-3 border rounded-lg flex items-center gap-3 text-left transition-all ${
                            selectedColor === c.id 
                              ? 'border-secondary-fixed-dim ring-1 ring-secondary-fixed-dim bg-secondary-fixed-dim/5' 
                              : 'border-outline-variant bg-white'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: c.hex }}></span>
                          <div className="min-w-0">
                            <p className="font-body-md text-xs font-bold truncate leading-tight">{c.name}</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{c.price === 0 ? 'Included' : `+${formatCurrency(c.price)}`}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 2: Wheels */}
                  <div>
                    <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4">02. Select Wheels</h4>
                    <div className="flex flex-col gap-3">
                      {wheels.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWheel(w.id)}
                          className={`p-4 border rounded-lg text-left transition-all flex justify-between items-center ${
                            selectedWheel === w.id 
                              ? 'border-secondary-fixed-dim bg-secondary-fixed-dim/5' 
                              : 'border-outline-variant bg-white'
                          }`}
                        >
                          <div>
                            <p className="font-body-md text-xs font-bold">{w.name}</p>
                          </div>
                          <span className="font-label-caps text-[11px] text-secondary-fixed-dim font-bold">
                            {w.price === 0 ? 'Included' : `+${formatCurrency(w.price)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 3: Interior */}
                  <div>
                    <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-4">03. Select Interior Trim</h4>
                    <div className="flex flex-col gap-3">
                      {interiors.map((i) => (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => setSelectedInterior(i.id)}
                          className={`p-4 border rounded-lg text-left transition-all flex justify-between items-center ${
                            selectedInterior === i.id 
                              ? 'border-secondary-fixed-dim bg-secondary-fixed-dim/5' 
                              : 'border-outline-variant bg-white'
                          }`}
                        >
                          <div>
                            <p className="font-body-md text-xs font-bold">{i.name}</p>
                          </div>
                          <span className="font-label-caps text-[11px] text-secondary-fixed-dim font-bold">
                            {i.price === 0 ? 'Included' : `+${formatCurrency(i.price)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info to Finalize Build */}
                  <div className="border-t border-outline-variant/30 pt-6 space-y-4">
                    <h4 className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-2">04. Personal Information</h4>
                    <div className="relative flex flex-col">
                      <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-wider">FULL NAME</label>
                      <input 
                        required
                        type="text" 
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 py-2 outline-none"
                      />
                    </div>
                    <div className="relative flex flex-col">
                      <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-wider">EMAIL ADDRESS</label>
                      <input 
                        required
                        type="email" 
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps rounded-lg hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 font-bold tracking-widest shadow-md"
                  >
                    SUBMIT CUSTOM BUILD INQUIRY
                  </button>
                </form>
              ) : (
                /* Success screen */
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-8 animate-fade-in">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-secondary-fixed-dim/20 blur-2xl rounded-full animate-pulse"></div>
                    <span className="material-symbols-outlined text-[80px] text-secondary-fixed-dim relative" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-headline-lg text-headline-lg text-primary uppercase font-bold">Build Submitted</h3>
                    <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="font-bold text-black">{buyerName}</span>. Your customized <span className="font-bold text-black">{configuringCar.name}</span> config has been sent to our private consultants.
                    </p>
                    <p className="font-body-lg text-secondary-fixed-dim font-bold mt-2">
                      Total Build Cost: {formatCurrency(finalPrice)}
                    </p>
                    <p className="text-xs text-on-surface-variant/70 italic max-w-xs mx-auto mt-4">
                      A configuration review copy has been sent to {buyerEmail}.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfiguringCar(null)}
                    className="mt-8 border border-primary px-8 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-white transition-all rounded-lg"
                  >
                    CLOSE CONFIGURATOR
                  </button>
                </div>
              )}
            </div>

          </div>
        </animated.div>
      )}
      {/* Stripe checkout simulator modal */}
      {stripeModalOpen && configuringCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in px-4">
          <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl p-8 relative shadow-2xl overflow-hidden text-white">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-fixed-dim/10 rounded-full blur-[80px]" />
            
            <button 
              onClick={() => setStripeModalOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="text-center mb-6">
              <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.25em] font-bold uppercase">
                stripe payment sandbox
              </span>
              <h2 className="font-headline-md text-xl text-white font-bold mt-2 uppercase">
                Secure Reservation Hold
              </h2>
              <p className="text-white/60 text-xs mt-1">
                Authorizing a temporary refundable $5,000 reservation hold for your custom build.
              </p>
            </div>

            {paymentSuccess ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <span className="material-symbols-outlined text-6xl text-emerald-400 animate-bounce">check_circle</span>
                <h3 className="font-headline-md text-lg text-white font-bold">Hold Authorization Successful!</h3>
                <p className="text-white/60 text-xs max-w-xs mx-auto">
                  Your payment was processed successfully. Our concierge department will reach out to you within 24 hours to confirm delivery options.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Credit Card Preview Screen */}
                <div className="w-full h-44 rounded-xl bg-gradient-to-tr from-[#161616] to-[#262626] border border-white/10 p-5 flex flex-col justify-between relative shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-label-caps tracking-widest text-white/40 uppercase">Drivex Priority Card</p>
                      <h4 className="text-sm font-semibold text-secondary-fixed-dim mt-1 truncate max-w-[240px]">{configuringCar.name} Spec</h4>
                    </div>
                    <span className="material-symbols-outlined text-3xl text-secondary-fixed-dim/80">contactless</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-base tracking-[0.25em] font-mono text-white/80">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] text-white/30 uppercase tracking-wider font-label-caps">Cardholder</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/70 truncate max-w-[200px]">{cardName || 'YOUR NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-white/30 uppercase tracking-wider font-label-caps">Expires</p>
                        <p className="text-xs font-semibold text-white/70">{cardExpiry || 'MM/YY'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-white/30 uppercase tracking-wider font-label-caps">Type</p>
                        <p className="text-[10px] font-bold text-secondary-fixed-dim">{getCardType(cardNumber)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleStripePayment} className="space-y-4">
                  {paymentError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">error</span>
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/60 uppercase tracking-wider">Cardholder Name</label>
                    <input 
                      type="text"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors"
                      required
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/60 uppercase tracking-wider">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors font-mono"
                        maxLength={19}
                        required
                        disabled={paymentProcessing}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg text-white/30">credit_card</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-label-caps text-white/60 uppercase tracking-wider">Expiration Date</label>
                      <input 
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors font-mono"
                        maxLength={5}
                        required
                        disabled={paymentProcessing}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-label-caps text-white/60 uppercase tracking-wider">CVC</label>
                      <input 
                        type="password"
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors font-mono"
                        maxLength={4}
                        required
                        disabled={paymentProcessing}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 mt-6 shadow-[0_4px_20px_rgba(229,193,136,0.15)] flex items-center justify-center gap-2 cursor-pointer font-bold"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Processing Authorized Hold...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">lock</span>
                        <span>Authorize Refundable $5,000 Hold</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth modal instance for guests who save a config */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}
