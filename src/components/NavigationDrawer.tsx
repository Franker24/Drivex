import { Link, useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const location = useLocation();

  // Slide animation for drawer
  const drawerAnimation = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(-100%)',
    config: { tension: 240, friction: 26 },
  });

  // Fade animation for backdrop
  const backdropAnimation = useSpring({
    opacity: isOpen ? 0.4 : 0,
    pointerEvents: isOpen ? 'auto' : 'none' as const,
    config: { duration: 200 },
  });

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-4 p-5 font-label-caps text-label-caps transition-all duration-300 ${
      isActive
        ? 'text-primary dark:text-on-primary bg-surface-container-highest dark:bg-tertiary-container border-l-4 border-secondary-fixed-dim pl-5'
        : 'text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-low hover:pl-6'
    }`;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Inventory', path: '/inventory', icon: 'directions_car' },
    { label: 'Electric Collection', path: '/collection/electric', icon: 'electric_car' },
    { label: 'Performance Collection', path: '/collection/performance', icon: 'speed' },
    { label: 'Compare Vehicles', path: '/compare', icon: 'compare_arrows' },
    { label: 'Book Test Drive', path: '/test-drive', icon: 'calendar_month' },
    { label: 'Financing', path: '/financing', icon: 'payments' },
    { label: 'About Drivex', path: '/about', icon: 'info' },
    { label: 'Contact', path: '/contact', icon: 'contact_page' },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <animated.div
        className="fixed inset-0 bg-black z-[55] backdrop-blur-sm"
        style={backdropAnimation}
        onClick={onClose}
      />

      {/* Sliding drawer */}
      <animated.aside
        className="fixed left-0 top-0 z-[60] h-full w-80 bg-surface dark:bg-tertiary border-r border-outline-variant/30 shadow-2xl overflow-y-auto"
        style={drawerAnimation}
      >
        <div className="flex flex-col h-full py-grid-margin justify-between">
          <div>
            <div className="px-6 mb-12 flex justify-between items-center">
              <Link 
                to="/" 
                onClick={onClose} 
                className="hover:opacity-90 transition-all flex items-center text-primary dark:text-on-primary"
              >
                <svg className="h-8 w-auto" viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="D-Monogram">
                    {/* Black/White D Shape */}
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
              <button
                className="material-symbols-outlined hover:text-secondary-fixed-dim transition-colors"
                onClick={onClose}
              >
                close
              </button>
            </div>
            
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(item.path)}
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-6 pt-6 border-t border-outline-variant/20 text-on-surface-variant/40 font-label-caps text-[10px] tracking-widest text-center">
            DRIVEX AUTOMOTIVE © 2026
          </div>
        </div>
      </animated.aside>
    </>
  );
}
