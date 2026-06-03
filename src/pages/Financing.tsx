import { useState, useMemo, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface FinancingPlan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
  apr: number;
}

export default function Financing() {
  const [price, setPrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(50000);
  const [term, setTerm] = useState(60);

  // Active financing plan modal
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Application form states
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appData, setAppData] = useState({ name: '', email: '', phone: '' });

  const interestRate = 0.059; // 5.9% APR base

  // Calculate traditional financing outputs
  const { monthlyPayment, principal } = useMemo(() => {
    const actualDown = Math.min(downPayment, price);
    const principalVal = price - actualDown;
    const monthlyRate = interestRate / 12;
    
    let paymentVal = 0;
    if (principalVal > 0) {
      paymentVal =
        (principalVal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);
    }
    return {
      monthlyPayment: paymentVal,
      principal: principalVal,
    };
  }, [price, downPayment, term]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Spring animation for monthly payment counter
  const paymentSpring = useSpring({
    val: monthlyPayment,
    config: { tension: 150, friction: 18 }
  });

  const plans: FinancingPlan[] = [
    {
      id: 'select',
      name: 'DriveX Select',
      tagline: 'Traditional ownership with fixed rates.',
      description: 'Traditional financing option providing full ownership of the vehicle from day one with fixed rates and no mileage limits.',
      icon: 'workspace_premium',
      features: ['Up to 84 months terms', 'Fixed 5.9% APR rate', 'No mileage limitations', 'Build vehicle equity'],
      apr: 0.059
    },
    {
      id: 'lease',
      name: 'DriveX Lease',
      tagline: 'Visceral variety. Drive a new supercar every 2-3 years.',
      description: 'Flexible leasing structure that allows you to experience a new vehicle every few years with lower monthly payments.',
      icon: 'autorenew',
      features: ['24 to 48 months terms', 'Lower monthly payments', 'Option to buy out at end', 'Corporate tax benefits'],
      apr: 0.045
    },
    {
      id: 'balloon',
      name: 'DriveX Balloon',
      tagline: 'Preserve capital. Low monthly payments, lump sum at end.',
      description: 'Maintains cash flow by keeping monthly payments low, concluding with a larger balloon payment at the end of the term.',
      icon: 'account_balance',
      features: ['36 to 60 months terms', 'Preserve working capital', 'Refinance balloon payment', 'Trade-in at term end'],
      apr: 0.062
    }
  ];

  const activePlan = plans.find(p => p.id === activePlanId);

  // Calculate detailed pricing for the active plan modal
  const modalCalculations = useMemo(() => {
    if (!activePlan) return null;
    const actualDown = Math.min(downPayment, price);
    const principalVal = price - actualDown;
    const rate = activePlan.apr;
    const monthlyRate = rate / 12;

    let pay = 0;
    let balloonLump = 0;

    if (activePlan.id === 'select') {
      if (principalVal > 0) {
        pay = (principalVal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      }
    } else if (activePlan.id === 'lease') {
      // Lease depreciates about 45% of value, pay on that depreciation
      const residualValue = price * 0.55;
      const depreciation = price - actualDown - residualValue;
      const monthlyDepreciation = depreciation > 0 ? depreciation / term : 0;
      const moneyFactor = (rate + 0.01) / 24; // lease factor
      const financeCharge = (price - actualDown + residualValue) * moneyFactor;
      pay = Math.max(0, monthlyDepreciation + financeCharge);
    } else if (activePlan.id === 'balloon') {
      // 35% residual balloon lump sum at the end
      balloonLump = price * 0.35;
      const financedAmount = principalVal - balloonLump;
      const monthlyRateVal = rate / 12;
      const basePay = financedAmount > 0 
        ? (financedAmount * monthlyRateVal * Math.pow(1 + monthlyRateVal, term)) / (Math.pow(1 + monthlyRateVal, term) - 1)
        : 0;
      const interestOnLump = balloonLump * monthlyRateVal;
      pay = Math.max(0, basePay + interestOnLump);
    }

    return {
      payment: pay,
      balloon: balloonLump,
      financed: principalVal
    };
  }, [activePlan, price, downPayment, term]);

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitted(true);
  };

  // Ensure downpayment is capped if price drops
  useEffect(() => {
    if (downPayment > price) {
      setDownPayment(price);
    }
  }, [price]);

  // Spring animation for modal opening
  const modalSpring = useSpring({
    opacity: activePlanId ? 1 : 0,
    transform: activePlanId ? 'scale(1)' : 'scale(0.95)',
    pointerEvents: activePlanId ? 'auto' : 'none' as const,
    config: { tension: 320, friction: 24 }
  });

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pb-16">
      <style>{`
        .glass-panel {
          backdrop-filter: blur(25px);
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .luxury-card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .luxury-card-hover:hover {
          transform: translateY(-8px);
          border-color: #e5c188;
          box-shadow: 0 25px 50px -12px rgba(229, 193, 136, 0.25);
        }
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #e5c188;
          border: 2px solid #11131c;
          cursor: pointer;
          margin-top: -10px;
          box-shadow: 0 0 10px rgba(229, 193, 136, 0.5);
          transition: transform 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #e8e8e8;
          border-radius: 2px;
        }
      `}</style>

      <main className="max-w-container-max-width mx-auto px-grid-margin py-12 md:py-16 text-black">
        
        {/* Hero Header */}
        <section className="mb-16 flex flex-col items-center text-center">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.25em] block mb-3 uppercase">FINANCIAL PORTFOLIO</span>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg mb-4 uppercase font-extrabold tracking-tight">
            Own the Exceptional.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Bespoke financing solutions tailored for the world's most distinguished automobiles. Experience the prestige of DRIVEX ownership with flexible terms and uncompromising service.
          </p>
        </section>

        {/* Calculator Bento Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter mb-24 items-stretch">
          
          {/* Main Calculator Input Panel */}
          <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-2xl p-8 shadow-lg relative overflow-hidden flex flex-col justify-between">
            {/* Custom stylized background texture */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=1200&q=80')", 
                backgroundSize: "cover", 
                backgroundPosition: "center" 
              }}
            />
            
            <div className="relative z-10 space-y-8">
              <h3 className="font-headline-md text-headline-md mb-6 uppercase font-bold tracking-tight text-primary">Estimate Your Investment</h3>
              
              {/* Vehicle Price Slider */}
              <div>
                <div className="flex justify-between mb-3 items-end">
                  <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider font-semibold">VEHICLE PRICE</label>
                  <span className="font-body-lg text-lg font-extrabold text-primary">{formatCurrency(price)}</span>
                </div>
                <input 
                  max="1000000" 
                  min="50000" 
                  step="5000" 
                  type="range" 
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                />
              </div>

              {/* Down Payment Slider */}
              <div>
                <div className="flex justify-between mb-3 items-end">
                  <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider font-semibold">DOWN PAYMENT</label>
                  <span className="font-body-lg text-lg font-extrabold text-primary">{formatCurrency(downPayment)}</span>
                </div>
                <input 
                  max={price} 
                  min="0" 
                  step="5000" 
                  type="range" 
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value, 10))}
                />
              </div>

              {/* Term Length Selector */}
              <div>
                <div className="flex justify-between mb-3 items-end">
                  <label className="font-label-caps text-[10px] text-on-surface-variant tracking-wider font-semibold">TERM LENGTH (MONTHS)</label>
                  <span className="font-body-lg text-lg font-extrabold text-primary">{term} Months</span>
                </div>
                <div className="flex gap-4">
                  {[36, 60, 72].map((months) => (
                    <button 
                      key={months}
                      type="button"
                      onClick={() => setTerm(months)}
                      className={`flex-1 py-4 border transition-all rounded-xl font-bold tracking-wide ${
                        term === months
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'border-outline-variant/60 bg-white hover:border-secondary-fixed-dim text-primary'
                      }`}
                    >
                      {months} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Sidebar */}
          <div className="lg:col-span-4 bg-primary text-on-primary rounded-2xl p-8 flex flex-col justify-between shadow-2xl border border-primary relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-fixed-dim/10 rounded-full blur-2xl"></div>
            <div>
              <span className="font-label-caps text-[10px] text-secondary-fixed-dim mb-2 tracking-[0.15em] block uppercase font-bold">ESTIMATED MONTHLY</span>
              <div className="font-display-lg text-[44px] md:text-[52px] font-extrabold mb-6 text-white leading-tight">
                <animated.span>
                  {paymentSpring.val.to((v) => formatCurrency(v))}
                </animated.span>
              </div>
              
              <div className="space-y-4 font-body-md text-body-md text-primary-fixed-dim border-t border-white/10 pt-6">
                <div className="flex justify-between">
                  <span>Interest Rate (APR)</span>
                  <span className="text-white font-bold">5.9% Fixed</span>
                </div>
                <div className="flex justify-between">
                  <span>Principal Financed</span>
                  <span className="text-white font-bold">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes</span>
                  <span className="text-white font-bold">Included</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setActivePlanId('select')}
              className="w-full mt-8 py-5 bg-secondary-fixed-dim text-primary font-label-caps text-label-caps rounded-xl hover:brightness-110 transition-all active:scale-[0.99] font-bold tracking-widest shadow-md"
            >
              APPLY FOR FINANCING
            </button>
          </div>

        </section>

        {/* Luxury Plans Cards */}
        <section className="mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-widest uppercase">FINANCING PLANS</span>
            <h3 className="font-headline-lg text-headline-lg text-primary uppercase font-extrabold mt-1">Available Programs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter">
            
            {plans.map((plan) => {
              const isPopular = plan.id === 'lease';
              return (
                <div 
                  key={plan.id}
                  className={`p-8 border rounded-2xl luxury-card-hover flex flex-col justify-between relative bg-white shadow-md ${
                    isPopular ? 'border-2 border-secondary-fixed-dim' : 'border-outline-variant/40'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-secondary-fixed-dim text-primary px-4 py-1 font-label-caps text-[9px] font-bold rounded-full tracking-widest shadow-sm">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${
                      isPopular ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim' : 'bg-primary/5 text-primary'
                    }`}>
                      <span className="material-symbols-outlined font-semibold">{plan.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-2 uppercase font-extrabold tracking-tight text-primary">
                      {plan.name}
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant mb-6 leading-relaxed">
                      {plan.tagline}
                    </p>
                    
                    <ul className="space-y-3 mb-8 font-body-md text-xs text-on-surface-variant border-t border-outline-variant/10 pt-4">
                      {plan.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-secondary-fixed-dim font-bold">check</span> 
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => setActivePlanId(plan.id)}
                    className={`w-full py-4 rounded-xl font-label-caps text-label-caps tracking-widest font-bold transition-all ${
                      isPopular 
                        ? 'bg-primary text-on-primary hover:bg-secondary-fixed-dim hover:text-primary shadow-md' 
                        : 'border border-primary text-primary hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim'
                    }`}
                  >
                    LEARN MORE
                  </button>
                </div>
              );
            })}

          </div>
        </section>
      </main>

      {/* Program Details & Application Modal */}
      {activePlan && modalCalculations && (
        <animated.div 
          style={modalSpring}
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/75 backdrop-blur-md p-4 md:p-8"
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-outline-variant/30 relative flex flex-col md:flex-row text-black max-h-[90vh]">
            
            {/* Modal Exit */}
            <button 
              onClick={() => setActivePlanId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/85 hover:bg-secondary-fixed-dim text-white hover:text-black rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Close details"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left: Program summary and specs */}
            <div className="w-full md:w-1/2 bg-surface-container-low p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline-variant/30 overflow-y-auto">
              <div className="space-y-4">
                <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.2em] uppercase">FINANCING DETAILS</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-primary uppercase">{activePlan.name}</h2>
                <p className="font-body-md text-on-surface-variant leading-relaxed">{activePlan.description}</p>
                
                <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm space-y-4 mt-6">
                  <div className="flex justify-between items-end">
                    <span className="font-label-caps text-[9px] text-on-surface-variant font-semibold">SAMPLE PAYMENTS</span>
                    <span className="font-label-caps text-[10px] text-secondary-fixed-dim font-bold">{activePlan.apr * 100}% APR</span>
                  </div>
                  <div className="h-px bg-outline-variant/10"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant font-medium">Estimated Monthly</span>
                    <span className="text-xl font-extrabold text-primary">{formatCurrency(modalCalculations.payment)}</span>
                  </div>

                  {modalCalculations.balloon > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant font-medium">Final Balloon Payment</span>
                      <span className="font-bold text-secondary-fixed-dim">{formatCurrency(modalCalculations.balloon)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Financed Principal</span>
                    <span className="font-bold text-primary">{formatCurrency(modalCalculations.financed)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-[11px] text-on-surface-variant/50 leading-relaxed italic border-t border-outline-variant/10 pt-4">
                *Calculations based on estimated price of {formatCurrency(price)}, down payment of {formatCurrency(downPayment)}, and a term of {term} months. Actual parameters may vary upon credit check.
              </div>
            </div>

            {/* Right: Apply Form */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[80vh] md:max-h-none flex flex-col justify-center">
              {!appSubmitted ? (
                <form onSubmit={handleAppSubmit} className="space-y-6">
                  <h3 className="font-headline-md text-headline-md text-primary uppercase font-bold tracking-tight mb-4">Apply Pre-Approval</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">Pre-fill details for your {activePlan.name} application.</p>
                  
                  <div className="relative flex flex-col">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-wider">FULL NAME</label>
                    <input 
                      required
                      type="text"
                      value={appData.name}
                      onChange={(e) => setAppData({ ...appData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 py-2 outline-none"
                    />
                  </div>

                  <div className="relative flex flex-col">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-wider">EMAIL ADDRESS</label>
                    <input 
                      required
                      type="email"
                      value={appData.email}
                      onChange={(e) => setAppData({ ...appData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 py-2 outline-none"
                    />
                  </div>

                  <div className="relative flex flex-col">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-wider">PHONE NUMBER</label>
                    <input 
                      required
                      type="tel"
                      value={appData.phone}
                      onChange={(e) => setAppData({ ...appData, phone: e.target.value })}
                      placeholder="+1 (555) 0199"
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 py-2 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps rounded-xl hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 font-bold tracking-widest shadow-md mt-6"
                  >
                    SUBMIT PRE-APPROVAL REQUEST
                  </button>
                </form>
              ) : (
                /* Success */
                <div className="text-center py-12 space-y-6 animate-fade-in">
                  <span className="material-symbols-outlined text-[80px] text-secondary-fixed-dim animate-bounce">
                    verified_user
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-primary uppercase font-bold">Application Received</h3>
                  <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    Pre-approval submitted! Thank you, <span className="font-bold text-black">{appData.name}</span>. A financial advisor will contact you shortly at <span className="font-bold text-black">{appData.phone}</span>.
                  </p>
                  <button 
                    onClick={() => setActivePlanId(null)}
                    className="mt-6 border border-primary px-8 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-white transition-all rounded-lg"
                  >
                    RETURN TO FINANCING
                  </button>
                </div>
              )}
            </div>

          </div>
        </animated.div>
      )}
    </div>
  );
}
