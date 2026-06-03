import { Link } from 'react-router-dom';

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: 'Electric' | 'Hybrid' | 'Combustion';
  price: number;
  priceFormatted: string;
  tag?: string;
  image: string;
  alt: string;
  hp: string;
  acceleration: string;
  specIcon: string;
  specName: string;
  specValue: string;
}

interface VehicleCardProps {
  car: Car;
}

export default function VehicleCard({ car }: VehicleCardProps) {
  return (
    <Link to={`/car/${car.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden bg-surface-container-low mb-6 aspect-[4/3]">
        {car.tag && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-primary text-on-primary font-label-caps text-[10px] px-3 py-1 tracking-widest uppercase">
              {car.tag}
            </span>
          </div>
        )}
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          alt={car.alt} 
          src={car.image}
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline-lg text-headline-lg leading-tight bg-gradient-to-r from-[#ffe6b3] via-[#e5c188] to-[#be9a5f] bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-300">
              {car.name}
            </h3>
            <p className="font-label-caps text-label-caps opacity-40 mt-1 uppercase">
              {car.brand} • {car.type}
            </p>
          </div>
          <span className="font-headline-md text-headline-md">{car.priceFormatted}</span>
        </div>
        <div className="flex items-center gap-6 border-t border-outline-variant/30 pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] opacity-40">bolt</span>
            <span className="font-label-caps text-[11px]">{car.hp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] opacity-40">timer</span>
            <span className="font-label-caps text-[11px]">{car.acceleration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] opacity-40">{car.specIcon}</span>
            <span className="font-label-caps text-[11px]">{car.specValue}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
