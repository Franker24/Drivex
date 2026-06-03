import { Link } from 'react-router-dom';

interface StickyCTAProps {
  carName: string;
  carPrice: string;
}

export default function StickyCTA({ carName, carPrice }: StickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 z-40 shadow-lg">
      <div className="max-w-container-max-width mx-auto px-grid-margin py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
              Current Selection
            </span>
            <span className="font-headline-md text-headline-md text-black">
              {carName} <span className="text-secondary-fixed-dim ml-2 font-normal">EST. {carPrice}</span>
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Link 
            to="/contact"
            className="flex-1 md:flex-none text-center px-8 py-4 border border-primary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-white transition-all duration-300"
          >
            CONTACT DEALER
          </Link>
          <Link 
            to="/test-drive"
            className="flex-1 md:flex-none text-center px-8 py-4 bg-primary text-white font-label-caps text-label-caps hover:bg-secondary-fixed-dim hover:text-primary transition-all duration-300"
          >
            BOOK TEST DRIVE
          </Link>
        </div>
      </div>
    </div>
  );
}
