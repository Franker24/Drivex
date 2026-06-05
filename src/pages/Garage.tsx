import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, GarageItem, User } from '../services/db';
import AuthModal from '../components/AuthModal';
import VehicleConfigurator3D from '../components/3d/VehicleConfigurator3D';

export default function Garage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [garageItems, setGarageItems] = useState<GarageItem[]>([]);
  const [activeItem, setActiveItem] = useState<GarageItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Test drive reservation modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('10:00 AM - 12:00 PM');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Refresh user state
    const handleAuthChange = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const items = db.getGarageForUser(user.id);
        setGarageItems(items);
        if (items.length > 0) {
          setActiveItem(items[0]);
        } else {
          setActiveItem(null);
        }
      } else {
        setGarageItems([]);
        setActiveItem(null);
      }
    };

    window.addEventListener('auth_change', handleAuthChange);
    
    // Initial load
    if (currentUser) {
      const items = db.getGarageForUser(currentUser.id);
      setGarageItems(items);
      if (items.length > 0) {
        setActiveItem(items[0]);
      }
    }

    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, [currentUser]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent setting active
    if (confirm('Are you sure you want to remove this build from your collection?')) {
      db.deleteGarageItem(id);
      if (currentUser) {
        const updated = db.getGarageForUser(currentUser.id);
        setGarageItems(updated);
        // Reset active item
        if (activeItem?.id === id) {
          setActiveItem(updated.length > 0 ? updated[0] : null);
        }
      }
    }
  };

  const handleOpenBooking = () => {
    if (!activeItem) return;
    setBookingOpen(true);
    setBookingSuccess(false);
    setPhone('');
    setNotes(`Bespoke build priority booking for my saved ${activeItem.carName}.`);
  };

  const handleBookTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !currentUser) return;

    db.addBooking({
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone,
      carId: activeItem.carId,
      carName: activeItem.carName,
      date: testDate,
      timeSlot: testTime,
      notes: `${notes} (Saved Paint: ${activeItem.paint.name}, Wheels: ${activeItem.wheels.name})`
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingOpen(false);
      setBookingSuccess(false);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white antialiased pb-24 pt-28 px-grid-margin">
      <div className="max-w-container-max-width mx-auto">
        
        {/* Sub-Header */}
        <div className="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label-caps text-[10px] text-secondary-fixed-dim block mb-3 uppercase tracking-widest font-extrabold">
              Bespoke Owner Portal
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              MY VIRTUAL GARAGE
            </h1>
            <p className="text-white/50 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              Explore your saved performance configurations, inspect mechanical paint formulations under active showroom lighting, and finalize reservation options.
            </p>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-xl self-start md:self-auto">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed-dim text-black font-bold text-xs flex items-center justify-center">
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white truncate max-w-[150px]">{currentUser.name}</p>
                <p className="text-[10px] text-white/40 truncate max-w-[150px]">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Not Logged In View */}
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-fixed-dim/10 rounded-full blur-[80px]" />
            <span className="material-symbols-outlined text-6xl text-secondary-fixed-dim mb-6 animate-pulse">lock_person</span>
            <h2 className="text-2xl font-bold uppercase tracking-wide">Access Locked</h2>
            <p className="text-white/60 text-sm max-w-sm mt-3 mb-8">
              Sign in to your Drivex account to view your saved vehicle configurations and book private concierge test drives.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs px-8 py-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(229,193,136,0.15)] cursor-pointer"
            >
              Sign In to Your Garage
            </button>
          </div>
        ) : (
          <>
            {/* Empty Garage View */}
            {garageItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <span className="material-symbols-outlined text-6xl text-white/10 mb-6">garage_home</span>
                <h2 className="text-xl font-bold uppercase tracking-wide text-white/80">No Custom Builds Found</h2>
                <p className="text-white/40 text-sm max-w-sm mt-2 mb-8 leading-relaxed">
                  Your private inventory is empty. Navigate to our vehicle comparison panel and design your custom config to save it here.
                </p>
                <button
                  onClick={() => navigate('/compare')}
                  className="bg-white text-black hover:bg-secondary-fixed-dim font-semibold text-xs px-8 py-4 rounded-xl uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  Go to Configurator
                </button>
              </div>
            ) : (
              
              /* Split Screen Inspector Layout */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Saved Builds List (40% width) */}
                <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-label-caps text-white/40 tracking-wider uppercase font-semibold">
                      Saved Configurations ({garageItems.length})
                    </span>
                  </div>

                  {garageItems.map((item) => {
                    const isActive = activeItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between group ${
                          isActive
                            ? 'bg-[#121212] border-secondary-fixed-dim shadow-[0_0_20px_rgba(229,193,136,0.08)] scale-[1.01]'
                            : 'bg-[#0f0f0f] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-label-caps text-[9px] text-secondary-fixed-dim tracking-widest font-bold uppercase block mb-1">
                              {item.carName.includes('Porsche') ? 'PORSCHE' : item.carName.includes('McLaren') ? 'MCLAREN' : 'DRIVEX FLEET'}
                            </span>
                            <h3 className="font-headline-md text-base font-bold text-white group-hover:text-secondary-fixed-dim transition-colors">
                              {item.carName}
                            </h3>
                            <p className="text-[10px] text-white/30 mt-1">
                              Saved on {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-white/30 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Remove Spec"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </div>

                        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/20" 
                              style={{ backgroundColor: item.paint.hex }}
                              title={item.paint.name}
                            />
                            <span className="text-[10px] text-white/50">{item.paint.name}</span>
                          </div>
                          
                          <span className="font-semibold text-xs text-white">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Active Showroom Inspect Panel (60% width) */}
                <div className="lg:col-span-7">
                  {activeItem ? (
                    <div className="bg-[#101010] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                      
                      {/* Active Showroom Canvas */}
                      <div className="aspect-[16/10] w-full relative border-b border-white/5 h-[280px] md:h-[350px]">
                        <VehicleConfigurator3D
                          paintColor={activeItem.paint.hex}
                          wheelStyle={activeItem.wheels.name}
                        />
                      </div>

                      {/* Details & Specs Invoice Panel */}
                      <div className="p-6 md:p-8 space-y-6">
                        
                        <div className="flex justify-between items-start border-b border-white/5 pb-5">
                          <div>
                            <span className="text-[9px] font-label-caps text-secondary-fixed-dim tracking-widest font-bold block uppercase">
                              Active Showcase Inspect
                            </span>
                            <h2 className="font-headline-lg text-2xl font-black text-white uppercase mt-1">
                              {activeItem.carName}
                            </h2>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] font-label-caps text-white/40 tracking-wider block uppercase">Total Spec Investment</span>
                            <span className="font-headline-md text-2xl font-black text-secondary-fixed-dim">
                              {formatPrice(activeItem.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Specifications List */}
                        <div className="space-y-4">
                          <h4 className="font-label-caps text-[10px] text-white/40 tracking-wider uppercase font-bold">
                            Bespoke Specifications Profile
                          </h4>
                          
                          <div className="space-y-2.5">
                            {/* Paint */}
                            <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3.5 h-3.5 rounded-full border border-white/20" 
                                  style={{ backgroundColor: activeItem.paint.hex }}
                                />
                                <span className="text-white/70">Paint: <span className="text-white font-medium">{activeItem.paint.name}</span></span>
                              </div>
                              <span className="font-medium text-white/80">
                                {activeItem.paint.price === 0 ? 'Included' : `+${formatPrice(activeItem.paint.price)}`}
                              </span>
                            </div>

                            {/* Wheels */}
                            <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-white/40">adjust</span>
                                <span className="text-white/70">Wheels: <span className="text-white font-medium">{activeItem.wheels.name}</span></span>
                              </div>
                              <span className="font-medium text-white/80">
                                {activeItem.wheels.price === 0 ? 'Included' : `+${formatPrice(activeItem.wheels.price)}`}
                              </span>
                            </div>

                            {/* Interior */}
                            <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm text-white/40">airline_seat_recline_extra</span>
                                <span className="text-white/70">Interior: <span className="text-white font-medium">{activeItem.interior.name}</span></span>
                              </div>
                              <span className="font-medium text-white/80">
                                {activeItem.interior.price === 0 ? 'Included' : `+${formatPrice(activeItem.interior.price)}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Concierge Actions */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleOpenBooking}
                            className="flex-grow bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs py-4 rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(229,193,136,0.12)] font-bold"
                          >
                            <span className="material-symbols-outlined text-base">calendar_month</span>
                            <span>Book Concierge Test Drive</span>
                          </button>
                          
                          <button
                            onClick={() => window.print()}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs py-4 px-6 rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-bold"
                          >
                            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                            <span>Export Spec (PDF)</span>
                          </button>
                          
                          <button
                            onClick={(e) => handleDelete(activeItem.id, e)}
                            className="bg-transparent hover:bg-red-500/5 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 font-semibold text-xs py-4 px-6 rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-bold"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="h-96 bg-[#101010] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-white/40">
                      <span className="material-symbols-outlined text-4xl mb-3">mouse</span>
                      <p className="text-xs font-semibold uppercase tracking-wider">Select a configuration build to inspect</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}

        {/* Test Drive Scheduling Modal */}
        {bookingOpen && activeItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in px-4">
            <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-8 relative shadow-2xl">
              
              {/* Close button */}
              <button 
                onClick={() => setBookingOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="text-center mb-6">
                <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.25em] font-bold uppercase">
                  concierge reservation
                </span>
                <h2 className="font-headline-md text-xl text-white font-bold mt-2 uppercase">
                  Book Test Drive
                </h2>
                <p className="text-white/60 text-xs mt-1">
                  Schedule a private showroom experience for your customized <strong className="text-white">{activeItem.carName}</strong>.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <span className="material-symbols-outlined text-6xl text-emerald-400 animate-bounce">check_circle</span>
                  <h3 className="font-headline-md text-lg text-white font-bold">Booking Confirmed!</h3>
                  <p className="text-white/60 text-xs max-w-xs mx-auto">
                    Your request was sent to our concierge desk. We will contact you shortly to finalize your test drive details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookTestDrive} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/70 uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/70 uppercase tracking-wider">Time Slot</label>
                    <select
                      value={testTime}
                      onChange={(e) => setTestTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors"
                      required
                    >
                      <option className="bg-[#121212] text-white" value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option className="bg-[#121212] text-white" value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option className="bg-[#121212] text-white" value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option className="bg-[#121212] text-white" value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/70 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-label-caps text-white/70 uppercase tracking-wider">Special Requests</label>
                    <textarea 
                      rows={3}
                      placeholder="Any specific requests or requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-secondary-fixed-dim focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 mt-6 shadow-[0_4px_20px_rgba(229,193,136,0.15)] cursor-pointer"
                  >
                    Confirm Booking Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* Hidden Print-only Invoice/Quote Layout */}
      {activeItem && (
        <div id="print-quote-sheet" className="hidden print:block bg-white text-black p-12 font-sans w-full max-w-4xl mx-auto border border-black/10">
          <style>{`
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              #root, header, footer, nav, .print-hide {
                display: none !important;
              }
              #print-quote-sheet {
                display: block !important;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                z-index: 99999;
              }
            }
          `}</style>
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8 text-black">
            <div>
              <h1 className="text-3xl font-extrabold tracking-widest text-black">DRIVEX</h1>
              <p className="text-xs uppercase tracking-wider text-black/50 mt-1">Bespoke Automotive Commission</p>
            </div>
            <div className="text-right text-xs text-black/70">
              <p className="font-bold text-black">Drivex Showroom Concierge</p>
              <p>Showroom Room 4, Elite Sector</p>
              <p>commission@drivex.luxury</p>
            </div>
          </div>
          
          {/* Customer / Spec Details */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-xs text-black">
            <div>
              <h3 className="font-bold uppercase text-[10px] tracking-wider text-black/40 mb-2">COMMISSION FOR</h3>
              <p className="font-bold text-sm text-black">{currentUser?.name}</p>
              <p className="text-black/60">{currentUser?.email}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold uppercase text-[10px] tracking-wider text-black/40 mb-2">SPECIFICATION DETAILS</h3>
              <p>Reference: <span className="font-mono text-black font-semibold">{activeItem.id.slice(0, 8).toUpperCase()}</span></p>
              <p>Commission Date: {new Date(activeItem.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="border border-black/10 rounded-lg overflow-hidden mb-8 text-xs text-black">
            <div className="bg-black/5 grid grid-cols-12 p-3 font-bold border-b border-black/10 text-black">
              <div className="col-span-8 uppercase tracking-wider text-[9px]">Spec Detail</div>
              <div className="col-span-4 text-right uppercase tracking-wider text-[9px]">Investment</div>
            </div>
            
            {/* Base Spec */}
            <div className="grid grid-cols-12 p-3 border-b border-black/10">
              <div className="col-span-8">
                <p className="font-bold text-black">{activeItem.carName} (Base Spec)</p>
                <p className="text-[10px] text-black/50">High-Performance chassis with active aerodynamics</p>
              </div>
              <div className="col-span-4 text-right flex items-center justify-end font-semibold text-black">
                {formatPrice(activeItem.totalPrice - activeItem.paint.price - activeItem.wheels.price - activeItem.interior.price)}
              </div>
            </div>

            {/* Paint Option */}
            <div className="grid grid-cols-12 p-3 border-b border-black/10">
              <div className="col-span-8">
                <p className="font-bold text-black">Bespoke Paint finish: {activeItem.paint.name}</p>
                <p className="text-[10px] text-black/50">Formulated under active showroom lighting conditions</p>
              </div>
              <div className="col-span-4 text-right flex items-center justify-end font-semibold text-black">
                {activeItem.paint.price === 0 ? 'Included' : `+${formatPrice(activeItem.paint.price)}`}
              </div>
            </div>

            {/* Wheels Option */}
            <div className="grid grid-cols-12 p-3 border-b border-black/10">
              <div className="col-span-8">
                <p className="font-bold text-black">Wheel Design: {activeItem.wheels.name}</p>
                <p className="text-[10px] text-black/50">Performance alloy rims built for track response</p>
              </div>
              <div className="col-span-4 text-right flex items-center justify-end font-semibold text-black">
                {activeItem.wheels.price === 0 ? 'Included' : `+${formatPrice(activeItem.wheels.price)}`}
              </div>
            </div>

            {/* Interior Option */}
            <div className="grid grid-cols-12 p-3 border-b border-black/10">
              <div className="col-span-8">
                <p className="font-bold text-black">Interior Trim: {activeItem.interior.name}</p>
                <p className="text-[10px] text-black/50">Bespoke leather upholstery with contrast stitching</p>
              </div>
              <div className="col-span-4 text-right flex items-center justify-end font-semibold text-black">
                {activeItem.interior.price === 0 ? 'Included' : `+${formatPrice(activeItem.interior.price)}`}
              </div>
            </div>

            {/* Total */}
            <div className="bg-black/5 grid grid-cols-12 p-4 font-bold text-sm">
              <div className="col-span-8 text-black uppercase tracking-wider text-[10px]">Total Spec Investment</div>
              <div className="col-span-4 text-right text-black font-extrabold">
                {formatPrice(activeItem.totalPrice)}
              </div>
            </div>
          </div>

          {/* Acquisition Estimate (Lease vs Loan) */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-[11px] border border-black/10 rounded-lg p-4 text-black">
            <div>
              <h4 className="font-bold text-black uppercase tracking-wider text-[9px] mb-2 border-b border-black/5 pb-1">ESTIMATED LEASE PAYMENT</h4>
              <p className="text-xl font-bold text-black font-mono">
                {formatPrice(
                  Math.round(
                    ((activeItem.totalPrice * 0.8 - activeItem.totalPrice * 0.55) / 36) + 
                    ((activeItem.totalPrice * 0.8 + activeItem.totalPrice * 0.55) * 0.002)
                  )
                )} 
                <span className="text-[10px] font-normal text-black/50">/ mo</span>
              </p>
              <p className="text-[9px] text-black/50 mt-1">Based on 36-month lease, 20% down payment, 4.8% interest rate, and 55% residual value.</p>
            </div>
            <div>
              <h4 className="font-bold text-black uppercase tracking-wider text-[9px] mb-2 border-b border-black/5 pb-1">ESTIMATED LOAN PAYMENT</h4>
              <p className="text-xl font-bold text-black font-mono">
                {formatPrice(
                  Math.round(
                    ((activeItem.totalPrice * 0.8) * (0.048 / 12) * Math.pow(1 + 0.048 / 12, 36)) / 
                    (Math.pow(1 + 0.048 / 12, 36) - 1)
                  )
                )} 
                <span className="text-[10px] font-normal text-black/50">/ mo</span>
              </p>
              <p className="text-[9px] text-black/50 mt-1">Based on 36-month purchase loan, 20% down payment, and 4.8% interest rate.</p>
            </div>
          </div>

          {/* Remarks */}
          <div className="text-[10px] text-black/50 leading-relaxed border-t border-black/10 pt-6">
            <p className="font-bold text-black mb-1 uppercase tracking-wider text-[8px]">Terms & Conditions</p>
            <p>This document is a virtual garage commission summary compiled by the Drivex VIP client configuration portal. All figures represent estimated retail configurations. Exact financing, taxes, tags, dealer fees, and delivery options will be detailed in the formal acquisition contract during showroom sign-off. Please present this printed specification sheet at the reception desk during your priority reservation.</p>
          </div>
        </div>
      )}

      {/* Auth Modal overlay */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
