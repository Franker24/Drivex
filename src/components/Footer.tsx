import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-lowest dark:bg-tertiary border-t border-outline-variant/20">
      <div className="max-w-container-max-width mx-auto px-grid-margin flex flex-col items-center text-center space-y-grid-gutter">
        <div className="font-label-caps text-label-caps text-primary dark:text-on-primary tracking-[0.3em] font-bold">
          DRIVEX
        </div>
        
        <div className="flex flex-col md:flex-row gap-grid-gutter">
          <Link 
            className="font-body-md text-body-md text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors" 
            to="/about"
          >
            About Us
          </Link>
          <Link 
            className="font-body-md text-body-md text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors" 
            to="/contact"
          >
            Contact & Showroom
          </Link>
          <Link 
            className="font-body-md text-body-md text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors" 
            to="/inventory"
          >
            Inventory
          </Link>
          <a 
            className="font-body-md text-body-md text-on-surface-variant dark:text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors" 
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
        </div>
        
        <div className="pt-8 text-on-surface-variant/50 font-label-caps text-[10px] tracking-wider">
          © {new Date().getFullYear()} DRIVEX AUTOMOTIVE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
