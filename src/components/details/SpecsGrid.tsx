import { useSpring, animated } from '@react-spring/web';

interface SpecData {
  engine: string;
  hp: string;
  torque: string;
  acceleration: string;
  aeroVal: number;
  responseVal: number;
  stabilityVal: number;
}

interface SpecsGridProps {
  specs: SpecData;
}

export default function SpecsGrid({ specs }: SpecsGridProps) {
  // Animate progress bars
  const aeroSpring = useSpring({
    from: { width: '0%' },
    to: { width: `${specs.aeroVal}%` },
    config: { tension: 120, friction: 30 },
  });

  const responseSpring = useSpring({
    from: { width: '0%' },
    to: { width: `${specs.responseVal}%` },
    config: { tension: 120, friction: 30 },
  });

  const stabilitySpring = useSpring({
    from: { width: '0%' },
    to: { width: `${specs.stabilityVal}%` },
    config: { tension: 120, friction: 30 },
  });

  return (
    <section className="py-16 md:py-24 bg-surface text-black">
      <div className="max-w-container-max-width mx-auto px-grid-margin">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-grid-gutter border-b border-outline-variant/30 pb-16">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">ENGINE</span>
            <span className="font-headline-lg text-headline-lg text-primary">{specs.engine}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">HORSEPOWER</span>
            <span className="font-headline-lg text-headline-lg text-primary">{specs.hp}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">TORQUE</span>
            <span className="font-headline-lg text-headline-lg text-primary">{specs.torque}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">0-60 MPH</span>
            <span className="font-headline-lg text-headline-lg text-primary">{specs.acceleration}</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-8 uppercase">ENGINEERED TO DOMINATE</h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-caps text-label-caps uppercase">Aerodynamics</span>
                  <span className="font-label-caps text-label-caps">{specs.aeroVal}%</span>
                </div>
                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                  <animated.div style={aeroSpring} className="h-full bg-primary" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-caps text-label-caps uppercase">Response Time</span>
                  <span className="font-label-caps text-label-caps">{specs.responseVal}%</span>
                </div>
                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                  <animated.div style={responseSpring} className="h-full bg-secondary-fixed-dim" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label-caps text-label-caps uppercase">Stability Control</span>
                  <span className="font-label-caps text-label-caps">{specs.stabilityVal}%</span>
                </div>
                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                  <animated.div style={stabilitySpring} className="h-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group cursor-crosshair">
            <div className="absolute -inset-4 bg-secondary-fixed-dim/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            <img 
              className="w-full h-[400px] md:h-[500px] object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700" 
              alt="High-detail close-up of high-performance ceramic brakes." 
              src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
