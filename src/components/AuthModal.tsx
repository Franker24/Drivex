import { useState } from 'react';
import { db } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (isRegister) {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      try {
        const newUser = db.register(email, name);
        db.setCurrentUser(newUser);
        setSuccess(`Welcome, ${newUser.name}!`);
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    } else {
      // Login flow
      const users = db.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user) {
        db.setCurrentUser(user);
        setSuccess(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError('Email not found. Please register a new account or use a demo account.');
      }
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (user) {
      db.setCurrentUser(user);
      setSuccess(`LoggedIn as ${user.name} (${user.role})`);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4">
      <div 
        className="w-full max-w-md bg-[#121212]/90 border border-white/10 rounded-2xl p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-fixed-dim/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Header */}
        <div className="mb-8 relative z-10 text-center">
          <span className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.25em] font-bold uppercase">
            Drivex Club Access
          </span>
          <h2 className="font-headline-md text-2xl text-white font-bold mt-2">
            {isRegister ? 'Create Your Account' : 'Sign In to Drivex'}
          </h2>
          <p className="text-white/60 text-xs mt-1">
            {isRegister ? 'Unlock personalized specs and save your garage configurations.' : 'Access your saved configurations and bookings.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="block text-[11px] font-label-caps text-white/70 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:opacity-30 focus:border-secondary-fixed-dim focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-label-caps text-white/70 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:opacity-30 focus:border-secondary-fixed-dim focus:outline-none transition-colors"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-secondary-fixed-dim hover:bg-white text-black font-semibold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(229,193,136,0.2)] mt-6 cursor-pointer"
          >
            {isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        {/* Toggle links */}
        <div className="mt-6 text-center text-xs relative z-10 text-white/60">
          <span>{isRegister ? 'Already have an account? ' : "Don't have an account? "}</span>
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-secondary-fixed-dim hover:underline font-semibold cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
          <div className="text-center mb-3">
            <span className="text-[10px] font-label-caps text-white/40 tracking-wider">Demo Quick Access</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('client@drivex.com')}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-secondary-fixed-dim text-[11px] text-white/80 transition-all text-left flex flex-col cursor-pointer"
            >
              <span className="font-semibold text-secondary-fixed-dim">Client Access</span>
              <span className="text-[9px] text-white/40 truncate">client@drivex.com</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin@drivex.com')}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-secondary-fixed-dim text-[11px] text-white/80 transition-all text-left flex flex-col cursor-pointer"
            >
              <span className="font-semibold text-secondary-fixed-dim">Admin Access</span>
              <span className="text-[9px] text-white/40 truncate">admin@drivex.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
