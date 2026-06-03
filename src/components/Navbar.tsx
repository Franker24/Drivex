import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onToggleDrawer: () => void;
}

interface SearchItem {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
}

const SEARCHABLE_CARS: SearchItem[] = [
  { id: 'porsche-911-gt3', name: 'Porsche 911 GT3', brand: 'PORSCHE', price: '$182,900', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=150&q=80' },
  { id: 'mclaren-artura', name: 'McLaren Artura', brand: 'MCLAREN', price: '$233,000', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=150&q=80' },
  { id: 'ferrari-roma', name: 'Ferrari Roma', brand: 'FERRARI', price: '$243,360', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=150&q=80' },
  { id: 'tesla-model-s-plaid', name: 'Tesla Model S Plaid', brand: 'TESLA', price: '$89,990', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&q=80' },
  { id: 'taycan-turbo-s', name: 'Taycan Turbo S', brand: 'PORSCHE', price: '$194,900', image: 'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=150&q=80' },
  { id: 'bespoke-720s', name: 'Bespoke 720S', brand: 'MCLAREN', price: '$310,500', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=150&q=80' },
  { id: 'aston-martin-vantage', name: 'Aston Martin Vantage', brand: 'ASTON MARTIN', price: '$191,000', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=150&q=80' },
  { id: 'audi-r8', name: 'Audi R8 Coupe', brand: 'AUDI', price: '$158,600', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=150&q=80' },
  { id: 'lamborghini-huracan', name: 'Lamborghini Huracán', brand: 'LAMBORGHINI', price: '$248,000', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=150&q=80' },
  { id: 'bentley-continental', name: 'Bentley Continental GT', brand: 'BENTLEY', price: '$235,000', image: 'https://images.unsplash.com/photo-1618843479619-f41987ba05a3?auto=format&fit=crop&w=150&q=80' },
  { id: 'bmw-i8', name: 'BMW i8 Roadster', brand: 'BMW', price: '$147,500', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=150&q=80' },
  { id: 'corvette-z06', name: 'Corvette Z06', brand: 'CHEVROLET', price: '$112,000', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=150&q=80' }
];

export default function Navbar({ onToggleDrawer }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search is opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      document.body.style.overflow = 'hidden'; // Lock scrolling
    } else {
      document.body.style.overflow = ''; // Release scrolling
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Close search when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter autocomplete results based on search query
  const searchResults = searchQuery.trim().length > 0 
    ? SEARCHABLE_CARS.filter(car => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/inventory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `font-label-caps text-label-caps transition-colors duration-300 ${
      isActive 
        ? 'text-secondary-fixed-dim font-bold' 
        : 'text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary-fixed-dim'
    }`;
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-tertiary/70 backdrop-blur-xl shadow-[0px_20px_50px_rgba(0,0,0,0.04)] border-b border-outline-variant/15">
        <nav className="max-w-container-max-width mx-auto flex justify-between items-center px-grid-margin py-base">
          <div 
            className="flex items-center gap-4 cursor-pointer active:scale-95 transition-all text-primary dark:text-on-primary hover:text-secondary-fixed-dim" 
            onClick={onToggleDrawer}
          >
            <span className="material-symbols-outlined">menu</span>
          </div>
          
          <Link 
            className="hover:opacity-90 transition-all flex items-center text-primary dark:text-on-primary" 
            to="/"
          >
            <svg className="h-8 md:h-10 w-auto" viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="D-Monogram">
                {/* Black D Shape */}
                <path d="M 10 15 H 65 C 88 15 102 29 102 50 C 102 71 88 85 65 85 H 10 V 15 Z M 28 70 H 58 C 72 70 82 62 82 50 C 82 38 72 30 58 30 H 28 V 70 Z" fill="currentColor" fillRule="evenodd" />
                {/* Gold Slash */}
                <path d="M 30 85 C 50 82 72 71 96 53 L 99 57 C 74 76 52 85 34 85 Z" fill="#e5c188" />
              </g>
              {/* Divider Line */}
              <line x1="122" y1="15" x2="122" y2="85" stroke="#e5c188" strokeWidth="2.5" />
              {/* DRIVEX Text */}
              <text x="145" y="52" fill="currentColor" fontFamily="'Inter', sans-serif" fontSize="30" fontWeight="800" letterSpacing="0.45em">DRIVEX</text>
              {/* Slogan details */}
              <line x1="145" y1="78" x2="175" y2="78" stroke="#e5c188" strokeWidth="1.5" />
              <text x="187" y="82" fill="#e5c188" fontFamily="'Inter', sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="0.28em">DRIVE BEYOND ORDINARY</text>
              <line x1="412" y1="78" x2="442" y2="78" stroke="#e5c188" strokeWidth="1.5" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8">
              <Link className={getLinkClass('/inventory')} to="/inventory">
                Inventory
              </Link>
              <Link className={getLinkClass('/compare')} to="/compare">
                Compare
              </Link>
              <Link className={getLinkClass('/financing')} to="/financing">
                Financing
              </Link>
              <Link className={getLinkClass('/test-drive')} to="/test-drive">
                Test Drive
              </Link>
            </div>
            <span 
              onClick={() => setSearchOpen(true)}
              className="material-symbols-outlined text-primary dark:text-on-primary cursor-pointer active:scale-95 transition-all hover:text-secondary-fixed-dim p-2"
            >
              search
            </span>
          </div>
        </nav>
      </header>

      {/* Global Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-2xl transition-all duration-300 animate-fade-in text-white">
          <div className="max-w-4xl mx-auto w-full px-grid-margin py-12 flex-grow flex flex-col">
            
            {/* Header / Close Row */}
            <div className="flex justify-between items-center mb-16">
              <div className="font-label-caps text-[11px] tracking-[0.25em] text-secondary-fixed-dim font-bold">
                DRIVEX SEARCH SYSTEM
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close Search"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full group mb-12">
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Type brand, model, or category (e.g., Porsche, Electric)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-secondary-fixed-dim focus:ring-0 py-6 pr-16 text-2xl md:text-4xl font-light placeholder:opacity-30 outline-none text-white transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-secondary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">arrow_forward</span>
              </button>
            </form>

            {/* Autocomplete Results */}
            <div className="flex-grow">
              {searchQuery.trim().length > 0 ? (
                <div>
                  <h3 className="font-label-caps text-[10px] text-white/40 tracking-wider mb-6 uppercase">
                    Suggested Fleet Matches ({searchResults.length})
                  </h3>
                  
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((car) => (
                        <div 
                          key={car.id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/car/${car.id}`);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-6 p-4 rounded-xl border border-white/5 hover:border-secondary-fixed-dim/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                        >
                          <img 
                            src={car.image} 
                            alt={car.name} 
                            className="w-20 h-12 object-cover rounded-md border border-white/10 group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="flex-grow">
                            <span className="font-label-caps text-[9px] text-secondary-fixed-dim tracking-widest">{car.brand}</span>
                            <h4 className="font-headline-md text-[18px] text-white font-bold leading-tight group-hover:text-secondary-fixed-dim transition-colors">
                              {car.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="font-headline-md text-[16px] text-white/80 font-bold">{car.price}</span>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-6 border-t border-white/10 text-center">
                        <button
                          type="submit"
                          onClick={handleSearchSubmit}
                          className="inline-flex items-center gap-2 text-xs font-label-caps text-secondary-fixed-dim hover:text-white transition-colors"
                        >
                          <span>Press Enter to View All Matching Vehicles</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-white/40">
                      <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
                      <p className="font-body-lg">No exact fleet matches found.</p>
                      <button 
                        type="submit"
                        onClick={handleSearchSubmit}
                        className="mt-4 text-xs font-label-caps text-secondary-fixed-dim hover:text-white underline"
                      >
                        Search globally in live inventory instead
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/50">
                  <div>
                    <h4 className="font-label-caps text-[10px] text-white/30 tracking-wider mb-4 uppercase">Popular Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Porsche', 'McLaren', 'Ferrari', 'Electric', 'Hybrid'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-secondary-fixed-dim hover:text-white text-xs font-medium transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-[10px] text-white/30 tracking-wider mb-4 uppercase">Quick Operations</h4>
                    <ul className="space-y-3 text-xs">
                      <li>
                        <Link 
                          to="/compare" 
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-2 hover:text-white transition-colors text-white/70"
                        >
                          <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                          <span>Compare Performance DNA</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/test-drive" 
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-2 hover:text-white transition-colors text-white/70"
                        >
                          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                          <span>Book Private Test Drive</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
