import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function TestDrive() {
  const [selectedVehicle, setSelectedVehicle] = useState('apex-gtr');
  const [formData, setFormData] = useState({
    date: '',
    timePreference: 'Morning (09:00 - 12:00)',
    address: '',
    fullName: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const currentVehicleName = selectedVehicle === 'apex-gtr' 
    ? 'Apex GT-R Hybrid' 
    : selectedVehicle === 'phantom-zenith' 
      ? 'Phantom Zenith EV' 
      : 'Porsche 911 GT3';

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md overflow-x-hidden pb-16">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .form-input:focus {
          border-color: #e5c188;
          box-shadow: 0 4px 12px -6px rgba(229, 193, 136, 0.3);
        }
        .step-badge-active {
          background: #11131c;
          color: #e5c188;
          border: 1px solid #e5c188;
          box-shadow: 0 0 10px rgba(229, 193, 136, 0.4);
        }
      `}</style>

      <main className="pt-12 pb-24 relative overflow-hidden text-black">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-surface-container-low/50 to-transparent -z-10"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-secondary-fixed/10 blur-[100px] rounded-full"></div>
        
        <section className="max-w-container-max-width mx-auto px-grid-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content: Vehicle Showcase */}
            <div className="lg:col-span-5 flex flex-col space-y-8 lg:sticky lg:top-[120px]">
              <div className="space-y-4">
                <span className="font-label-caps text-label-caps text-secondary px-3 py-1 bg-secondary-container/40 rounded-full inline-block font-semibold">
                  EXPERIENCE LUXURY
                </span>
                <h1 className="font-display-lg text-display-lg-mobile md:text-headline-lg leading-tight text-primary uppercase font-extrabold">
                  Command the Road.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                  Schedule a private test drive at your preferred gallery or have the vehicle delivered to your doorstep for a personalized 48-hour assessment.
                </p>
              </div>
              
              <div className="relative group mt-8 rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
                <div className="absolute -inset-4 bg-secondary-fixed/5 rounded-xl blur-2xl group-hover:bg-secondary-fixed/10 transition-all duration-700"></div>
                <img 
                  className="relative w-full h-[300px] md:h-[400px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="A high-end matte charcoal sports car in a gallery showroom." 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" 
                />
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-xl border border-outline-variant/20 shadow-lg text-black">
                  <p className="font-label-caps text-label-caps text-secondary-fixed-dim mb-1 tracking-widest font-bold">CURRENTLY FEATURED</p>
                  <p className="font-headline-md text-headline-md text-primary font-extrabold uppercase">{currentVehicleName}</p>
                </div>
              </div>
            </div>

            {/* Right Content: Booking Form or Confirmation */}
            <div className="lg:col-span-7 mt-12 lg:mt-0">
              <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-xl border border-outline-variant/30 transition-all duration-500 bg-white/80">
                {!isSubmitted ? (
                  <form className="space-y-12" onSubmit={handleSubmit}>
                    
                    {/* Section 1: Vehicle Selection */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs step-badge-active">01</span>
                        <h2 className="font-headline-md text-headline-md text-primary uppercase font-extrabold">Select Your Machine</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedVehicle('apex-gtr')}
                          className={`p-5 border text-left transition-all rounded-xl hover:bg-surface-container-low active:scale-95 flex flex-col justify-between min-h-[100px] ${
                            selectedVehicle === 'apex-gtr'
                              ? 'border-secondary-fixed-dim ring-2 ring-secondary-fixed-dim bg-secondary-fixed-dim/5'
                              : 'border-outline-variant/60 bg-white'
                          }`}
                        >
                          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">HYBRID HYPERCAR</span>
                          <span className="font-headline-md text-xs md:text-sm text-primary font-bold mt-2 uppercase">Apex GT-R</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedVehicle('phantom-zenith')}
                          className={`p-5 border text-left transition-all rounded-xl hover:bg-surface-container-low active:scale-95 flex flex-col justify-between min-h-[100px] ${
                            selectedVehicle === 'phantom-zenith'
                              ? 'border-secondary-fixed-dim ring-2 ring-secondary-fixed-dim bg-secondary-fixed-dim/5'
                              : 'border-outline-variant/60 bg-white'
                          }`}
                        >
                          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">ULTIMATE EV</span>
                          <span className="font-headline-md text-xs md:text-sm text-primary font-bold mt-2 uppercase">Phantom Zenith</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedVehicle('porsche-911-gt3')}
                          className={`p-5 border text-left transition-all rounded-xl hover:bg-surface-container-low active:scale-95 flex flex-col justify-between min-h-[100px] ${
                            selectedVehicle === 'porsche-911-gt3'
                              ? 'border-secondary-fixed-dim ring-2 ring-secondary-fixed-dim bg-secondary-fixed-dim/5'
                              : 'border-outline-variant/60 bg-white'
                          }`}
                        >
                          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">RACE BRED FLAT-6</span>
                          <span className="font-headline-md text-xs md:text-sm text-primary font-bold mt-2 uppercase">Porsche 911 GT3</span>
                        </button>
                      </div>
                    </div>

                    {/* Section 2: Logistics */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs step-badge-active">02</span>
                        <h2 className="font-headline-md text-headline-md text-primary uppercase font-extrabold">Logistics</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative flex flex-col">
                          <label className="font-label-caps text-[11px] text-on-surface-variant mb-2 tracking-widest">DATE OF RESERVATION</label>
                          <input 
                            required
                            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-secondary-fixed-dim outline-none form-input transition-all" 
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                        <div className="relative flex flex-col">
                          <label className="font-label-caps text-[11px] text-on-surface-variant mb-2 tracking-widest">TIME PREFERENCE</label>
                          <select 
                            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-secondary-fixed-dim outline-none appearance-none cursor-pointer form-input transition-all"
                            value={formData.timePreference}
                            onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                          >
                            <option>Morning (09:00 - 12:00)</option>
                            <option>Afternoon (13:00 - 17:00)</option>
                            <option>Evening (18:00 - 20:00)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="relative flex flex-col">
                        <label className="font-label-caps text-[11px] text-on-surface-variant mb-2 tracking-widest">GALLERY LOCATION OR DELIVERY ADDRESS</label>
                        <input 
                          required
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-secondary-fixed-dim outline-none placeholder-on-surface-variant/40 form-input transition-all" 
                          type="text"
                          placeholder="e.g. 123 Luxury Lane, Beverly Hills or Downtown Showroom"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Section 3: Identity */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs step-badge-active">03</span>
                        <h2 className="font-headline-md text-headline-md text-primary uppercase font-extrabold">Personal Identity</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative flex flex-col">
                          <label className="font-label-caps text-[11px] text-on-surface-variant mb-2 tracking-widest">FULL NAME</label>
                          <input 
                            required
                            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-secondary-fixed-dim outline-none placeholder-on-surface-variant/40 form-input transition-all" 
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                        <div className="relative flex flex-col">
                          <label className="font-label-caps text-[11px] text-on-surface-variant mb-2 tracking-widest">EMAIL ADDRESS</label>
                          <input 
                            required
                            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-secondary-fixed-dim outline-none placeholder-on-surface-variant/40 form-input transition-all" 
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-5 rounded-lg tracking-widest hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300 active:scale-[0.99] mt-8 font-bold shadow-lg"
                    >
                      CONFIRM RESERVATION
                    </button>
                  </form>
                ) : (
                  /* Confirmation UI */
                  <div className="text-center py-12 space-y-8 animate-fade-in text-black">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-secondary-fixed-dim/20 blur-2xl rounded-full animate-pulse"></div>
                      <span 
                        className="material-symbols-outlined text-[80px] text-secondary-fixed-dim relative" 
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-bold">Reservation Confirmed</h2>
                      <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                        Thank you, <span className="font-bold text-black">{formData.fullName}</span>. An Experience Consultant will reach out shortly to <span className="font-bold text-black">{formData.email}</span> to finalize your private Route.
                      </p>
                      <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/30 text-left max-w-md mx-auto space-y-2 mt-6">
                        <p className="font-label-caps text-[10px] text-secondary-fixed-dim font-bold tracking-widest uppercase">RESERVATION RECEIPT</p>
                        <p className="text-sm font-semibold text-primary">Vehicle: <span className="font-bold">{currentVehicleName}</span></p>
                        <p className="text-sm font-semibold text-primary">Date: <span className="font-bold">{formData.date}</span></p>
                        <p className="text-sm font-semibold text-primary">Preference: <span className="font-bold">{formData.timePreference}</span></p>
                        <p className="text-sm font-semibold text-primary">Location: <span className="font-bold">{formData.address}</span></p>
                      </div>
                    </div>
                    
                    <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="font-label-caps text-label-caps border border-primary px-8 py-4 hover:bg-primary hover:text-white transition-all duration-300 rounded-lg font-bold"
                      >
                        NEW RESERVATION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </section>
      </main>
    </div>
  );
}
