import { useState, useEffect } from 'react';
import { db } from '../services/db';

interface Location {
  name: string;
  address: string;
  hours: string;
  isOpen: boolean;
}

export default function Contact() {
  const [activeRegion, setActiveRegion] = useState<'NA' | 'EU' | 'APAC'>('NA');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const locationsData: Record<'NA' | 'EU' | 'APAC', Location[]> = {
    NA: [
      {
        name: 'Los Angeles Flagship',
        address: '90210 Wilshire Blvd, Beverly Hills, CA 90210',
        hours: 'Open Today 10am - 8pm',
        isOpen: true
      },
      {
        name: 'New York Studio',
        address: '100 11th Ave, New York, NY 10011',
        hours: 'Open Today 9am - 7pm',
        isOpen: true
      },
      {
        name: 'Miami Design District',
        address: '151 NE 41st St, Miami, FL 33137',
        hours: 'Closed Today',
        isOpen: false
      }
    ],
    EU: [
      {
        name: 'London Gallery',
        address: '28-30 Davies St, Mayfair, London W1K 4NW',
        hours: 'Open Today 10am - 6pm',
        isOpen: true
      },
      {
        name: 'Munich Center',
        address: 'Odeonsplatz 8, 80539 München',
        hours: 'Open Today 10am - 7pm',
        isOpen: true
      }
    ],
    APAC: [
      {
        name: 'Tokyo Aoyama',
        address: '5-1-3 Minami-Aoyama, Minato-ku, Tokyo 107-0062',
        hours: 'Open Today 11am - 8pm',
        isOpen: true
      },
      {
        name: 'Singapore Showroom',
        address: '24 Orchard Rd, Singapore 238865',
        hours: 'Open Today 10am - 8pm',
        isOpen: true
      }
    ]
  };

  // Set default selected showroom when region changes
  useEffect(() => {
    const list = locationsData[activeRegion];
    if (list && list.length > 0) {
      setSelectedLocation(list[0]);
    }
  }, [activeRegion]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save inquiry to local database
    db.addInquiry({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      subject: formData.topic === 'sales' ? 'Sales & Acquisition' 
             : formData.topic === 'service' ? 'Service & Bespoke Modification'
             : formData.topic === 'press' ? 'Press & Media Partnerships'
             : 'General Concierge Inquiry',
      message: formData.message
    });

    setIsSubmitted(true);
  };

  return (
    <div className="bg-background text-on-background antialiased selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed pb-24">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
          -webkit-text-fill-color: #000000 !important;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .focused-underline::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #e5c188;
          transition: width 0.3s ease;
        }
        .focused-underline:focus-within::after {
          width: 100%;
        }
      `}</style>

      <main className="pt-16 pb-24 text-black">
        {/* Header Section */}
        <section className="max-w-container-max-width mx-auto px-grid-margin mb-20 animate-fade-in">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim mb-4 block tracking-[0.3em] font-bold">DRIVEX CONCIERGE</span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-[64px] text-primary mb-6 uppercase font-black tracking-tight leading-tight">
              Connect with us.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Whether you are exploring acquisition, scheduling specialized service, or arranging a private viewing at one of our global showrooms, our concierges are ready to assist.
            </p>
          </div>
        </section>

        {/* Bento Layout: Contact Form & Department Details */}
        <section className="max-w-container-max-width mx-auto px-grid-margin grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter mb-28 animate-slide-up">
          
          {/* Contact Form Area */}
          <div className="lg:col-span-7 glass-card p-8 md:p-12 shadow-[0px_30px_70px_rgba(0,0,0,0.06)] rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary-fixed-dim/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2 uppercase font-extrabold tracking-tight">Send an Inquiry</h2>
              <p className="font-body-md text-on-surface-variant mb-10 text-sm">Please submit the form below and a representative will reply within 24 hours.</p>
              
              {!isSubmitted ? (
                <form className="space-y-10 relative z-10" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative flex flex-col focused-underline">
                      <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-widest font-semibold" htmlFor="firstName">First Name</label>
                      <input 
                        required
                        className="w-full bg-transparent border-0 border-b border-outline-variant/65 focus:border-secondary-fixed-dim focus:ring-0 py-2 font-body-md text-primary outline-none" 
                        id="firstName" 
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="relative flex flex-col focused-underline">
                      <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-widest font-semibold" htmlFor="lastName">Last Name</label>
                      <input 
                        required
                        className="w-full bg-transparent border-0 border-b border-outline-variant/65 focus:border-secondary-fixed-dim focus:ring-0 py-2 font-body-md text-primary outline-none" 
                        id="lastName" 
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="relative flex flex-col focused-underline">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-widest font-semibold" htmlFor="email">Email Address</label>
                    <input 
                      required
                      className="w-full bg-transparent border-0 border-b border-outline-variant/65 focus:border-secondary-fixed-dim focus:ring-0 py-2 font-body-md text-primary outline-none" 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="relative flex flex-col focused-underline">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-1 tracking-widest font-semibold" htmlFor="topic">Topic</label>
                    <select 
                      required
                      className="w-full bg-transparent border-0 border-b border-outline-variant/65 focus:border-secondary-fixed-dim focus:ring-0 py-2 font-body-md text-primary outline-none cursor-pointer appearance-none" 
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="" disabled>Select a Topic</option>
                      <option value="sales">Sales & Acquisition</option>
                      <option value="service">Service & Bespoke Modification</option>
                      <option value="press">Press & Media Partnerships</option>
                      <option value="other">General Concierge Inquiry</option>
                    </select>
                  </div>
                  
                  <div className="relative flex flex-col">
                    <label className="font-label-caps text-[10px] text-on-surface-variant mb-3 tracking-widest font-semibold" htmlFor="message">Message</label>
                    <textarea 
                      required
                      className="w-full bg-white/40 border border-outline-variant/50 focus:ring-1 focus:ring-secondary-fixed-dim focus:border-secondary-fixed-dim p-4 font-body-md text-primary placeholder-on-surface-variant/40 resize-none rounded-lg shadow-inner outline-none transition-all" 
                      id="message" 
                      placeholder="Specify requirements or vehicles of interest..." 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-10 hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 active:scale-95 flex items-center justify-center space-x-3 shadow-lg group rounded-lg"
                  >
                    <span>Submit Inquiry</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform duration-300">arrow_forward</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 space-y-8 animate-fade-in">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-secondary-fixed-dim/20 blur-2xl rounded-full animate-pulse"></div>
                    <span className="material-symbols-outlined text-6xl text-secondary-fixed-dim animate-bounce">mail</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary uppercase font-bold tracking-tight">Inquiry Received</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-black">{formData.firstName}</span>. A Drivex concierge has received your request regarding "<span className="font-semibold text-black">{formData.topic}</span>" and will contact you at <span className="font-semibold text-black">{formData.email}</span> shortly.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => { setIsSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', topic: '', message: '' }); }}
                    className="mt-6 border border-primary px-8 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-white transition-all duration-300 rounded-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Departments Direct Contact */}
          <div className="lg:col-span-5 flex flex-col gap-grid-gutter">
            
            {/* Sales Card */}
            <div className="glass-card p-8 md:p-10 hover:border-secondary-fixed-dim/50 hover:shadow-2xl transition-all duration-500 group cursor-pointer rounded-2xl flex flex-col justify-between h-full hover:-translate-y-1">
              <div>
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold uppercase tracking-wide">Sales & Private Gallery</h3>
                  <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl group-hover:scale-110 transition-transform duration-300">directions_car</span>
                </div>
                <p className="font-body-md text-on-surface-variant mb-8 text-sm leading-relaxed">Arrange private client viewings, bespoke configuration assessments, or explore vehicle acquisition options.</p>
              </div>
              <div className="space-y-3 border-t border-outline-variant/20 pt-6">
                <a className="font-body-md text-sm text-primary flex items-center space-x-3 hover:text-secondary-fixed-dim transition-colors" href="tel:+18005550199">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span className="font-semibold">+1 (800) 555-0199</span>
                </a>
                <a className="font-body-md text-sm text-primary flex items-center space-x-3 hover:text-secondary-fixed-dim transition-colors" href="mailto:sales@drivex.com">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span className="font-semibold">sales@drivex.com</span>
                </a>
              </div>
            </div>

            {/* Service Card */}
            <div className="glass-card p-8 md:p-10 hover:border-secondary-fixed-dim/50 hover:shadow-2xl transition-all duration-500 group cursor-pointer rounded-2xl flex flex-col justify-between h-full hover:-translate-y-1">
              <div>
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold uppercase tracking-wide">Elite Service Center</h3>
                  <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl group-hover:scale-110 transition-transform duration-300">build</span>
                </div>
                <p className="font-body-md text-on-surface-variant mb-8 text-sm leading-relaxed">Dedicated expert maintenance, complete diagnostic sweeps, track tuning, and customization consultation.</p>
              </div>
              <div className="space-y-3 border-t border-outline-variant/20 pt-6">
                <a className="font-body-md text-sm text-primary flex items-center space-x-3 hover:text-secondary-fixed-dim transition-colors" href="tel:+18005550188">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span className="font-semibold">+1 (800) 555-0188</span>
                </a>
                <a className="font-body-md text-sm text-primary flex items-center space-x-3 hover:text-secondary-fixed-dim transition-colors" href="mailto:service@drivex.com">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span className="font-semibold">service@drivex.com</span>
                </a>
              </div>
            </div>
          </div>

        </section>

        {/* Showrooms & Live Map Section */}
        <section className="max-w-container-max-width mx-auto px-grid-margin">
          
          {/* Global Galleries Headers */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-outline-variant/20 pb-6">
            <div>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] block mb-2 font-bold">SHOWROOM LOCATIONS</span>
              <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg text-primary uppercase font-extrabold tracking-tight">Global Galleries</h2>
            </div>
            
            {/* Region Selectors */}
            <div className="flex space-x-6 mt-6 md:mt-0 font-label-caps text-label-caps text-sm">
              {(['NA', 'EU', 'APAC'] as const).map((region) => (
                <button 
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`pb-2 transition-all font-semibold tracking-wider ${
                    activeRegion === region 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-on-surface-variant/60 hover:text-primary'
                  }`}
                >
                  {region === 'NA' ? 'North America' : region === 'EU' ? 'Europe' : 'Asia Pacific'}
                </button>
              ))}
            </div>
          </div>

          {/* Showroom Cards & Map Flex/Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter min-h-[500px]">
            
            {/* Showroom Cards List */}
            <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 max-h-[500px] hide-scrollbar">
              {locationsData[activeRegion].map((loc, idx) => {
                const isSelected = selectedLocation?.name === loc.name;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-6 cursor-pointer rounded-xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-secondary-fixed-dim/10 border-secondary-fixed-dim ring-1 ring-secondary-fixed-dim/35 shadow-lg scale-[1.02]' 
                        : 'bg-white border-outline-variant/20 hover:border-primary/20'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-headline-md text-[18px] text-primary uppercase font-bold tracking-wide">{loc.name}</h4>
                        <span className={`w-2.5 h-2.5 rounded-full ${loc.isOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant leading-relaxed whitespace-pre-line mb-4">{loc.address}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
                      <span className={`font-label-caps text-[10px] tracking-wider uppercase font-semibold ${loc.isOpen ? 'text-secondary-fixed-dim' : 'text-on-surface-variant/50'}`}>
                        {loc.hours}
                      </span>
                      <button 
                        className={`p-2 rounded-full transition-all flex items-center justify-center ${
                          isSelected ? 'bg-secondary-fixed-dim text-primary' : 'bg-surface-container-low text-primary'
                        }`}
                        aria-label={`View map for ${loc.name}`}
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Live Interactive Google Map Frame */}
            <div className="lg:col-span-7 bg-surface-container-high relative overflow-hidden rounded-2xl shadow-xl border border-outline-variant/25 h-[400px] lg:h-auto min-h-[350px]">
              {selectedLocation ? (
                <>
                  <iframe
                    title={`Google Map for ${selectedLocation.name}`}
                    width="100%"
                    height="100%"
                    className="absolute inset-0 border-0 grayscale opacity-90 contrast-110 hover:grayscale-0 focus:outline-none transition-all duration-700"
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedLocation.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 border border-outline-variant/20 rounded-lg shadow-md max-w-sm flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary-fixed-dim">location_on</span>
                    <div className="min-w-0">
                      <p className="font-label-caps text-[9px] text-secondary-fixed-dim font-bold tracking-wider uppercase">Active Gallery</p>
                      <p className="font-body-md text-xs font-bold truncate text-black">{selectedLocation.name}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-black/40">
                  <span className="material-symbols-outlined text-5xl mb-3 animate-pulse">map</span>
                  <p className="font-label-caps text-xs tracking-wider uppercase font-semibold">Select a showroom location to initialize live map</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
