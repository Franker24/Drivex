import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard, { Car } from '../components/inventory/VehicleCard';
import FilterDrawer from '../components/inventory/FilterDrawer';

const NINJAS_API_KEY = 'WJma8Dg2uFDByM9a1mkAazMIvEMzF3H1ZF55D7EQ';
const UNSPLASH_ACCESS_KEY = '8BkmB_ys_AlL0PGtIlP8_4Y2Gpkk3cUXT4wVKlh9Qcg';

const DEFAULT_MODELS = [
  { make: 'Porsche', model: '911 GT3', fallbackPrice: 182900, tag: 'NEW ARRIVAL' },
  { make: 'McLaren', model: 'Artura', fallbackPrice: 233000 },
  { make: 'Ferrari', model: 'Roma', fallbackPrice: 243360 },
  { make: 'Tesla', model: 'Model S', fallbackPrice: 89990 },
  { make: 'Porsche', model: 'Taycan', fallbackPrice: 194900 },
  { make: 'McLaren', model: '720S', fallbackPrice: 310500, tag: 'CERTIFIED PRE-OWNED' },
  { make: 'Aston Martin', model: 'Vantage', fallbackPrice: 191000 },
  { make: 'Audi', model: 'R8', fallbackPrice: 158600, tag: 'LIMITED EDITION' },
  { make: 'Lamborghini', model: 'Huracan', fallbackPrice: 248000, tag: 'V10 PERFORMANCE' },
  { make: 'Bentley', model: 'Continental GT', fallbackPrice: 235000 },
  { make: 'BMW', model: 'i8', fallbackPrice: 147500 },
  { make: 'Chevrolet', model: 'Corvette Z06', fallbackPrice: 112000 }
];

const LOCAL_SPECS: Record<string, { hp: string; acceleration: string }> = {
  '911 gt3': { hp: '502 HP', acceleration: '3.2s 0-60' },
  'artura': { hp: '671 HP', acceleration: '3.0s 0-60' },
  'roma': { hp: '612 HP', acceleration: '3.4s 0-60' },
  'model s': { hp: '1020 HP', acceleration: '1.99s 0-60' },
  'taycan': { hp: '750 HP', acceleration: '2.6s 0-60' },
  '720s': { hp: '710 HP', acceleration: '2.8s 0-60' },
  'vantage': { hp: '503 HP', acceleration: '3.5s 0-60' },
  'r8': { hp: '602 HP', acceleration: '3.2s 0-60' },
  'huracan': { hp: '631 HP', acceleration: '2.9s 0-60' },
  'continental gt': { hp: '626 HP', acceleration: '3.6s 0-60' },
  'i8': { hp: '369 HP', acceleration: '4.4s 0-60' },
  'corvette z06': { hp: '670 HP', acceleration: '2.6s 0-60' }
};

// Fallback data in case APIs fail
const FALLBACK_CARS: Car[] = [
  {
    id: 'porsche-911-gt3',
    name: 'Porsche 911 GT3',
    brand: 'PORSCHE',
    type: 'Combustion',
    price: 182900,
    priceFormatted: '$182,900',
    tag: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    alt: 'A sleek silver Porsche 911 GT3.',
    hp: '502 HP',
    acceleration: '3.2s 0-60',
    specIcon: 'settings_suggest',
    specName: 'Drivetrain',
    specValue: 'RWD'
  },
  {
    id: 'mclaren-artura',
    name: 'McLaren Artura',
    brand: 'MCLAREN',
    type: 'Hybrid',
    price: 233000,
    priceFormatted: '$233,000',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    alt: 'A black McLaren Artura.',
    hp: '671 HP',
    acceleration: '3.0s 0-60',
    specIcon: 'speed',
    specName: 'Top Speed',
    specValue: '205 MPH'
  },
  {
    id: 'ferrari-roma',
    name: 'Ferrari Roma',
    brand: 'FERRARI',
    type: 'Combustion',
    price: 243360,
    priceFormatted: '$243,360',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    alt: 'A vibrant red Ferrari Roma.',
    hp: '612 HP',
    acceleration: '3.4s 0-60',
    specIcon: 'mode_fan',
    specName: 'Engine Type',
    specValue: 'V8 TURBO'
  },
  {
    id: 'tesla-model-s-plaid',
    name: 'Tesla Model S Plaid',
    brand: 'TESLA',
    type: 'Electric',
    price: 89990,
    priceFormatted: '$89,990',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    alt: 'A white Tesla Model S Plaid.',
    hp: '1020 HP',
    acceleration: '1.99s 0-60',
    specIcon: 'battery_charging_full',
    specName: 'Range',
    specValue: '396 MI RANGE'
  },
  {
    id: 'taycan-turbo-s',
    name: 'Taycan Turbo S',
    brand: 'PORSCHE',
    type: 'Electric',
    price: 194900,
    priceFormatted: '$194,900',
    image: 'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=1200&q=80',
    alt: 'A Taycan Turbo S.',
    hp: '750 HP',
    acceleration: '2.6s 0-60',
    specIcon: 'flash_on',
    specName: 'Architecture',
    specValue: '800V SYSTEM'
  },
  {
    id: 'bespoke-720s',
    name: 'Bespoke 720S',
    brand: 'MCLAREN',
    type: 'Combustion',
    price: 310500,
    priceFormatted: '$310,500',
    tag: 'CERTIFIED PRE-OWNED',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
    alt: 'A bespoke McLaren 720S.',
    hp: '710 HP',
    acceleration: '2.8s 0-60',
    specIcon: 'workspace_premium',
    specName: 'Exclusivity',
    specValue: '1 OF 50'
  },
  {
    id: 'aston-martin-vantage',
    name: 'Aston Martin Vantage',
    brand: 'ASTON MARTIN',
    type: 'Combustion',
    price: 191000,
    priceFormatted: '$191,000',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
    alt: 'A British racing green Aston Martin Vantage.',
    hp: '503 HP',
    acceleration: '3.5s 0-60',
    specIcon: 'settings_suggest',
    specName: 'Drivetrain',
    specValue: 'RWD'
  },
  {
    id: 'audi-r8',
    name: 'Audi R8 Coupe',
    brand: 'AUDI',
    type: 'Combustion',
    price: 158600,
    priceFormatted: '$158,600',
    tag: 'LIMITED EDITION',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    alt: 'A sleek grey Audi R8 Coupe.',
    hp: '602 HP',
    acceleration: '3.2s 0-60',
    specIcon: 'speed',
    specName: 'Top Speed',
    specValue: '201 MPH'
  },
  {
    id: 'lamborghini-huracan',
    name: 'Lamborghini Huracán',
    brand: 'LAMBORGHINI',
    type: 'Combustion',
    price: 248000,
    priceFormatted: '$248,000',
    tag: 'V10 PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    alt: 'A yellow Lamborghini Huracán.',
    hp: '631 HP',
    acceleration: '2.9s 0-60',
    specIcon: 'speed',
    specName: 'Top Speed',
    specValue: '202 MPH'
  },
  {
    id: 'bentley-continental',
    name: 'Bentley Continental GT',
    brand: 'BENTLEY',
    type: 'Combustion',
    price: 235000,
    priceFormatted: '$235,000',
    image: 'https://images.unsplash.com/photo-1618843479619-f41987ba05a3?auto=format&fit=crop&w=1200&q=80',
    alt: 'A black Bentley Continental GT.',
    hp: '626 HP',
    acceleration: '3.6s 0-60',
    specIcon: 'workspace_premium',
    specName: 'Transmission',
    specValue: '8-SPEED DUAL-CLUTCH'
  },
  {
    id: 'bmw-i8',
    name: 'BMW i8 Roadster',
    brand: 'BMW',
    type: 'Hybrid',
    price: 147500,
    priceFormatted: '$147,500',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    alt: 'A sleek white BMW i8 Roadster.',
    hp: '369 HP',
    acceleration: '4.4s 0-60',
    specIcon: 'battery_charging_full',
    specName: 'Battery',
    specValue: '11.6 KWH'
  },
  {
    id: 'corvette-z06',
    name: 'Corvette Z06',
    brand: 'CHEVROLET',
    type: 'Combustion',
    price: 112000,
    priceFormatted: '$112,000',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    alt: 'A red Chevrolet Corvette Z06.',
    hp: '670 HP',
    acceleration: '2.6s 0-60',
    specIcon: 'settings_suggest',
    specName: 'Engine Type',
    specValue: '5.5L V8 FLAT-PLANE'
  }
];

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';

  const [defaultCars, setDefaultCars] = useState<Car[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(urlQuery);
  const [liveSearching, setLiveSearching] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(12); // Loaded more default cars, so limit starts at 12!
  const [filters, setFilters] = useState({
    brands: [] as string[],
    propulsions: [] as string[],
    maxPrice: 400000,
  });

  // Update search query state if URL parameter changes
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Load cars dynamically from APIs
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      const promises = DEFAULT_MODELS.map(async (item) => {
        try {
          // 1. Fetch specifications from API-Ninjas
          const ninjaRes = await fetch(
            `https://api.api-ninjas.com/v1/cars?make=${encodeURIComponent(item.make)}&model=${encodeURIComponent(item.model)}&limit=1`,
            { headers: { 'X-Api-Key': NINJAS_API_KEY } }
          );
          if (!ninjaRes.ok) throw new Error('Ninja API Error');
          const ninjaData = await ninjaRes.json();
          const ninjaCar = ninjaData[0] || {};

          // 2. Fetch image from Unsplash
          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.make + ' ' + item.model + ' car')}&per_page=1`,
            { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
          );
          if (!unsplashRes.ok) throw new Error('Unsplash API Error');
          const unsplashData = await unsplashRes.json();
          const imgUrl = unsplashData.results?.[0]?.urls?.regular || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70';
          const altText = unsplashData.results?.[0]?.alt_description || `A premium ${item.make} ${item.model}`;

          // 3. Map propulsion type
          let type: 'Electric' | 'Hybrid' | 'Combustion' = 'Combustion';
          if (item.model.includes('Taycan') || item.model.includes('Model S') || ninjaCar.fuel_type === 'electricity') {
            type = 'Electric';
          } else if (item.model.includes('Artura') || item.model.includes('i8')) {
            type = 'Hybrid';
          }

          const drive = (ninjaCar.drive || 'rwd').toUpperCase();
          const localSpecs = LOCAL_SPECS[item.model.toLowerCase()] || { hp: '500 HP', acceleration: '3.0s 0-60' };

          return {
            id: `${item.make.toLowerCase()}-${item.model.toLowerCase().replace(/\s+/g, '-')}`,
            name: `${item.make} ${item.model}`,
            brand: item.make.toUpperCase(),
            type,
            price: item.fallbackPrice,
            priceFormatted: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.fallbackPrice),
            tag: item.tag,
            image: imgUrl,
            alt: altText,
            hp: localSpecs.hp,
            acceleration: localSpecs.acceleration,
            specIcon: 'settings_suggest',
            specName: 'Drivetrain',
            specValue: drive
          } as Car;
        } catch (e) {
          console.warn(`Error loading model ${item.make} ${item.model}, using local fallback.`, e);
          const fallbackMatch = FALLBACK_CARS.find(c => c.name.toLowerCase().includes(item.model.toLowerCase()));
          return fallbackMatch || null;
        }
      });

      const loadedCars = await Promise.all(promises);
      const validCars = loadedCars.filter(Boolean) as Car[];
      const finalCars = validCars.length > 0 ? validCars : FALLBACK_CARS;

      if (active) {
        setDefaultCars(finalCars);
        setCars(finalCars);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Live search API query trigger
  useEffect(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.trim().length <= 2) {
      if (defaultCars.length > 0) {
        setCars(defaultCars);
      }
      setLiveSearching(false);
      return;
    }

    let active = true;

    const performLiveSearch = async () => {
      setLoading(true);
      setLiveSearching(true);

      const query = debouncedSearchQuery.trim();
      const spaceIndex = query.indexOf(' ');
      let make = '';
      let model = '';

      if (spaceIndex !== -1) {
        make = query.substring(0, spaceIndex);
        model = query.substring(spaceIndex + 1);
      } else {
        model = query;
      }

      let url = `https://api.api-ninjas.com/v1/cars?limit=9`;
      if (make && model) {
        url += `&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
      } else {
        url += `&model=${encodeURIComponent(model)}`;
      }

      try {
        let ninjaRes = await fetch(url, { headers: { 'X-Api-Key': NINJAS_API_KEY } });
        let ninjaData = [];
        if (ninjaRes.ok) {
          ninjaData = await ninjaRes.json();
        }

        // If no results and it was a single word, try querying as make (brand)
        if (ninjaData.length === 0 && !make) {
          ninjaRes = await fetch(`https://api.api-ninjas.com/v1/cars?make=${encodeURIComponent(model)}&limit=9`, {
            headers: { 'X-Api-Key': NINJAS_API_KEY }
          });
          if (ninjaRes.ok) {
            ninjaData = await ninjaRes.json();
          }
        }

        if (ninjaData.length === 0) {
          if (active) {
            setCars([]);
            setLoading(false);
          }
          return;
        }

        // Map live results and fetch matching Unsplash image
        const promises = ninjaData.map(async (item: any, idx: number) => {
          const makeStr = item.make.toUpperCase();
          const modelStr = item.model.charAt(0).toUpperCase() + item.model.slice(1);
          
          let imgUrl = '';
          let altText = `A premium ${makeStr} ${modelStr}`;
          
          try {
            const unsplashRes = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.make + ' ' + item.model + ' car')}&per_page=1`,
              { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
            );
            if (unsplashRes.ok) {
              const data = await unsplashRes.json();
              imgUrl = data.results?.[0]?.urls?.regular;
              if (data.results?.[0]?.alt_description) {
                altText = data.results[0].alt_description;
              }
            }
          } catch (unsplashErr) {
            console.warn("Unsplash live fetch error", unsplashErr);
          }

          if (!imgUrl) {
            const backupImages = [
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1611245801318-7b340edb647d?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80'
            ];
            imgUrl = backupImages[idx % backupImages.length];
          }

          // Generate premium price
          let basePrice = 65000;
          const superBrands = ['PORSCHE', 'FERRARI', 'MCLAREN', 'LAMBORGHINI', 'BENTLEY', 'ASTON', 'ROLLS', 'MASERATI'];
          const luxuryBrands = ['AUDI', 'BMW', 'MERCEDES', 'TESLA', 'LEXUS', 'LAND', 'JAGUAR'];
          
          if (superBrands.includes(makeStr)) {
            basePrice = 185000 + (idx * 25000) + (item.year % 5 * 10000);
          } else if (luxuryBrands.includes(makeStr)) {
            basePrice = 75000 + (idx * 8000) + (item.year % 5 * 3000);
          } else {
            basePrice = 35000 + (idx * 3000) + (item.year % 5 * 1000);
          }

          const hpVal = item.cylinders ? `${item.cylinders * 85 + 180} HP` : '320 HP';
          const accelerationVal = item.cylinders ? `${Math.max(2.1, (10 - item.cylinders * 0.9)).toFixed(1)}s 0-60` : '4.2s 0-60';
          const propulsionType = item.fuel_type === 'electricity' ? 'Electric' : (item.fuel_type === 'gas' && item.cylinders <= 4 ? 'Hybrid' : 'Combustion');

          return {
            id: `${item.make}-${item.model}-${idx}-${item.year}`.toLowerCase().replace(/\s+/g, '-'),
            name: `${makeStr.charAt(0) + makeStr.slice(1).toLowerCase()} ${modelStr}`,
            brand: makeStr,
            type: propulsionType,
            price: basePrice,
            priceFormatted: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(basePrice),
            image: imgUrl,
            alt: altText,
            hp: hpVal,
            acceleration: accelerationVal,
            specIcon: 'settings_suggest',
            specName: 'Drivetrain',
            specValue: (item.drive || 'rwd').toUpperCase()
          } as Car;
        });

        const loadedResults = await Promise.all(promises);
        const validResults = loadedResults.filter(Boolean) as Car[];

        if (active) {
          setCars(validResults);
          setLoading(false);
        }
      } catch (err) {
        console.error("Live search failed, fall back to default catalog filtering", err);
        if (active) {
          setCars(defaultCars);
          setLoading(false);
        }
      }
    };

    performLiveSearch();

    return () => {
      active = false;
    };
  }, [debouncedSearchQuery, defaultCars]);

  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Local search filtering matches search box for active dataset
      const matchesSearch = 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.hp.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand =
        filters.brands.length === 0 || filters.brands.includes(car.brand);

      const matchesPropulsion =
        filters.propulsions.length === 0 || filters.propulsions.includes(car.type);

      const matchesPrice = car.price <= filters.maxPrice;

      return matchesSearch && matchesBrand && matchesPropulsion && matchesPrice;
    });
  }, [cars, searchQuery, filters]);

  const displayedCars = useMemo(() => {
    return filteredCars.slice(0, visibleLimit);
  }, [filteredCars, visibleLimit]);

  const loadMore = () => {
    setVisibleLimit((prev) => prev + 3);
  };

  return (
    <div className="bg-background min-h-screen text-on-background">
      <main className="pt-[60px] max-w-container-max-width mx-auto px-grid-margin">
        {/* Search & Filter Top Bar */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-grid-gutter py-12 md:py-16">
          <div className="flex-1 max-w-2xl">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
              Live Inventory
            </h2>
            <div className="relative group">
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 pr-12 focus:ring-0 focus:border-secondary-fixed-dim transition-all text-headline-md font-headline-md placeholder:opacity-30 outline-none text-black"
                placeholder="Search globally by brand or model (e.g. BMW M5, Mustang)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
            </div>
            {liveSearching && (
              <p className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-wider mt-2 animate-pulse uppercase">
                Querying global automotive database...
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-6 py-3 border border-outline-variant hover:border-primary transition-all active:scale-95 group bg-white text-black rounded-lg shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span className="font-label-caps text-label-caps">Filters</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 border-l border-outline-variant/30 pl-grid-gutter ml-2">
              <span className="font-label-caps text-label-caps opacity-40 text-black">
                {filteredCars.length} Vehicles Found
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Filter Drawer */}
        <FilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          totalFound={filteredCars.length}
        />

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-outline-variant border-t-secondary-fixed-dim rounded-full animate-spin"></div>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-black">
              fetching premium inventory...
            </p>
          </div>
        ) : displayedCars.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-grid-gutter gap-y-section-gap-mobile mb-16">
            {displayedCars.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </section>
        ) : (
          <div className="py-24 text-center text-black">
            <span className="material-symbols-outlined text-6xl opacity-30 mb-4">search_off</span>
            <p className="font-headline-md text-headline-md opacity-55">No vehicles match your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({ brands: [], propulsions: [], maxPrice: 400000 });
              }}
              className="mt-6 px-8 py-3 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-opacity-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredCars.length > displayedCars.length && (
          <div className="flex flex-col items-center gap-8 mb-24">
            <button
              onClick={loadMore}
              className="px-12 py-5 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-opacity-90 transition-all active:scale-95 shadow-md"
            >
              LOAD MORE MODELS
            </button>
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="w-2 h-2 bg-outline-variant rounded-full"></span>
              <span className="w-2 h-2 bg-outline-variant rounded-full"></span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
