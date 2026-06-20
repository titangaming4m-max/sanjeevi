import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, FileText, Eye, Trophy, Layers, Award, Users } from 'lucide-react';
import { HeroData } from '../types';

interface HeroProps {
  data: HeroData;
  socials: { github: string; linkedin: string; twitter: string };
  resumeUrl: string;
  artShape?: string;
  buttonStyle?: string;
  bannerBgType?: 'glow' | 'image';
  bannerBgImageUrl?: string;
  bannerGlow1?: string;
  bannerGlow2?: string;
  bannerShowGrid?: boolean;
}

export default function Hero({ 
  data, 
  socials, 
  resumeUrl, 
  artShape = 'circle', 
  buttonStyle = 'glow',
  bannerBgType = 'glow',
  bannerBgImageUrl,
  bannerGlow1,
  bannerGlow2,
  bannerShowGrid = true
}: HeroProps) {
  const getArtShapeClassAndStyle = (shape: string) => {
    switch (shape) {
      case 'hexagon':
        return {
          containerClass: '',
          innerClass: '',
          style: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }
        };
      case 'octagon':
        return {
          containerClass: '',
          innerClass: '',
          style: { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }
        };
      case 'diamond':
        return {
          containerClass: '',
          innerClass: '',
          style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }
        };
      case 'circle':
      default:
        return {
          containerClass: 'rounded-full',
          innerClass: 'rounded-full',
          style: {}
        };
    }
  };

  const getButtonClasses = (style: string) => {
    switch (style) {
      case 'sharp':
        return {
          primary: 'flex items-center space-x-2 px-6 py-3 bg-[#9333ea] border-2 border-[#3b82f6] text-sm font-mono uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#ec4899] hover:bg-[#3b82f6] hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-300',
          secondary: 'flex items-center space-x-2 px-6 py-3 border-2 border-white/40 bg-black text-sm font-mono uppercase tracking-widest text-slate-300 hover:border-neon-pink hover:text-white transition-all duration-300'
        };
      case 'cyber-pill':
        return {
          primary: 'flex items-center space-x-2 px-7 py-3 rounded-full bg-transparent border-2 border-white/80 text-sm font-bold tracking-wider text-white shadow-lg hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover:scale-105 active:scale-95',
          secondary: 'flex items-center space-x-2 px-7 py-3 rounded-full bg-transparent border-2 border-white/15 text-sm font-bold tracking-wider text-slate-300 hover:border-neon-blue hover:text-white transition-all duration-300'
        };
      case 'glitch':
        return {
          primary: 'flex items-center space-x-2 px-6 py-3 rounded-md bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-blue hover:to-neon-pink text-sm font-semibold skew-x-[-10deg] tracking-wide text-white shadow-md transition-all duration-300 hover:scale-103 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95',
          secondary: 'flex items-center space-x-2 px-6 py-3 rounded-md border border-neon-blue bg-neon-blue/5 hover:bg-neon-blue text-sm font-semibold skew-x-[-10deg] tracking-wide text-neon-blue hover:text-slate-950 transition-all duration-300'
        };
      case 'glow':
      default:
        return {
          primary: 'flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-sm font-semibold tracking-wider text-white shadow-[0_0_20px_rgba(138,43,226,0.25)] hover:shadow-[0_0_30px_rgba(138,43,226,0.45)] hover:scale-105 active:scale-95 transition-all duration-300',
          secondary: 'flex items-center space-x-2 px-6 py-3 rounded-xl border border-white/10 bg-[#0C0817]/40 text-sm font-semibold tracking-wider text-slate-200 hover:text-white hover:border-neon-pink/50 hover:bg-white/5 transition-all duration-300'
        };
    }
  };

  const shapeConfig = getArtShapeClassAndStyle(artShape);
  const btnClasses = getButtonClasses(buttonStyle);
  return (
    <section 
      id="home" 
      className={`relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden ${bannerShowGrid ? 'cyber-grid' : ''}`}
      style={bannerBgType === 'image' && bannerBgImageUrl ? {
        backgroundImage: `radial-gradient(ellipse at center, rgba(12, 8, 23, 0.7) 0%, rgba(6, 3, 12, 0.95) 100%), url(${bannerBgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      
      {/* Background Decorative Radial Blurs */}
      <div 
        className="absolute top-1/4 left-10 w-96 h-96 rounded-full -z-10 animate-pulse duration-10000 blur-[110px]" 
        style={{ 
          backgroundColor: bannerGlow1 || 'rgba(147, 51, 234, 0.15)',
        }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full -z-10 animate-pulse duration-7000 blur-[110px]" 
        style={{ 
          backgroundColor: bannerGlow2 || 'rgba(59, 130, 246, 0.15)',
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Detail Grid */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            
            {/* Soft Glowing badge element */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 w-fit rounded-full bg-neon-purple/10 border border-neon-purple/20 shadow-inner"
            >
              <div className="h-2 w-2 rounded-full bg-neon-pink animate-ping"></div>
              <span className="text-xs font-mono tracking-wider font-semibold text-neon-pink uppercase">
                {data.subtitle || "Developer & Architect"}
              </span>
            </motion.div>

            {/* Glowing Big Hero Display Title */}
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-none text-white"
            >
              Hi, I am <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue bg-clip-text text-transparent neon-glow-text-purple">{data.name}</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-slate-300 mt-2 block">
                {data.title || "CREATING FUTURISTIC DIGITAL EXPERIENCE"}
              </span>
            </motion.h1>

            {/* Introduction Paragraph */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed"
            >
              {data.introParagraph || "I design and code pixel-perfect, highly immersive web applications. Specializing in React, Node, and advanced glassmorphism 3D components."}
            </motion.p>

            {/* Social Links Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4 pt-2"
            >
              <a 
                href={socials.github || "https://github.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-neon-purple/10 hover:border-neon-purple/40 hover:text-white text-slate-300 transition-all duration-300 shadow-md transform hover:-translate-y-1"
                id="social-github-btn"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={socials.linkedin || "https://linkedin.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-neon-blue/10 hover:border-neon-blue/40 hover:text-white text-slate-300 transition-all duration-300 shadow-md transform hover:-translate-y-1"
                id="social-linkedin-btn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={socials.twitter || "https://twitter.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-neon-pink/10 hover:border-neon-pink/40 hover:text-white text-slate-300 transition-all duration-300 shadow-md transform hover:-translate-y-1"
                id="social-twitter-btn"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Primary Action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a 
                href="#projects" 
                className={btnClasses.primary}
              >
                <Eye className="w-4 h-4" />
                <span>View Work</span>
              </a>
              <a 
                href={resumeUrl || "#"} 
                download
                className={btnClasses.secondary}
              >
                <FileText className="w-4 h-4 text-neon-pink" />
                <span>Download CV</span>
              </a>
            </motion.div>

          </div>

          {/* Right Profile Circle Ring + Stats Module */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing neon background circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-neon-purple/20 blur-sm animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-neon-pink/20 animate-spin duration-10000"></div>

            {/* Glowing animated visual frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              className={`relative w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-blue p-[3px] shadow-[0_0_40px_rgba(138,43,226,0.3)] animate-glow ${shapeConfig.containerClass}`}
              style={shapeConfig.style}
            >
              <div 
                className={`w-full h-full overflow-hidden bg-[#0c0817] ${shapeConfig.innerClass}`}
                style={shapeConfig.style}
              >
                <img 
                  src={data.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"} 
                  alt={data.name || "Alex"} 
                  className="w-full h-full object-cover grayscale-[30%] hover:scale-110 hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Glowing floating experience badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-6 sm:bottom-0 left-4 glass-panel border border-white/10 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:border-neon-pink/40 transition-colors"
            >
              <div className="p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-neon-pink">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white font-display leading-none">{data.experienceYears}+ Years</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Experience</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -top-6 right-4 glass-panel border border-white/10 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:border-neon-blue/40 transition-colors"
            >
              <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white font-display leading-none">{data.projectsCompleted}+ Done</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Projects</span>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Dynamic Bento Stats Card Row placed horizontally in footer */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-24 w-full p-6 sm:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative"
        >
          {/* Border lights */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-80"></div>
          
          <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-0 md:last:border-r-0 max-md:border-b max-md:even:border-r-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">{data.experienceYears}+</span>
              <Award className="w-4 h-4 text-neon-purple" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">Yrs Experience</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 max-md:border-b last:border-0 max-md:even:border-r-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">{data.projectsCompleted}+</span>
              <Layers className="w-4 h-4 text-neon-blue" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">Projects Build</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 last:border-0 max-md:border-r-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">{data.clientsWorked}+</span>
              <Users className="w-4 h-4 text-neon-pink" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">Global Clients</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 last:border-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">{data.awardsWon}+</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mt-1">Honorable Awards</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
