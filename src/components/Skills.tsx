import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Code, Server, Wrench, Sparkles, Cpu } from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Set animate state to true to trigger progress bar loading effects
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const frontendSkills = skills.filter((s) => s.category === 'frontend');
  const backendSkills = skills.filter((s) => s.category === 'backend');
  const otherSkills = skills.filter((s) => s.category === 'other');

  const SkillGroup = ({ title, icon, list }: { title: string; icon: React.ReactNode; list: Skill[] }) => (
    <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 shadow-xl relative overflow-hidden h-full">
      <div className="flex items-center space-x-3 mb-2 border-b border-white/10 pb-4">
        <div className="p-2 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-xl font-bold font-display text-white">{title}</h3>
      </div>

      <div className="space-y-5">
        {list.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No skills registered to this group.</p>
        ) : (
          list.map((skill) => (
            <div key={skill.id} className="flex flex-col text-left">
              <div className="flex justify-between items-center mb-1 text-sm font-semibold text-slate-200">
                <span>{skill.name}</span>
                <span className="text-xs font-mono text-neon-blue">{skill.level}%</span>
              </div>
              
              {/* Outer bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                {/* Glowing fill with transition */}
                <div 
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full relative transition-all duration-1500 ease-out"
                  style={{ width: animated ? `${skill.level}%` : '0%' }}
                >
                  <div className="absolute top-0 right-0 h-full w-[10px] bg-white filter blur-[2px] opacity-75"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-24 relative overflow-hidden cyber-grid">
      
      {/* Visual glowing particle */}
      <div className="absolute -top-12 right-12 w-60 h-60 bg-neon-pink/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-neon-purple font-semibold mb-1">
            Engine Specs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-center space-x-2">
            <span>Core</span>
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">Tech Stack</span>
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-neon-pink to-neon-purple mt-3 rounded-full"></div>
        </div>

        {/* 3 Group Bento Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SkillGroup 
              title="Client Frontend" 
              icon={<Code className="w-5 h-5" />} 
              list={frontendSkills} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <SkillGroup 
              title="Database & APIs" 
              icon={<Server className="w-5 h-5" />} 
              list={backendSkills} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SkillGroup 
              title="Creative Design" 
              icon={<Wrench className="w-5 h-5" />} 
              list={otherSkills} 
            />
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 glass-panel border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-4xl mx-auto shadow-md">
          <div className="flex items-center space-x-3 text-left">
            <Cpu className="w-6 h-6 text-neon-blue animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Dynamic Workspace Customizations</h4>
              <p className="text-xs text-slate-400 mt-0.5">Administrate skills inside the active lock gate, or let the companion describe them!</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#312E81]/30 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/15 hover:border-neon-blue/50 transition-all text-center"
          >
            Request custom consult
          </a>
        </div>

      </div>
    </section>
  );
}
