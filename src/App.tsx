import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import { Project, Skill, Service, HeroData, AboutData, Settings } from './types';
import { Loader2, Terminal, Lock, ChevronUp, Palette, Settings2, RotateCcw, Sparkles, X, Check } from 'lucide-react';

const themePresets = {
  purple: {
    name: "Classic Neon",
    purple: '#9333ea', // Vibrant Purple (purple-600)
    blue: '#3b82f6',   // Vibrant Blue (blue-500)
    pink: '#ec4899',   // Vibrant Pink (pink-500)
  },
  blue: {
    name: "Cyber Indigo",
    purple: '#6366f1', // Vibrant Indigo
    blue: '#06b6d4',   // Vibrant Cyan
    pink: '#14b8a6',   // Vibrant Teal
  },
  pink: {
    name: "Sunset Synth",
    purple: '#db2777', // Vibrant Magenta
    blue: '#f43f5e',   // Vibrant Rose
    pink: '#f97316',   // Vibrant Orange
  },
  emerald: {
    name: "Bio Emerald",
    purple: '#10b981', // Emerald Green
    blue: '#0ea5e9',   // Sky Blue
    pink: '#84cc16',   // Lime Green
  },
  sunset: {
    name: "Solar Flare",
    purple: '#ea580c', // Bright Orange
    blue: '#eab308',   // Bright Amber/Yellow
    pink: '#f43f5e',   // Bright Rose/Pink
  },
  cyberpunk: {
    name: "Neon Tokyo",
    purple: '#ec4899', // Hot Pink
    blue: '#06b6d4',   // Cyan
    pink: '#eab308',   // Yellow
  },
  mono: {
    name: "Cyber Slate",
    purple: '#475569', // Dark Slate
    blue: '#94a3b8',   // Slate
    pink: '#cbd5e1',   // Light Slate
  }
};

export default function App() {
  const [activeTheme, setActiveTheme] = useState<string>('purple');
  const [customColors, setCustomColors] = useState({
    purple: '#9333ea',
    blue: '#3b82f6',
    pink: '#ec4899',
  });
  const [artShape, setArtShape] = useState<string>('circle');
  const [buttonStyle, setButtonStyle] = useState<string>('glow');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('neon_admin_token'));
  const [loading, setLoading] = useState(true);

  // Core dynamic portfolios models
  const [portfolio, setPortfolio] = useState<{
    settings: Settings;
    hero: HeroData;
    about: AboutData;
    skills: Skill[];
    services: Service[];
    projects: Project[];
  }>({
    settings: {
      websiteTitle: "NEON Portfolio & Lab",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      resumeUrl: "#",
      chatbotEnabled: true,
      quickReplies: ["Web Development", "UI/UX Design", "Mobile Apps", "Pricing Plans", "Contact Me"]
    },
    hero: {
      title: "CREATING FUTURISTIC DIGITAL EXPERIENCE",
      subtitle: "Interactive Fullstack Developer",
      name: "Thennarasi",
      introParagraph: "I design and code pixel-perfect, highly immersive web applications. Specializing in React, Node, and advanced glassmorphism components with clean typography and motion.",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      experienceYears: 8,
      projectsCompleted: 42,
      clientsWorked: 19,
      awardsWon: 5
    },
    about: {
      description: "I'm a digital architect with a passion for designing visual interfaces that bridge high aesthetics and scalable backends. Over the last 8 years, I've developed interactive installations, e-commerce solutions, and custom AI tools.",
      name: "Thennarasi",
      email: "thennarasi@neon.dev",
      phone: "+1 (555) 792-4211",
      location: "San Francisco, CA",
      experienceYearText: "8+ Years Experience",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    },
    skills: [],
    services: [],
    projects: []
  });

  // Fetch all portfolio parameters from server API on launch
  const loadPortfolioData = async () => {
    try {
      const response = await fetch(`/api/portfolio?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      if (data && !data.error) {
        setPortfolio(data);
        if (data.settings?.themePreset) {
          setActiveTheme(data.settings.themePreset);
        }
        if (data.settings?.artShape) {
          setArtShape(data.settings.artShape);
        }
        if (data.settings?.buttonStyle) {
          setButtonStyle(data.settings.buttonStyle);
        }
        if (data.settings?.customPurple || data.settings?.customBlue || data.settings?.customPink) {
          setCustomColors({
            purple: data.settings.customPurple || '#9333ea',
            blue: data.settings.customBlue || '#3b82f6',
            pink: data.settings.customPink || '#ec4899',
          });
        }
      }
    } catch (err) {
      console.warn("Could not sync Firestore parameters, using premium seeding values.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Sync custom theme highlights
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme === 'custom') {
      root.style.setProperty('--color-neon-purple', customColors.purple);
      root.style.setProperty('--color-neon-blue', customColors.blue);
      root.style.setProperty('--color-neon-pink', customColors.pink);
    } else {
      const vars = themePresets[activeTheme as keyof typeof themePresets];
      if (vars) {
        root.style.setProperty('--color-neon-purple', vars.purple);
        root.style.setProperty('--color-neon-blue', vars.blue);
        root.style.setProperty('--color-neon-pink', vars.pink);
      }
    }
  }, [activeTheme, customColors]);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('neon_admin_token', token);
    setAdminToken(token);
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('neon_admin_token');
    setAdminToken(null);
    setIsAdminOpen(false);
  };

  const handleThemeToggle = () => {
    const keys: Array<keyof typeof themePresets> = ['purple', 'blue', 'pink', 'emerald', 'sunset', 'cyberpunk', 'mono'];
    const currentIdx = keys.indexOf(activeTheme as any);
    const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % keys.length;
    setActiveTheme(keys[nextIdx]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06030c] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
          <div className="absolute inset-0 bg-neon-purple/20 blur rounded-full"></div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono tracking-widest text-[#a855f7] uppercase animate-pulse">Syncing Lab Node...</span>
          <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">ESTABLISHING FIREBASE HANDSHAKE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden selection:bg-neon-pink selection:text-white">
      
      {/* Decorative background grids & active colors */}
      <div className="absolute inset-0 cyber-grid opacity-35 -z-10 bg-repeat pointer-events-none"></div>
      
      {/* Vibrant Palette Ambient Radial Glow Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-[110px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-100px] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[90px] -z-10 pointer-events-none"></div>

      {/* Top Navbar */}
      <Navbar 
        websiteTitle={portfolio.settings.websiteTitle || "NEON.DEV"} 
        logoText={portfolio.settings.logoText}
        logoType={portfolio.settings.logoType}
        logoImageUrl={portfolio.settings.logoImageUrl}
        logoIconName={portfolio.settings.logoIconName}
        onAdminClick={() => setIsAdminOpen(true)}
        isAdmin={adminToken !== null}
        onLogout={handleLogout}
        activeTheme={activeTheme}
        onThemeToggle={handleThemeToggle}
      />

      {/* Hero Intro */}
      <Hero 
        data={portfolio.hero} 
        socials={{
          github: portfolio.settings.githubUrl,
          linkedin: portfolio.settings.linkedinUrl,
          twitter: portfolio.settings.twitterUrl
        }}
        resumeUrl={portfolio.settings.resumeUrl}
        artShape={artShape}
        buttonStyle={buttonStyle}
        bannerBgType={portfolio.settings.bannerBgType}
        bannerBgImageUrl={portfolio.settings.bannerBgImageUrl}
        bannerGlow1={portfolio.settings.bannerGlow1}
        bannerGlow2={portfolio.settings.bannerGlow2}
        bannerShowGrid={portfolio.settings.bannerShowGrid}
      />

      {/* About Identity */}
      <About data={portfolio.about} />

      {/* Core Technical matrices */}
      <Skills skills={portfolio.skills} />

      {/* Creations Workbench */}
      <Projects projects={portfolio.projects} />

      {/* services module catalog */}
      <Services services={portfolio.services} />

      {/* secure customer transmission portal */}
      <Contact aboutData={portfolio.about} />

      {/* Footer controls & locks */}
      <footer className="py-12 border-t border-white/5 bg-[#050309] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-pink p-[1px]">
              <div className="w-full h-full rounded-[7px] bg-[#0c0817] flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-neon-pink animate-pulse" />
              </div>
            </div>
            <span className="text-sm font-bold font-display tracking-widest text-[#d8b4fe]">
              {portfolio.settings.websiteTitle || 'NEON.DEV'}
            </span>
          </div>

          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-wider text-center">
            Designed in Interactive Lab. © 2026. All Systems operating.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all text-xs font-semibold cursor-pointer py-1.5 flex items-center space-x-1"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>TOP</span>
            </button>
            
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all text-[11px] font-mono flex items-center space-x-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#f472b6]" />
              <span>GATEWAY</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating chatbot assistant */}
      <Chatbot 
        quickReplies={portfolio.settings.quickReplies} 
        enabled={portfolio.settings.chatbotEnabled !== false} 
      />

      {/* Immersive Administration portal panel */}
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)}
          token={adminToken}
          onLoginSuccess={handleLoginSuccess}
          portfolioData={portfolio}
          onRefreshData={loadPortfolioData}
        />
      )}

    </div>
  );
}
