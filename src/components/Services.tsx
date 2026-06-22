import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  onInquireService?: (serviceTitle: string, prefillMsg: string) => void;
}

export default function Services({ services, onInquireService }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Icon selector to render Lucide widgets by string name
  const renderServiceIcon = (iconName: string, className = "w-6 h-6 text-neon-blue") => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <LucideIcons.Cpu className={className} />;
  };

  const handleInquireClick = (srv: Service) => {
    if (onInquireService) {
      const templateMsg = `Hi, I am interested in your "${srv.title}" specialist service. Please let me know your typical project timeline and pricing estimates for high-end applications!`;
      onInquireService(srv.title, templateMsg);
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden cyber-grid">
      
      {/* Absolute glow balls */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-radial opacity-30 -z-10 animate-pulse duration-10000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

        {/* Section Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-neon-blue font-semibold mb-1">
            Production Lab
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-center space-x-2">
            <span>Our Specialist</span>
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Services</span>
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-neon-blue to-neon-purple mt-3 rounded-full"></div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={srv.id}
              className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 hover:border-white/20 shadow-lg relative group overflow-hidden neon-border-interactive flex flex-col justify-between min-h-[340px]"
            >
              {/* Floating index */}
              <div className="absolute top-6 right-6 font-mono text-xs text-slate-600 font-bold tracking-wider">
                0{idx + 1}
              </div>

              <div className="text-left">
                {/* Icon wrapper with glow effect */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/30 w-fit transition-colors mb-6 relative">
                  {renderServiceIcon(srv.icon)}
                  <div className="absolute inset-0 bg-neon-blue bg-opacity-10 rounded-2xl blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-3">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed truncate-3-lines">
                  {srv.description}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-6 border-t border-white/5 mt-6 flex flex-col items-stretch">
                <button
                  type="button"
                  id={`srv-learn-${srv.id}`}
                  onClick={() => setSelectedService(srv)}
                  className="w-full py-2.5 px-3 text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-blue/50 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <LucideIcons.Eye className="w-3.5 h-3.5 text-neon-blue" />
                  <span>Learn More</span>
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/5 rounded-full blur-2xl group-hover:bg-neon-purple/20 transition-colors pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Modern Overlay Learn More Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark back layer backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-[#050308]/90 backdrop-blur-md cursor-pointer"
            ></motion.div>

            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#0C0A15] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative overflow-hidden z-10 shadow-2xl shadow-purple-900/10"
            >
              {/* Corner Close trigger icon */}
              <button
                type="button"
                id="modal-close"
                onClick={() => setSelectedService(null)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer hover:scale-105"
                title="Dismiss"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>

              <div className="text-left mt-4">
                
                {/* Header branding info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-neon-blue">
                    {renderServiceIcon(selectedService.icon, "w-8 h-8 text-neon-blue")}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neon-pink font-semibold">Specialist offering</span>
                    <h4 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-tight">{selectedService.title}</h4>
                  </div>
                </div>

                {/* Core description block */}
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-6">
                  <p>{selectedService.description}</p>
                  <p className="text-xs text-slate-400 font-mono italic">
                    All services represent standard production blueprints configured by deep laboratory tests to ensure zero-delay load lines.
                  </p>
                </div>

                {/* Premium checklist detail list */}
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 mb-8">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold block mb-1">Standard inclusions</span>
                  
                  <div className="flex items-start space-x-2.5 text-xs">
                    <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Clean Coding Matrix:</strong> Premium architecture with documented API protocols.</span>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs">
                    <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Responsive Display:</strong> Tailored for mobile, desktop, and interactive viewports.</span>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs">
                    <LucideIcons.Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Active Integration:</strong> Connects to cloud storage interfaces or real-time SDKs.</span>
                  </div>
                </div>

                {/* Bottom transactional action panel */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="w-full py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-blue/30 rounded-2xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer text-center"
                  >
                    Close
                  </button>
                </div>

              </div>

              {/* Decorative radial blur blobs */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-neon-purple/20 rounded-full blur-2xl pointer-events-none"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
