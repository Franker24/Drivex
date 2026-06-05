import { useState, useRef, useEffect } from 'react';
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

const VIDEO_PREVIEWS: Record<string, string> = {
  'porsche-911-gt3': 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-41662-large.mp4',
  'mclaren-artura': 'https://assets.mixkit.co/videos/preview/mixkit-blue-sports-car-speeding-on-a-road-in-sunset-41664-large.mp4',
  'ferrari-roma': 'https://cdn.pixabay.com/video/2021/04/18/71337-539097871_large.mp4',
  'tesla-model-s-plaid': 'https://cdn.pixabay.com/video/2021/05/27/76332-559403816_large.mp4',
  'taycan-turbo-s': 'https://cdn.pixabay.com/video/2020/02/09/32219-390771801_large.mp4',
  'bespoke-720s': 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-41662-large.mp4',
  'aston-martin-vantage': 'https://cdn.pixabay.com/video/2020/09/25/51239-464879796_large.mp4',
  'audi-r8': 'https://assets.mixkit.co/videos/preview/mixkit-dashboard-of-a-sports-car-driving-fast-41667-large.mp4',
  'lamborghini-huracan': 'https://cdn.pixabay.com/video/2022/08/29/130198-746376541_large.mp4',
  'bentley-continental': 'https://cdn.pixabay.com/video/2023/07/28/173673-849557022_large.mp4',
  'bmw-i8': 'https://cdn.pixabay.com/video/2020/02/09/32219-390771801_large.mp4',
  'corvette-z06': 'https://cdn.pixabay.com/video/2021/04/18/71337-539097871_large.mp4'
};

export default function VehicleCard({ car }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videoUrl = VIDEO_PREVIEWS[car.id] || 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-41662-large.mp4';

  useEffect(() => {
    let playPromise: Promise<void> | null = null;
    
    if (isHovered && videoRef.current) {
      playPromise = videoRef.current.play();
      playPromise.catch(() => {
        // Safe catch for autoplay blocks or load cancels
      });
    } else if (!isHovered && videoRef.current) {
      // If play is still loading, wait a frame and pause
      if (playPromise) {
        playPromise.then(() => {
          if (videoRef.current) videoRef.current.pause();
        }).catch(() => {
          if (videoRef.current) videoRef.current.pause();
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  return (
    <Link to={`/car/${car.id}`} className="group cursor-pointer block">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden bg-surface-container-low mb-6 aspect-[4/3] rounded-2xl border border-white/5"
      >
        {car.tag && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="bg-primary text-on-primary font-label-caps text-[10px] px-3 py-1 tracking-widest uppercase">
              {car.tag}
            </span>
          </div>
        )}

        {/* Loop video preview overlay */}
        <video 
          ref={videoRef}
          src={videoUrl}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          loop
          muted
          playsInline
          preload="none"
        />

        <img 
          className={`w-full h-full object-cover transition-all duration-700 z-10 ${
            isHovered ? 'opacity-0 scale-105' : 'opacity-100'
          }`} 
          alt={car.alt} 
          src={car.image}
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none"></div>
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
