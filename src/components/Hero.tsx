import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Twitter, FileText, Eye, Trophy, Layers, Award, Users, Youtube, X, Briefcase, GraduationCap, MapPin, Mail, Phone, Download, ExternalLink } from 'lucide-react';
import { HeroData, ResumeDetails } from '../types';

const DEFAULT_RESUME_DETAILS: ResumeDetails = {
  fullName: "Sanjeevi",
  subtitle: "Full-Stack Engineer & AI Craftsman",
  location: "Global Remote Office",
  email: "sanjeevi@neon.dev",
  phone: "+1 (555) 792-4211",
  philosophy: "Striving to write code that translates digital utility into pristine typography, elegant fluidity, and resilient server-authoritative logic. Designing with clean visual breathing spaces and absolute performance focus.",
  skills: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Firestore", "Google Cloud", "Animation Eng", "Rest APIs"],
  experienceList: [
    {
      id: "exp1",
      role: "Full-Stack System Engineer",
      company: "Core Interactive Tech Group",
      duration: "2022 - PRESENT",
      description: "Engineered high-fidelity responsive websites, embedded glassmorphism visuals, and orchestrated secure backend API proxy architectures. Constructed automated data loaders and secure Express files/endpoints with seamless Firestore databases."
    },
    {
      id: "exp2",
      role: "Senior UI Specialist & Dev Lead",
      company: "Cyberspace Creative Labs",
      duration: "2019 - 2022",
      description: "Designed interactive layouts combining optimized Canvas systems and high-density bento grids. Integrated multi-format media pipelines and maintained pristine typography hierarchies for major enterprise client apps."
    }
  ],
  educationList: [
    {
      id: "edu1",
      degree: "Master of Computer Systems",
      school: "Advanced Digital Architecture Lab",
      duration: "2019"
    },
    {
      id: "edu2",
      degree: "B.S. in Software Systems & Graphics",
      school: "Department of Computer Science",
      duration: "2017"
    }
  ]
};

interface HeroProps {
  data: HeroData;
  socials: { github: string; linkedin: string; twitter: string; youtube?: string };
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
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeDetails, setResumeDetails] = useState<ResumeDetails>(DEFAULT_RESUME_DETAILS);

  const fetchResumeDetails = async () => {
    try {
      const res = await fetch('/api/resume/details');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.data) {
            setResumeDetails(json.data);
          }
        } else {
          console.warn("Expected JSON but received non-JSON for /api/resume/details");
        }
      }
    } catch (err) {
      console.error("Failed to load structured resume details:", err);
    }
  };

  useEffect(() => {
    fetchResumeDetails();
  }, []);

  // Fetch when modal is opened to get the absolute freshest updates from Admin Panel
  useEffect(() => {
    if (isResumeModalOpen) {
      fetchResumeDetails();
    }
  }, [isResumeModalOpen]);

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

  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const roles = [
      data.subtitle || "Fullstack Developer",
      "Creative Coder",
      "Digital Architect"
    ].filter(Boolean);

    let timer: NodeJS.Timeout;
    const currentRole = roles[loopNum % roles.length];

    const handleType = () => {
      if (!isDeleting) {
        setTypedText(currentRole.substring(0, typedText.length + 1));
        setTypingSpeed(120);

        if (typedText === currentRole) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
          return;
        }
      } else {
        setTypedText(currentRole.substring(0, typedText.length - 1));
        setTypingSpeed(60);

        if (typedText === '') {
          setIsDeleting(false);
          setLoopNum(prev => prev + 1);
          setTypingSpeed(300);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed, data.subtitle]);

  return (
    <>
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
            
            {/* Soft Glowing badge element with active typewriter effect */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 w-fit rounded-full bg-neon-purple/10 border border-neon-purple/20 shadow-inner"
            >
              <div className="h-2 w-2 rounded-full bg-neon-pink animate-ping"></div>
              <span className="text-xs font-mono tracking-wider font-semibold text-neon-pink uppercase flex items-center min-h-[16px]">
                <span>{typedText}</span>
                <span className="ml-[2px] animate-pulse border-r-2 border-neon-pink h-3"></span>
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
              <a 
                href={socials.youtube || "https://youtube.com"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:text-white text-slate-300 transition-all duration-300 shadow-md transform hover:-translate-y-1"
                id="social-youtube-btn"
              >
                <Youtube className="w-5 h-5" />
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
              <button 
                onClick={() => setIsResumeModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#18113c]/90 border border-neon-purple text-white font-semibold text-sm flex items-center space-x-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-neon-purple animate-pulse" />
                <span>View CV Direct</span>
              </button>
              <a 
                href={resumeUrl || "#"} 
                download
                className={btnClasses.secondary}
              >
                <Download className="w-4 h-4 text-neon-pink" />
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

    {/* Dynamic 4D Holographic Interactive Resume Modal */}
    <AnimatePresence>
      {isResumeModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          id="interactive-resume-modal"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#090616]/95 border border-neon-purple/35 shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col p-6 sm:p-8 space-y-6 text-left"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsResumeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Core Header Segment */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-white/5 text-center md:text-left">
              {/* Visual Avatar frame */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-neon-purple/50 shadow-[0_0_20px_rgba(139,92,246,0.25)] flex-shrink-0">
                <img 
                  src={data.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"} 
                  alt="Sanjeevi Portfolio Professional Avatar" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">{resumeDetails.fullName}</h2>
                  <span className="text-[10px] font-mono bg-neon-pink/20 text-neon-pink border border-neon-pink/40 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                    Interactive Developer
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium font-mono">{resumeDetails.subtitle}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neon-blue" />
                    {resumeDetails.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neon-purple" />
                    {resumeDetails.email}
                  </span>
                  {resumeDetails.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-neon-pink" />
                        {resumeDetails.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                <a 
                  href="/api/resume/view" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 md:flex-none px-4 py-2.5 text-xs font-mono uppercase font-bold text-center bg-[#8b5cf6] text-white hover:bg-[#8b5cf6]/90 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-neon-purple/20 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Raw PDF</span>
                </a>
                <a 
                  href={resumeUrl} 
                  download
                  className="flex-1 md:flex-none px-4 py-2.5 text-xs font-mono uppercase font-bold text-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>

            {/* Grid content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
              {/* Left Side: Experience & Education */}
              <div className="md:col-span-3 space-y-6">
                {/* Experience Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-neon-blue uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Briefcase className="w-4 h-4 text-neon-pink" />
                    <span>Professional Experience Timeline</span>
                  </h3>

                  <div className="space-y-5 relative pl-4 border-l border-white/5">
                    {resumeDetails.experienceList && resumeDetails.experienceList.map((exp, index) => (
                      <div key={exp.id || index} className="relative space-y-1">
                        <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-neon-pink shadow-[0_0_8px_#ec4899]' : 'bg-neon-purple'}`}></div>
                        <div className="flex justify-between items-start flex-wrap gap-1">
                          <h4 className="text-sm font-bold text-white font-sans">{exp.role}</h4>
                          <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400">{exp.duration}</span>
                        </div>
                        <p className="text-xs text-neon-purple font-mono">{exp.company}</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-neon-blue uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <GraduationCap className="w-4 h-4 text-neon-purple" />
                    <span>Education & Certification</span>
                  </h3>

                  <div className="space-y-3">
                    {resumeDetails.educationList && resumeDetails.educationList.map((edu, index) => (
                      <div key={edu.id || index} className="space-y-0.5">
                        <div className="flex justify-between items-center text-xs font-bold text-white font-mono">
                          <span>{edu.degree}</span>
                          <span className="text-slate-400 font-normal">{edu.duration}</span>
                        </div>
                        <p className="text-xs text-slate-400">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Skills, Competencies & Attributes */}
              <div className="md:col-span-2 space-y-6">
                {/* Skills Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-neon-pink uppercase border-b border-white/5 pb-2">
                    Core Framework Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeDetails.skills && resumeDetails.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-white/5 border border-white/10 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* System Core Strength */}
                <div className="p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20 space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-neon-blue font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Interactive Engineering Philosophy</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    "{resumeDetails.philosophy}"
                  </p>
                </div>

                {/* Quick Profile Snapshot */}
                <div className="p-4 rounded-xl bg-neon-pink/5 border border-neon-pink/20 space-y-2 font-mono text-[11px]">
                  <h4 className="text-neon-pink font-bold uppercase">Profile Status Summary</h4>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className="text-emerald-400 font-bold">ACTIVE FOR HIRE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Role:</span>
                      <span>{resumeDetails.subtitle?.split('&')[0]?.trim() || "Lead Developer"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Rating:</span>
                      <span className="text-amber-400">5.0 ★ Star Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
