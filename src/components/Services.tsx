import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  
  // Icon selector to render Lucide widgets by string name
  const renderServiceIcon = (iconName: string) => {
    // Dynamic loading fallback
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-neon-blue" />;
    }
    return <LucideIcons.Cpu className="w-6 h-6 text-neon-blue" />;
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
              className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 hover:border-white/20 shadow-lg relative group overflow-hidden neon-border-interactive flex flex-col justify-between"
            >
              <div className="text-left">
                {/* Icon wrapper with glow effect */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/30 w-fit transition-colors mb-6 relative">
                  {renderServiceIcon(srv.icon)}
                  <div className="absolute inset-0 bg-neon-blue bg-opacity-10 rounded-2xl blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-3">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Dynamic bottom index item */}
              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-xs font-mono text-slate-500">
                <span>0{idx + 1} / SERVICE INDEX</span>
                <span className="text-neon-pink group-hover:animate-pulse">● READY</span>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/5 rounded-full blur-2xl group-hover:bg-neon-purple/20 transition-colors"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
