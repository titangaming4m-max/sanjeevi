import React, { useState } from 'react';
import { Menu, X, ShieldAlert, Sparkles, Terminal, LogOut, Briefcase, Cpu, Code, Flame, Zap, Atom } from 'lucide-react';

interface NavbarProps {
  websiteTitle: string;
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  activeTheme: string;
  onThemeToggle: () => void;
  logoText?: string;
  logoType?: 'icon' | 'image';
  logoImageUrl?: string;
  logoIconName?: string;
}

export default function Navbar({
  websiteTitle,
  onAdminClick,
  isAdmin,
  onLogout,
  activeTheme,
  onThemeToggle,
  logoText,
  logoType = 'icon',
  logoImageUrl,
  logoIconName = 'Terminal'
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLogoIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Code': return <Code className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Flame': return <Flame className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Zap': return <Zap className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Atom': return <Atom className="w-4 h-4 text-neon-pink animate-pulse" />;
      case 'Terminal':
      default:
        return <Terminal className="w-4 h-4 text-neon-pink animate-pulse" />;
    }
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            {logoType === 'image' && logoImageUrl ? (
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-blue p-[1.5px]">
                <div className="w-full h-full rounded-[7px] bg-[#0c0817] overflow-hidden flex items-center justify-center">
                  <img src={logoImageUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-lg blur-sm opacity-30 -z-10"></div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-blue p-[1.5px]">
                <div className="w-full h-full rounded-[7px] bg-[#0c0817] flex items-center justify-center">
                  {getLogoIcon(logoIconName)}
                </div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-lg blur-sm opacity-30 -z-10"></div>
              </div>
            )}
            <a href="#home" className="text-lg font-bold font-display tracking-wider bg-gradient-to-r from-white via-[#f3e8ff] to-neon-blue bg-clip-text text-transparent flex items-center space-x-1">
              <span>{logoText || websiteTitle || 'NEON.DEV'}</span>
            </a>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Call to Actions & Special Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin control panel button */}
            <button
              onClick={onAdminClick}
              className={`p-2 rounded-full border transition-all cursor-pointer relative group ${
                isAdmin 
                ? 'border-neon-pink/50 bg-neon-pink/10 text-neon-pink' 
                : 'border-white/5 hover:border-neon-blue/30 bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title={isAdmin ? "Admin Mode Active" : "Admin Panel Gate"}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logs-Out</span>
              </button>
            ) : (
              <a
                href="#contact"
                className="relative px-5 py-2 overflow-hidden rounded-xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-xs font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(138,43,226,0.25)] flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hire Me</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden space-x-3">
            <button
              onClick={onAdminClick}
              className={`p-1.5 rounded-full border ${isAdmin ? 'border-neon-pink/50 text-neon-pink' : 'border-white/5 text-slate-300'}`}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-heavy border-t border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            {isAdmin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-center py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 font-semibold text-sm"
              >
                Exit Administrator Mode
              </button>
            ) : (
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-sm font-semibold tracking-wider uppercase text-white shadow-lg"
              >
                Hire Me
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
