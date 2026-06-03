import { useSpring, animated } from '@react-spring/web';

interface FilterState {
  brands: string[];
  propulsions: string[];
  maxPrice: number;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalFound: number;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  totalFound
}: FilterDrawerProps) {
  // Slide animation from right (100% to 0%)
  const drawerAnimation = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    config: { tension: 240, friction: 26 },
  });

  // Fade animation for backdrop
  const backdropAnimation = useSpring({
    opacity: isOpen ? 0.4 : 0,
    pointerEvents: isOpen ? 'auto' : 'none' as const,
    config: { duration: 200 },
  });

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands });
  };

  const togglePropulsion = (propulsion: string) => {
    const propulsions = filters.propulsions.includes(propulsion)
      ? filters.propulsions.filter((p) => p !== propulsion)
      : [...filters.propulsions, propulsion];
    onFilterChange({ ...filters, propulsions });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: parseInt(e.target.value, 10) });
  };

  const resetFilters = () => {
    onFilterChange({ brands: [], propulsions: [], maxPrice: 400000 });
  };

  const brands = ['PORSCHE', 'MCLAREN', 'FERRARI', 'TESLA'];
  const propulsions = [
    { key: 'Electric', label: 'Electric / EV' },
    { key: 'Hybrid', label: 'Hybrid' },
    { key: 'Combustion', label: 'Internal Combustion' }
  ];

  return (
    <>
      {/* Backdrop */}
      <animated.div
        className="fixed inset-0 bg-black z-[55] backdrop-blur-sm"
        style={backdropAnimation}
        onClick={onClose}
      />

      {/* Drawer */}
      <animated.div
        className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white text-black z-[70] shadow-2xl flex flex-col justify-between"
        style={drawerAnimation}
      >
        <div className="overflow-y-auto flex-1 px-8 py-12">
          <div className="flex justify-between items-center mb-12">
            <span className="font-headline-lg text-headline-lg">Filters</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={resetFilters} 
                className="text-xs font-label-caps opacity-50 hover:opacity-100 hover:text-secondary-fixed-dim transition-all"
              >
                CLEAR ALL
              </button>
              <button
                className="material-symbols-outlined cursor-pointer hover:text-secondary-fixed-dim transition-colors"
                onClick={onClose}
              >
                close
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {/* Brands */}
            <div>
              <h4 className="font-label-caps text-label-caps mb-6 opacity-60">Brand</h4>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((brand) => {
                  const isChecked = filters.brands.includes(brand);
                  return (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`border py-3 cursor-pointer transition-all font-label-caps text-label-caps text-center active:scale-95 ${
                        isChecked 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-outline-variant hover:border-primary text-black'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Propulsion */}
            <div>
              <h4 className="font-label-caps text-label-caps mb-6 opacity-60">Propulsion</h4>
              <div className="space-y-4">
                {propulsions.map((p) => {
                  const isChecked = filters.propulsions.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      onClick={() => togglePropulsion(p.key)}
                      className="flex items-center justify-between w-full group cursor-pointer text-left"
                    >
                      <span className="font-body-md text-body-md text-black">{p.label}</span>
                      <div className="w-5 h-5 border border-outline group-hover:border-primary transition-colors rounded-sm flex items-center justify-center">
                        {isChecked && <div className="w-3 h-3 bg-primary"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h4 className="font-label-caps text-label-caps mb-6 opacity-60">Price Range</h4>
              <input
                className="w-full accent-primary bg-surface-variant h-1 appearance-none cursor-pointer"
                type="range"
                min="50000"
                max="400000"
                step="10000"
                value={filters.maxPrice}
                onChange={handlePriceChange}
              />
              <div className="flex justify-between mt-4 font-label-caps text-label-caps opacity-50">
                <span>$50k</span>
                <span className="font-bold text-black">${(filters.maxPrice / 1000).toFixed(0)}k</span>
                <span>$400k+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-outline-variant">
          <button
            onClick={onClose}
            className="w-full bg-primary text-on-primary py-5 font-label-caps text-label-caps transition-all active:scale-[0.98] hover:bg-secondary-fixed-dim hover:text-primary"
          >
            APPLY RESULTS ({totalFound} FOUND)
          </button>
        </div>
      </animated.div>
    </>
  );
}
