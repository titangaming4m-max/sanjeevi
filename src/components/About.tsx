import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Sparkles, Terminal } from 'lucide-react';
import { AboutData } from '../types';

interface AboutProps {
  data: AboutData;
}

export default function About({ data }: AboutProps) {
  const metaItems = [
    { icon: <User className="w-4 h-4 text-neon-purple" />, label: 'Name', value: data.name || 'Alex Rivera' },
    { icon: <Mail className="w-4 h-4 text-neon-blue" />, label: 'Email', value: data.email || 'alex.rivera@neon.dev' },
    { icon: <Phone className="w-4 h-4 text-neon-pink" />, label: 'Phone', value: data.phone || '+1 (555) 792-4211' },
    { icon: <MapPin className="w-4 h-4 text-teal-400" />, label: 'Location', value: data.location || 'San Francisco, CA' },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-radial opacity-35 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-neon-blue font-semibold mb-1">
            Who am I
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-center space-x-2">
            <span>About</span>
            <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">My Lab</span>
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-neon-purple to-neon-blue mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Sleek Glasmorphic ID Card */}
          <div className="lg:col-span-5">
            <motion.div 
              whileHover={{ y: -6, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-2xl overflow-hidden group shadow-[0_0_25px_rgba(147,51,234,0.15)] cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple opacity-20 rounded-full blur-2xl group-hover:opacity-35 transition-opacity"></div>
              
              {/* Header inside Identity Card */}
              <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-neon-purple to-neon-pink p-[1px] shadow-lg">
                  <img 
                    src={data.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide leading-none">{data.name}</h3>
                  <p className="text-xs text-neon-blue font-mono tracking-wider mt-2 uppercase">{data.experienceYearText || "Fullstack Architect"}</p>
                </div>
              </div>

              {/* Body inside Card */}
              <div className="py-6 space-y-4">
                {metaItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-left">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 leading-none mb-1">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-200">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Footer element */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-mono text-[10px] text-neon-pink select-none uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Verified Identity</span>
                </div>
                <Sparkles className="w-4 h-4 text-neon-purple animate-pulse" />
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
            </motion.div>
          </div>

          {/* Right Side: Bio Text Detail & Staggered Stats blocks */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h3 className="text-2xl font-bold font-display text-white tracking-tight flex items-center space-x-2">
              <span>Bridging Aesthetics & Systems</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-base">
              {data.description || "I am a visual engineer with a passion for designing beautiful user interfaces that sync flawlessly with scalable Node backends. Over the last 8 years, I have worked with start-ups and enterprise agencies alike, crafting digital systems that boost retention, visual branding, and system speeds."}
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              My philosophy matches clean structure with dynamic, beautiful execution. I prioritize accessible layouts, modular frontend hierarchies, responsive grids, and strict data layer structures so that any deployment runs securely under load.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-purple/20 transition-all shadow-md">
                <span className="block text-2xl font-black font-display text-neon-purple">100%</span>
                <span className="text-xs text-slate-400 font-mono tracking-wider">Lighthouse Audits</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/20 transition-all shadow-md">
                <span className="block text-2xl font-black font-display text-neon-blue">8k+</span>
                <span className="text-xs text-slate-400 font-mono tracking-wider">GitHub Commits</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-pink/20 transition-all shadow-md">
                <span className="block text-2xl font-black font-display text-neon-pink">24/7</span>
                <span className="text-xs text-slate-400 font-mono tracking-wider">AI Support Ready</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
