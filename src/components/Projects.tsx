import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, FolderGit, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'app' | 'uiux' | 'backend'>('all');

  const tabs: { id: 'all' | 'web' | 'app' | 'uiux' | 'backend'; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Platform' },
    { id: 'app', label: 'Mobile App' },
    { id: 'uiux', label: 'UI/UX Design' },
    { id: 'backend', label: 'Backend/AI' },
  ];

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter(p => p.category === activeTab);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      
      {/* Decorative Radial glow spots */}
      <div className="absolute top-1/3 left-10 w-96 h-96 radial-glow-1 -z-10 opacity-30"></div>
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] radial-glow-3 -z-10 opacity-40 animate-pulse duration-5000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-neon-pink font-semibold mb-1">
            My Workbench
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-center space-x-2">
            <span>Featured</span>
            <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue bg-clip-text text-transparent">Creations</span>
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-neon-purple to-neon-pink mt-3 rounded-full"></div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs font-mono uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-tr from-neon-purple/20 to-neon-blue/20 border border-neon-blue/50 text-white shadow-[0_0_15px_rgba(0,191,255,0.15)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-30 -z-10"></div>
              )}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={proj.id}
                className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 hover:shadow-3xl transition-all duration-550 flex flex-col h-full relative"
              >
                
                {/* Product Cover Artwork Frame */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 group/img">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <img 
                    src={proj.imageUrl} 
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Aspect Hover Action Overlay overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                    <a
                      href={proj.liveUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-transform duration-200"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold text-white bg-black/60 border border-white/15 backdrop-blur-sm">
                    {proj.category}
                  </div>
                </div>

                {/* Content description details block */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-neon-pink transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Stack Badges Tags layout row */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.tech.map((term, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-neon-blue font-mono hover:border-neon-blue/30 transition-colors"
                        >
                          #{term}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons controls row */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-white/5 mt-6">
                    <a
                      href={proj.liveUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink hover:scale-105 active:scale-95 text-xs text-white uppercase font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(138,43,226,0.15)] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                    
                    <a
                      href={proj.sourceCode || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white uppercase font-bold tracking-wider transition-all cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5 text-[#a855f7]" />
                      <span>Source Code</span>
                    </a>
                  </div>

                </div>

                {/* Neon bottom underline decoration light */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-purple to-neon-blue group-hover:w-full transition-all duration-500"></div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5 max-w-lg mx-auto">
            <FolderGit className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
            <p className="text-slate-400 text-sm mt-3 font-semibold">No finished projects in the laboratory database.</p>
            <p className="text-xs text-slate-500 mt-1">Unlock the top gate to login & add cyberpunk apps dynamically!</p>
          </div>
        )}

      </div>
    </section>
  );
}
