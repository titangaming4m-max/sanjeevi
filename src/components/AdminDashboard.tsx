import React, { useState, useEffect } from 'react';
import { 
  Lock, KeyRound, Save, Plus, Trash2, Check, RefreshCw, X, MessageSquare, 
  Layers, Hammer, Cpu, Settings as SettingsIcon, AlertCircle, Sparkles, Terminal, Mail, MessageSquareText, RotateCcw, Loader2,
  BarChart3, Upload, Download, FileText, Eye, Server, Activity, Volume2, VolumeX,
  LayoutDashboard, User, Briefcase, Bell, Search, Moon, Sun, Folder, ChevronDown, ExternalLink, Edit
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Project, Skill, Service, Message, HeroData, AboutData, Settings, ResumeDetails, WorkExperience, EducationEntry } from '../types';

export const CYBER_ACCENT_PRESETS: {
  id: string;
  name: string;
  codename: string;
  color: string;
  waveform: 'sine' | 'triangle' | 'square' | 'sawtooth';
  frequency: number;
  speed: number;
  angle: number;
  shape: 'sparkle' | 'diamond' | 'circle' | 'hexagon';
  particlesCount: number;
  borderPreset: 'glass' | 'solid-glowing' | 'double-neon' | 'neon-laser';
  hum: boolean;
  chromaticOffset: number;
  scanlineOpacity: number;
  description: string;
}[] = [
  {
    id: 'aegis',
    name: 'Aegis Overdrive',
    codename: 'AEGIS-01X',
    color: '#ef4444',
    waveform: 'square',
    frequency: 180,
    speed: 28,
    angle: 35,
    shape: 'hexagon',
    particlesCount: 40,
    borderPreset: 'neon-laser',
    hum: true,
    chromaticOffset: 12,
    scanlineOpacity: 0.25,
    description: 'High-threat reactive sentinel matrix. Maximized kinetic response and heavy audio dispersion.'
  },
  {
    id: 'oracle',
    name: 'Quantum Oracle',
    codename: 'ORACLE-Q7',
    color: '#06b6d4',
    waveform: 'sine',
    frequency: 640,
    speed: 10,
    angle: 12,
    shape: 'sparkle',
    particlesCount: 30,
    borderPreset: 'double-neon',
    hum: false,
    chromaticOffset: 2,
    scanlineOpacity: 0.08,
    description: 'Deep-space forecasting cluster. Clean electromagnetic signatures and micro-resonation.'
  },
  {
    id: 'vapor',
    name: 'Vaporwave Sunset',
    codename: 'VAPOR-84',
    color: '#ec4899',
    waveform: 'triangle',
    frequency: 330,
    speed: 15,
    angle: 25,
    shape: 'diamond',
    particlesCount: 25,
    borderPreset: 'solid-glowing',
    hum: false,
    chromaticOffset: 6,
    scanlineOpacity: 0.18,
    description: 'Classic aesthetic telemetry block. Retrowave signal emulation tuned to sunset harmonics.'
  },
  {
    id: 'toxoid',
    name: 'Toxoid Reactor',
    codename: 'TOX-99',
    color: '#84cc16',
    waveform: 'sawtooth',
    frequency: 290,
    speed: 22,
    angle: 40,
    shape: 'hexagon',
    particlesCount: 35,
    borderPreset: 'neon-laser',
    hum: true,
    chromaticOffset: 9,
    scanlineOpacity: 0.22,
    description: 'Unshielded core power generator. Toxic signal dispersion and intense electromagnetic turbulence.'
  },
  {
    id: 'hazard',
    name: 'Hazard Core',
    codename: 'HAZ-WARN',
    color: '#eab308',
    waveform: 'square',
    frequency: 520,
    speed: 26,
    angle: 30,
    shape: 'diamond',
    particlesCount: 45,
    borderPreset: 'solid-glowing',
    hum: true,
    chromaticOffset: 10,
    scanlineOpacity: 0.28,
    description: 'Critical containment warning module. Maximized visual alerts and high-intensity sound pressure.'
  },
  {
    id: 'matrix',
    name: 'Hacker Matrix',
    codename: 'GIBSON-88',
    color: '#10b981',
    waveform: 'sawtooth',
    frequency: 440,
    speed: 18,
    angle: 15,
    shape: 'circle',
    particlesCount: 20,
    borderPreset: 'glass',
    hum: false,
    chromaticOffset: 4,
    scanlineOpacity: 0.15,
    description: 'Underground data run console. Pure binary waterfall simulation and low latency response.'
  },
  {
    id: 'laser',
    name: 'Laser Grid Blue',
    codename: 'TRON-GRID',
    color: '#3b82f6',
    waveform: 'sine',
    frequency: 880,
    speed: 14,
    angle: 20,
    shape: 'sparkle',
    particlesCount: 15,
    borderPreset: 'double-neon',
    hum: false,
    chromaticOffset: 3,
    scanlineOpacity: 0.10,
    description: 'Primary vector grid network. Coherent light beam emitter with minimal refractive noise.'
  },
  {
    id: 'sol',
    name: 'Sol Flare',
    codename: 'HELIOS-9',
    color: '#ea580c',
    waveform: 'triangle',
    frequency: 220,
    speed: 20,
    angle: 28,
    shape: 'circle',
    particlesCount: 38,
    borderPreset: 'neon-laser',
    hum: true,
    chromaticOffset: 8,
    scanlineOpacity: 0.20,
    description: 'Sunburst plasma radiator. Heavy particle dispersion and warm acoustic sub-harmonic hum.'
  },
  {
    id: 'plasma',
    name: 'Plasma Violet',
    codename: 'PLASMA-VX',
    color: '#a855f7',
    waveform: 'sine',
    frequency: 720,
    speed: 12,
    angle: 18,
    shape: 'sparkle',
    particlesCount: 28,
    borderPreset: 'solid-glowing',
    hum: false,
    chromaticOffset: 5,
    scanlineOpacity: 0.12,
    description: 'Ionized plasma collector. Visually deep fuchsia neon fields with highly-stable frequency lines.'
  },
  {
    id: 'orchid',
    name: 'Bio-Orchid',
    codename: 'NEURAL-BIO',
    color: '#d946ef',
    waveform: 'triangle',
    frequency: 370,
    speed: 16,
    angle: 22,
    shape: 'circle',
    particlesCount: 22,
    borderPreset: 'glass',
    hum: false,
    chromaticOffset: 4,
    scanlineOpacity: 0.07,
    description: 'Cyber-organic bio-neural node. Mild organic harmonics paired with low scanline interference.'
  },
  {
    id: 'void',
    name: 'Singularity Void',
    codename: 'VOID-00',
    color: '#6366f1',
    waveform: 'sawtooth',
    frequency: 110,
    speed: 6,
    angle: 45,
    shape: 'diamond',
    particlesCount: 12,
    borderPreset: 'glass',
    hum: true,
    chromaticOffset: 11,
    scanlineOpacity: 0.27,
    description: 'Event horizon gravity well. Space-time compression grid with extreme skewing and sub-hertz hum.'
  },
  {
    id: 'gold',
    name: 'Gold Protocol',
    codename: 'MIDAS-IV',
    color: '#d97706',
    waveform: 'sine',
    frequency: 580,
    speed: 13,
    angle: 10,
    shape: 'diamond',
    particlesCount: 32,
    borderPreset: 'solid-glowing',
    hum: false,
    chromaticOffset: 3,
    scanlineOpacity: 0.05,
    description: 'Secure high-tier currency grid. Low scanline noise, luxurious gold styling, and balanced acoustics.'
  },
  {
    id: 'sky',
    name: 'Neuromancer Sky',
    codename: 'NEURO-SKY',
    color: '#0ea5e9',
    waveform: 'triangle',
    frequency: 490,
    speed: 17,
    angle: 24,
    shape: 'sparkle',
    particlesCount: 26,
    borderPreset: 'double-neon',
    hum: false,
    chromaticOffset: 5,
    scanlineOpacity: 0.11,
    description: 'Chiba harbor static sky. Emulating a television tuned to a dead channel in deep sky blue.'
  },
  {
    id: 'corrupt',
    name: 'Glitch Corrupt',
    codename: 'SYS-CORRUPT',
    color: '#dc2626',
    waveform: 'square',
    frequency: 150,
    speed: 30,
    angle: 45,
    shape: 'hexagon',
    particlesCount: 44,
    borderPreset: 'neon-laser',
    hum: true,
    chromaticOffset: 15,
    scanlineOpacity: 0.35,
    description: 'Unstable corrupted core interface. Maximized chromatic split and scanline overload.'
  },
  {
    id: 'uranium',
    name: 'Uranium Decay',
    codename: 'U-235',
    color: '#22c55e',
    waveform: 'sawtooth',
    frequency: 260,
    speed: 21,
    angle: 35,
    shape: 'hexagon',
    particlesCount: 34,
    borderPreset: 'solid-glowing',
    hum: true,
    chromaticOffset: 7,
    scanlineOpacity: 0.24,
    description: 'Active radioactive containment vault. Decaying frequency harmonics with heavy green emitters.'
  },
  {
    id: 'chiptune',
    name: 'Chiptune Horizon',
    codename: 'NES-8BIT',
    color: '#f43f5e',
    waveform: 'square',
    frequency: 980,
    speed: 19,
    angle: 20,
    shape: 'diamond',
    particlesCount: 18,
    borderPreset: 'double-neon',
    hum: false,
    chromaticOffset: 4,
    scanlineOpacity: 0.16,
    description: 'Retro-arcade simulator card. Standard square wave tone paired with classic chiptune diagnostics.'
  },
  {
    id: 'abyss',
    name: 'Abyssal Depths',
    codename: 'ABYSS-0',
    color: '#4f46e5',
    waveform: 'sine',
    frequency: 120,
    speed: 8,
    angle: 40,
    shape: 'circle',
    particlesCount: 14,
    borderPreset: 'glass',
    hum: true,
    chromaticOffset: 8,
    scanlineOpacity: 0.23,
    description: 'Sub-oceanic communication cable terminal. Deep water pressure harmonics and slow drift rate.'
  },
  {
    id: 'ghost',
    name: 'Ghost Shell',
    codename: 'GHOST-7',
    color: '#a1a1aa',
    waveform: 'sine',
    frequency: 1100,
    speed: 11,
    angle: 14,
    shape: 'sparkle',
    particlesCount: 10,
    borderPreset: 'glass',
    hum: false,
    chromaticOffset: 1,
    scanlineOpacity: 0.04,
    description: 'Ethereal neural construct bypass. Spectrally transparent layouts and near-silent frequency sweeps.'
  },
  {
    id: 'vortex',
    name: 'Vortex Overload',
    codename: 'VTX-CHAMBER',
    color: '#7c3aed',
    waveform: 'sawtooth',
    frequency: 310,
    speed: 25,
    angle: 38,
    shape: 'hexagon',
    particlesCount: 36,
    borderPreset: 'neon-laser',
    hum: true,
    chromaticOffset: 10,
    scanlineOpacity: 0.20,
    description: 'Gravity compression chamber. Extremely high speed grid distortion with heavy sub-volt buzz.'
  },
  {
    id: 'frost',
    name: 'Quantum Frost',
    codename: 'FROST-88',
    color: '#38bdf8',
    waveform: 'triangle',
    frequency: 540,
    speed: 12,
    angle: 16,
    shape: 'diamond',
    particlesCount: 24,
    borderPreset: 'solid-glowing',
    hum: false,
    chromaticOffset: 3,
    scanlineOpacity: 0.09,
    description: 'Superconductive quantum frost array. Crisp sky-blue aesthetics with ultra-stable thermal noise.'
  }
];

interface AdminDashboardProps {
  onClose: () => void;
  token: string | null;
  onLoginSuccess: (token: string) => void;
  portfolioData: {
    settings: Settings;
    hero: HeroData;
    about: AboutData;
    skills: Skill[];
    services: Service[];
    projects: Project[];
  };
  onRefreshData: () => void;
}

export default function AdminDashboard({
  onClose,
  token,
  onLoginSuccess,
  portfolioData,
  onRefreshData
}: AdminDashboardProps) {

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'google-analytics' | 'hero-about' | 'projects' | 'skills-services' | 'messages' | 'chatbot' | 'settings' | 'resume' | 'design-fx'>('overview');

  // Resume details editing states
  const [resumeForm, setResumeForm] = useState<ResumeDetails>({
    fullName: '',
    subtitle: '',
    location: '',
    email: '',
    phone: '',
    philosophy: '',
    skills: [],
    experienceList: [],
    educationList: []
  });
  const [resumeSkillsText, setResumeSkillsText] = useState('');
  const [loadingResumeDetails, setLoadingResumeDetails] = useState(false);
  const [savingResumeDetails, setSavingResumeDetails] = useState(false);

  // Mutation Save states
  const [savingState, setSavingState] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmDeleteSkillId, setConfirmDeleteSkillId] = useState<string | null>(null);
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editLogForm, setEditLogForm] = useState({ message: '', reply: '' });
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);

  // Admin Theme state (Dark vs Lite mode)
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin-theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  const toggleAdminTheme = () => {
    const nextTheme = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(nextTheme);
    localStorage.setItem('admin-theme', nextTheme);
  };

  // Design & FX States
  const [gridEnabled, setGridEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-grid-enabled');
      return v === null ? true : v === 'true';
    }
    return true;
  });
  const [gridColor, setGridColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fx-grid-color') || '#4f46e5';
    }
    return '#4f46e5';
  });
  const [gridSpeed, setGridSpeed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-grid-speed');
      return v ? parseInt(v) : 15;
    }
    return 15;
  });
  const [gridAngle, setGridAngle] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-grid-angle');
      return v ? parseInt(v) : 15;
    }
    return 15;
  });
  const [scanlineEnabled, setScanlineEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-scanline-enabled');
      return v === null ? true : v === 'true';
    }
    return true;
  });
  const [scanlineSpeed, setScanlineSpeed] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-scanline-speed');
      return v ? parseInt(v) : 6;
    }
    return 6;
  });
  const [scanlineOpacity, setScanlineOpacity] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-scanline-opacity');
      return v ? parseFloat(v) : 0.12;
    }
    return 0.12;
  });
  const [glowIntensity, setGlowIntensity] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-glow-intensity');
      return v ? parseInt(v) : 80;
    }
    return 80;
  });
  const [glowPulse, setGlowPulse] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-glow-pulse');
      return v === null ? true : v === 'true';
    }
    return true;
  });
  const [particlesCount, setParticlesCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-particles-count');
      return v ? parseInt(v) : 20;
    }
    return 20;
  });
  const [particleShape, setParticleShape] = useState<'sparkle' | 'diamond' | 'circle' | 'hexagon'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fx-particle-shape') as any) || 'sparkle';
    }
    return 'sparkle';
  });
  const [cardBorderPreset, setCardBorderPreset] = useState<'glass' | 'solid-glowing' | 'double-neon' | 'neon-laser'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fx-card-border') as any) || 'neon-laser';
    }
    return 'neon-laser';
  });

  // UI Sound & Synth States
  const [fxSoundEnabled, setFxSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-sound-enabled');
      return v === null ? true : v === 'true';
    }
    return true;
  });
  const [fxSynthVolume, setFxSynthVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-synth-volume');
      return v ? parseFloat(v) : 0.15;
    }
    return 0.15;
  });
  const [fxSynthWaveform, setFxSynthWaveform] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fx-synth-waveform') as any) || 'sine';
    }
    return 'sine';
  });
  const [fxSynthFrequency, setFxSynthFrequency] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-synth-frequency');
      return v ? parseInt(v) : 440;
    }
    return 440;
  });
  const [fxAmbientHumEnabled, setFxAmbientHumEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-ambient-hum-enabled');
      return v === 'true';
    }
    return false;
  });

  // Glitch Effect States
  const [fxGlitchIntensity, setFxGlitchIntensity] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-glitch-intensity');
      return v ? parseInt(v) : 30;
    }
    return 30;
  });
  const [fxChromaticOffset, setFxChromaticOffset] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('fx-chromatic-offset');
      return v ? parseInt(v) : 4;
    }
    return 4;
  });
  const [fxGlitchActive, setFxGlitchActive] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fx-active-preset-id') || null;
    }
    return null;
  });

  // Terminal Console Simulator States
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLog, setTerminalLog] = useState<{ text: string; type: 'system' | 'input' | 'success' | 'error' | 'ambient' }[]>([
    { text: 'SYSTEM: NEURAL CYBERNETIC COGNITIVE SHELL STAGE 01 INITIALIZED.', type: 'system' },
    { text: 'CONSOLE: ACTIVE DIRECT ACCESS GRANTED. ENTER "help" FOR NODE COMMANDS.', type: 'ambient' },
    { text: 'COGNITIVE CORE: ONLINE & STANDBY.', type: 'success' }
  ]);

  // Audio Player Engine for Synth Sound FX
  const playBeep = (beepType: 'click' | 'hover' | 'success' | 'fail' | 'glitch') => {
    if (!fxSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = fxSynthWaveform;
      
      let dur = 0.1;
      let startFreq = fxSynthFrequency;
      let endFreq = fxSynthFrequency;
      let vol = fxSynthVolume;

      if (beepType === 'hover') {
        dur = 0.05;
        startFreq = fxSynthFrequency * 1.25;
        endFreq = fxSynthFrequency * 1.45;
        vol = fxSynthVolume * 0.4;
      } else if (beepType === 'click') {
        dur = 0.12;
        startFreq = fxSynthFrequency;
        endFreq = fxSynthFrequency * 0.8;
        vol = fxSynthVolume;
      } else if (beepType === 'success') {
        dur = 0.25;
        startFreq = fxSynthFrequency * 0.9;
        endFreq = fxSynthFrequency * 1.8;
        vol = fxSynthVolume * 1.1;
        
        // Success extra micro beep
        setTimeout(() => {
          try {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = fxSynthWaveform;
            osc2.frequency.setValueAtTime(fxSynthFrequency * 2.2, ctx.currentTime);
            gain2.gain.setValueAtTime(vol * 0.8, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.15);
          } catch(e){}
        }, 90);
      } else if (beepType === 'fail') {
        dur = 0.3;
        startFreq = fxSynthFrequency * 0.7;
        endFreq = fxSynthFrequency * 0.3;
        vol = fxSynthVolume * 1.2;
      } else if (beepType === 'glitch') {
        dur = 0.15;
        startFreq = fxSynthFrequency * 3.5;
        endFreq = fxSynthFrequency * 0.15;
        vol = fxSynthVolume * 0.9;
        osc.type = 'sawtooth';
      }

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      console.warn("Web Audio Context blocked or unsupported:", e);
    }
  };

  // Continuous Low-Frequency Ambient Transformers Hum
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;

    if (fxAmbientHumEnabled && fxSoundEnabled && activeTab === 'design-fx') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtx();
        osc = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(60, audioCtx.currentTime); // 60Hz hum
        
        gain.gain.setValueAtTime(fxSynthVolume * 0.18, audioCtx.currentTime);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
      } catch (err) {
        console.warn("Ambient hum setup failed:", err);
      }
    }

    return () => {
      if (osc) {
        try { osc.stop(); } catch(e){}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch(e){}
      }
    };
  }, [fxAmbientHumEnabled, fxSoundEnabled, activeTab, fxSynthVolume]);

  const applyCyberPreset = (preset: typeof CYBER_ACCENT_PRESETS[0]) => {
    setActivePresetId(preset.id);
    setGridColor(preset.color);
    setGridSpeed(preset.speed);
    setGridAngle(preset.angle);
    setParticleShape(preset.shape);
    setParticlesCount(preset.particlesCount);
    setCardBorderPreset(preset.borderPreset);
    setFxAmbientHumEnabled(preset.hum);
    setFxSynthWaveform(preset.waveform);
    setFxSynthFrequency(preset.frequency);
    setFxChromaticOffset(preset.chromaticOffset);
    setScanlineOpacity(preset.scanlineOpacity);
    
    // Trigger transition glitch
    setFxGlitchActive(true);
    setTimeout(() => {
      setFxGlitchActive(false);
    }, 300);

    // Play its distinctive acoustic signature sound
    if (fxSoundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          
          // Note 1: Base Tone
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = preset.waveform;
          osc1.frequency.setValueAtTime(preset.frequency, ctx.currentTime);
          gain1.gain.setValueAtTime(preset.id === 'aegis' || preset.id === 'corrupt' ? fxSynthVolume * 0.7 : fxSynthVolume, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.45);
          
          // Note 2: Harmonic Fifth
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = preset.waveform === 'sawtooth' ? 'sine' : preset.waveform;
          osc2.frequency.setValueAtTime(preset.frequency * 1.5, ctx.currentTime + 0.05);
          gain2.gain.setValueAtTime(fxSynthVolume * 0.4, ctx.currentTime + 0.05);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime + 0.05);
          osc2.stop(ctx.currentTime + 0.40);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Append beautiful, highly detailed cyber logs in our Terminal Simulator
    setTerminalLog(prev => [
      ...prev,
      { text: `> load-model --id=${preset.id}`, type: 'input' },
      { text: `[COGNITIVE SHELL]: LOADING OPERATION MODEL: ${preset.name.toUpperCase()} (${preset.codename})`, type: 'system' },
      { text: `[ACOUSTIC RESONATOR]: osc_wave=${preset.waveform} | pitch=${preset.frequency}Hz | gain=${Math.round(fxSynthVolume * 100)}%`, type: 'ambient' },
      { text: `[GRID COUPLER]: speed=${preset.speed}s | perspective=${preset.angle}deg | particles=${preset.particlesCount} (${preset.shape})`, type: 'ambient' },
      { text: `[SYSTEM DIAGNOSTICS]: ${preset.description}`, type: 'success' },
      { text: `[NODE INTEGRITY]: MODEL SECURED & SYNCHRONIZED.`, type: 'success' }
    ]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const parts = cmd.split(' ');
    const baseCmd = parts[0];
    const arg1 = parts[1];
    const arg2 = parts[2];

    const newLogs = [...terminalLog, { text: `> ${terminalInput}`, type: 'input' as const }];
    
    let responseText = '';
    let responseType: 'system' | 'success' | 'error' | 'ambient' = 'system';

    switch (baseCmd) {
      case 'help':
        responseText = 'STATION DIRECTIVES:\n' +
          '- model <id> : deploy neural accent model (e.g. model aegis)\n' +
          '- models : list all 20 registered cyber accent model codes\n' +
          '- grid <on|off|color <hex>|speed <5-30>|angle <0-45>>\n' +
          '- scanline <on|off|opacity <0.03-0.35>>\n' +
          '- sound <on|off|pitch <Hz>|wave <sine|triangle|square|sawtooth>>\n' +
          '- hum <on|off>\n' +
          '- glow <20-150>\n' +
          '- glitch : execute circuit glitch overrides\n' +
          '- matrix-rain : trigger binary waterfall cycle\n' +
          '- clear : flush terminal log entries';
        responseType = 'ambient';
        playBeep('click');
        break;

      case 'model':
        if (arg1) {
          const found = CYBER_ACCENT_PRESETS.find(p => p.id === arg1 || p.id.toLowerCase() === arg1.toLowerCase());
          if (found) {
            applyCyberPreset(found);
            setTerminalInput('');
            return;
          } else {
            responseText = `ERROR: DESIGN MODEL "${arg1}" NOT REGISTERED. TYPE "models" TO VIEW ALL ID CODES.`;
            responseType = 'error';
            playBeep('fail');
          }
        } else {
          responseText = 'ERROR: SPECIFY MODEL ID, E.G.: model aegis | model oracle';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'models':
      case 'model-list':
        responseText = 'REGISTERED NEURAL CYBER MODELS:\n' + CYBER_ACCENT_PRESETS.map(p => `- ${p.id} : ${p.name} (${p.codename})`).join('\n');
        responseType = 'ambient';
        playBeep('click');
        break;

      case 'clear':
        setTerminalLog([
          { text: 'CONSOLE LOG FLUSHED. SHELL SESSION ACTIVE.', type: 'system' }
        ]);
        setTerminalInput('');
        playBeep('click');
        return;

      case 'matrix-rain':
        setTerminalLog([
          ...newLogs,
          { text: 'INITIATING QUANTUM PARITY SCAN...', type: 'system' },
          { text: '01001101 01000001 01010100 01010010 01001001 01011000', type: 'success' },
          { text: '11010110 10101101 11001101 10101110 01101101 11010101', type: 'success' },
          { text: 'QUANTUM GRID SECURED. DRIFT RATIO AT 0.00%', type: 'success' }
        ]);
        setTerminalInput('');
        playBeep('success');
        return;

      case 'grid':
        if (arg1 === 'on' || arg1 === 'enable') {
          setGridEnabled(true);
          responseText = 'GRID BACKDROP: OPERATIONAL';
          responseType = 'success';
          playBeep('success');
        } else if (arg1 === 'off' || arg1 === 'disable') {
          setGridEnabled(false);
          responseText = 'GRID BACKDROP: SILENCED / HIDDEN';
          responseType = 'system';
          playBeep('click');
        } else if (arg1 === 'color' && arg2) {
          if (/^#[0-9a-f]{6}$/i.test(arg2)) {
            setGridColor(arg2);
            responseText = `GRID COLOR MODIFIED TO ${arg2.toUpperCase()}`;
            responseType = 'success';
            playBeep('success');
          } else {
            responseText = 'ERROR: COLOUR VALUE EXCEEDS EXPECTED FORMAT. USE HEX LIKE #FF00FF';
            responseType = 'error';
            playBeep('fail');
          }
        } else if (arg1 === 'speed' && arg2) {
          const s = parseInt(arg2);
          if (!isNaN(s) && s >= 5 && s <= 30) {
            setGridSpeed(s);
            responseText = `GRID ROTATIONAL CYCLE SPEED SLOCKED AT: ${s}`;
            responseType = 'success';
            playBeep('success');
          } else {
            responseText = 'ERROR: GRID SPEED OUT OF PERMITTED BOUNDS (5 - 30)';
            responseType = 'error';
            playBeep('fail');
          }
        } else if (arg1 === 'angle' && arg2) {
          const a = parseInt(arg2);
          if (!isNaN(a) && a >= 0 && a <= 45) {
            setGridAngle(a);
            responseText = `PERSPECTIVE MATRIX SKEWED: ${a} DEG`;
            responseType = 'success';
            playBeep('success');
          } else {
            responseText = 'ERROR: MATRIX ANGLE SKIRMISH LIMITS (0 - 45)';
            responseType = 'error';
            playBeep('fail');
          }
        } else {
          responseText = 'ERROR: INCORRECT SYNTAX. CMD FORMAT: grid <on|off|color #hex|speed 15|angle 15>';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'scanline':
        if (arg1 === 'on' || arg1 === 'enable') {
          setScanlineEnabled(true);
          responseText = 'CRT SCANLINE OVERLAY: LOCKED ON';
          responseType = 'success';
          playBeep('success');
        } else if (arg1 === 'off' || arg1 === 'disable') {
          setScanlineEnabled(false);
          responseText = 'CRT SCANLINE OVERLAY: SILENCED';
          responseType = 'system';
          playBeep('click');
        } else if (arg1 === 'opacity' && arg2) {
          const op = parseFloat(arg2);
          if (!isNaN(op) && op >= 0.03 && op <= 0.35) {
            setScanlineOpacity(op);
            responseText = `CRT INTENSITY MODULATED: ${Math.round(op * 100)}% DENSITY`;
            responseType = 'success';
            playBeep('success');
          } else {
            responseText = 'ERROR: CHOOSE CRT INTENSITY FROM 0.03 TO 0.35';
            responseType = 'error';
            playBeep('fail');
          }
        } else {
          responseText = 'ERROR: TRY: scanline <on|off|opacity 0.15>';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'sound':
        if (arg1 === 'on' || arg1 === 'enable') {
          setFxSoundEnabled(true);
          responseText = 'SYNTHESIZER CORE ENGINE: ONLINE';
          responseType = 'success';
          setTimeout(() => playBeep('success'), 50);
        } else if (arg1 === 'off' || arg1 === 'disable') {
          setFxSoundEnabled(false);
          responseText = 'SYNTHESIZER CORE ENGINE: STANDBY MUTE';
          responseType = 'system';
        } else if (arg1 === 'pitch' && arg2) {
          const p = parseInt(arg2);
          if (!isNaN(p) && p >= 100 && p <= 1200) {
            setFxSynthFrequency(p);
            responseText = `SYNTH REGISTER FREQUENCY TUNED: ${p}Hz`;
            responseType = 'success';
            setTimeout(() => playBeep('success'), 50);
          } else {
            responseText = 'ERROR: FREQUENCY PITCH SCALE BOUNDS EXCEEDED (100 - 1200)';
            responseType = 'error';
            playBeep('fail');
          }
        } else if (arg1 === 'wave' && arg2) {
          if (['sine', 'triangle', 'square', 'sawtooth'].includes(arg2)) {
            setFxSynthWaveform(arg2 as any);
            responseText = `SYNTH OSCILLATOR CONFIGURED: ${arg2.toUpperCase()}`;
            responseType = 'success';
            setTimeout(() => playBeep('success'), 50);
          } else {
            responseText = 'ERROR: OSCILLATOR WAVE MUST BE sine, triangle, square OR sawtooth';
            responseType = 'error';
            playBeep('fail');
          }
        } else {
          responseText = 'ERROR: TRY: sound <on|off|pitch 440|wave sine>';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'hum':
        if (arg1 === 'on' || arg1 === 'enable') {
          setFxAmbientHumEnabled(true);
          responseText = 'LOW-PITCHED TRANSFORMER HARMONIC HUM: ACTIVATED';
          responseType = 'success';
          playBeep('success');
        } else if (arg1 === 'off' || arg1 === 'disable') {
          setFxAmbientHumEnabled(false);
          responseText = 'LOW-PITCHED TRANSFORMER HARMONIC HUM: DEACTIVATED';
          responseType = 'system';
          playBeep('click');
        } else {
          responseText = 'ERROR: TRY: hum <on|off>';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'glow':
        if (arg1) {
          const g = parseInt(arg1);
          if (!isNaN(g) && g >= 20 && g <= 150) {
            setGlowIntensity(g);
            responseText = `AMBIENT NEON GLOW EXPANDED TO: ${g}px RADIUS`;
            responseType = 'success';
            playBeep('success');
          } else {
            responseText = 'ERROR: GLOW VALUE OUT OF RANGE (20 - 150)';
            responseType = 'error';
            playBeep('fail');
          }
        } else {
          responseText = 'ERROR: TRY: glow <20-150>';
          responseType = 'error';
          playBeep('fail');
        }
        break;

      case 'glitch':
        setFxGlitchActive(true);
        playBeep('glitch');
        responseText = 'QUANTUM HARDWARE DRIFT INDUCED. CORRECTION CONSOLE STANDBY.';
        responseType = 'success';
        setTimeout(() => {
          setFxGlitchActive(false);
        }, 350);
        break;

      default:
        responseText = `SYNTAX UNRECOGNIZED: "${baseCmd}". KEY IN "help" TO VIEW PERMITTED TELEMETRY DIRECTIVES.`;
        responseType = 'error';
        playBeep('fail');
    }

    setTerminalLog([...newLogs, { text: responseText, type: responseType }]);
    setTerminalInput('');
  };

  const saveFxSettings = () => {
    localStorage.setItem('fx-grid-enabled', String(gridEnabled));
    localStorage.setItem('fx-grid-color', gridColor);
    localStorage.setItem('fx-grid-speed', String(gridSpeed));
    localStorage.setItem('fx-grid-angle', String(gridAngle));
    localStorage.setItem('fx-scanline-enabled', String(scanlineEnabled));
    localStorage.setItem('fx-scanline-speed', String(scanlineSpeed));
    localStorage.setItem('fx-scanline-opacity', String(scanlineOpacity));
    localStorage.setItem('fx-glow-intensity', String(glowIntensity));
    localStorage.setItem('fx-glow-pulse', String(glowPulse));
    localStorage.setItem('fx-particles-count', String(particlesCount));
    localStorage.setItem('fx-particle-shape', particleShape);
    localStorage.setItem('fx-card-border', cardBorderPreset);
    if (activePresetId) {
      localStorage.setItem('fx-active-preset-id', activePresetId);
    } else {
      localStorage.removeItem('fx-active-preset-id');
    }
    
    // Save new Audio/Glitch states
    localStorage.setItem('fx-sound-enabled', String(fxSoundEnabled));
    localStorage.setItem('fx-synth-volume', String(fxSynthVolume));
    localStorage.setItem('fx-synth-waveform', fxSynthWaveform);
    localStorage.setItem('fx-synth-frequency', String(fxSynthFrequency));
    localStorage.setItem('fx-ambient-hum-enabled', String(fxAmbientHumEnabled));
    localStorage.setItem('fx-glitch-intensity', String(fxGlitchIntensity));
    localStorage.setItem('fx-chromatic-offset', String(fxChromaticOffset));

    playBeep('success');
    setSaveSuccess('design-fx');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Dynamic Item Form States
  const [newProject, setNewProject] = useState({
    title: '', description: '', imageUrl: '', tech: '', liveUrl: '', sourceCode: '', category: 'web'
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 80, category: 'frontend' });
  const [newService, setNewService] = useState({ icon: 'Code', title: '', description: '' });

  // Update Forms
  const [heroForm, setHeroForm] = useState<HeroData>({ ...portfolioData.hero });
  const [aboutForm, setAboutForm] = useState<AboutData>({ ...portfolioData.about });
  const [settingsForm, setSettingsForm] = useState<Settings>({ ...portfolioData.settings });

  // Resume upload manager states
  const [resumeInfo, setResumeInfo] = useState<{
    fileName: string;
    contentType: string;
    uploadedAt: string;
    fileSize: number;
  } | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Connection/Handshake probe states
  const [probeLog, setProbeLog] = useState<string[]>([]);
  const [isProbing, setIsProbing] = useState(false);
  const [handshakeSuccess, setHandshakeSuccess] = useState(false);

  const safeParseJson = async (res: Response, fallbackValue: any = null) => {
    if (!res.ok) return fallbackValue;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`Expected JSON but received non-JSON response from ${res.url}`);
      return fallbackValue;
    }
    try {
      return await res.json();
    } catch (err) {
      console.error(`Failed to parse JSON from ${res.url}:`, err);
      return fallbackValue;
    }
  };

  const fetchResumeInfo = async () => {
    try {
      const res = await fetch('/api/resume/info');
      const data = await safeParseJson(res);
      if (data && data.success) {
        setResumeInfo(data);
      }
    } catch (err) {
      console.error("Failed to fetch resume details:", err);
    }
  };

  // Hard Reset States
  const [resetState, setResetState] = useState<'idle' | 'confirming' | 'resetting' | 'success'>('idle');
  const [resetCountdown, setResetCountdown] = useState(5);

  useEffect(() => {
    let interval: any = null;
    if (resetState === 'confirming') {
      interval = setInterval(() => {
        setResetCountdown(prev => {
          if (prev <= 1) {
            setResetState('idle');
            clearInterval(interval);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setResetCountdown(5);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resetState]);

  const triggerHardReset = async () => {
    if (resetState === 'idle') {
      setResetState('confirming');
      setResetCountdown(5);
      return;
    }
    
    if (resetState === 'confirming') {
      setResetState('resetting');
      try {
        const response = await fetch('/api/admin/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setResetState('success');
          if (onRefreshData) onRefreshData();
          setTimeout(() => setResetState('idle'), 4000);
        } else {
          alert('Failed to execute hard reset: ' + (resData.error || 'Server error'));
          setResetState('idle');
        }
      } catch (err: any) {
        alert('Hard reset transmission failed: ' + err.message);
        setResetState('idle');
      }
    }
  };

  // Sync state with portfolio data updates
  useEffect(() => {
    setHeroForm({ ...portfolioData.hero });
    setAboutForm({ ...portfolioData.about });
    setSettingsForm({ ...portfolioData.settings });
    fetchResumeInfo();
  }, [portfolioData]);

  // Load backend admin data (messages & chat telemetry) if token present
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      // Fetch contact messages
      const msgsRes = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const msgs = await safeParseJson(msgsRes);
      if (msgs && Array.isArray(msgs)) setMessages(msgs);

      // Fetch chatbot interaction logs
      setLoadingLogs(true);
      const logsRes = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logs = await safeParseJson(logsRes);
      if (logs && Array.isArray(logs)) setChatLogs(logs);

      // Fetch structured resume details
      await fetchResumeDetailsData();

    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchResumeDetailsData = async () => {
    setLoadingResumeDetails(true);
    try {
      const res = await fetch('/api/resume/details');
      const json = await safeParseJson(res);
      if (json && json.success && json.data) {
        setResumeForm(json.data);
        setResumeSkillsText(json.data.skills ? json.data.skills.join(', ') : '');
      }
    } catch (err) {
      console.error('Failed to load structured resume in admin dashboard:', err);
    } finally {
      setLoadingResumeDetails(false);
    }
  };

  const saveResumeDetailsData = async () => {
    if (!token) return;
    setSavingResumeDetails(true);
    try {
      const skillsArray = resumeSkillsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        ...resumeForm,
        skills: skillsArray
      };

      const res = await fetch('/api/resume/details/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setResumeForm(json.data);
          setResumeSkillsText(json.data.skills ? json.data.skills.join(', ') : '');
          setSaveSuccess('resume_details');
          setTimeout(() => setSaveSuccess(null), 3000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingResumeDetails(false);
    }
  };

  const runHandshakeProbe = () => {
    if (isProbing) return;
    setIsProbing(true);
    setHandshakeSuccess(false);
    setProbeLog([]);

    const steps = [
      { text: "⚡ Initializing quantum socket handshake probe...", delay: 200 },
      { text: "🛰️ Fetching server container node headers...", delay: 600 },
      { text: "📡 Tunnel status verified: Status [SYNCED]", delay: 1100 },
      { text: "🔒 Checking signature keys and origin authority...", delay: 1600 },
      { text: `📊 Sync complete: ${portfolioData.projects.length} projects, ${chatLogs.length} chat triggers resolved.`, delay: 2100 },
      { text: "🎉 Secure bridge to admin console verified! Latency: 14ms", delay: 2600 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setProbeLog(prev => [...prev, step.text]);
        if (idx === steps.length - 1) {
          setIsProbing(false);
          setHandshakeSuccess(true);
        }
      }, step.delay);
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setLoginError(data.error || 'Authenication denied. Credentials invalid!');
      }
    } catch (err) {
      setLoginError('Could not establish secure handshake with fullstack controller.');
    } finally {
      setLoggingIn(false);
    }
  };

  // ---------------------------------
  // MUTATION EVENTS
  // ---------------------------------
  const saveHeroContent = async () => {
    if (!token) return;
    setSavingState(true);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/hero/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroForm)
      });
      if (res.ok) {
        setSaveSuccess('hero');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingState(false);
    }
  };

  const saveAboutContent = async () => {
    if (!token) return;
    setSavingState(true);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/about/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aboutForm)
      });
      if (res.ok) {
        setSaveSuccess('about');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingState(false);
    }
  };

  const saveGlobalSettings = async () => {
    if (!token) return;
    setSavingState(true);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setSaveSuccess('settings');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingState(false);
    }
  };

  const handleUploadResumeFile = async (file: File) => {
    if (!file) return;
    
    // Validate file size (max 8MB for Firestore compatibility)
    if (file.size > 8 * 1024 * 1024) {
      setResumeUploadError("File size is too large (max 8MB). Please load a smaller file.");
      setResumeUploadSuccess(false);
      return;
    }

    setResumeUploading(true);
    setResumeUploadError(null);
    setResumeUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const base64Parts = dataUrl.split(',');
          const base64Data = base64Parts[1];
          const contentType = file.type || 'application/pdf';

          const res = await fetch('/api/resume/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              fileName: file.name,
              contentType,
              base64Data
            })
          });

          if (res.ok) {
            setResumeUploadSuccess(true);
            setResumeInfo({
              fileName: file.name,
              contentType,
              uploadedAt: new Date().toISOString(),
              fileSize: file.size
            });
            setSettingsForm(prev => ({ ...prev, resumeUrl: '/api/resume/download' }));
            onRefreshData();
          } else {
            const errData = await res.json();
            setResumeUploadError(errData.error || "Failed to upload file.");
          }
        } catch (innerErr: any) {
          setResumeUploadError(innerErr.message || "Encoding issue.");
        } finally {
          setResumeUploading(false);
        }
      };

      reader.onerror = () => {
         setResumeUploadError("Unable to parse file.");
         setResumeUploading(false);
      };

    } catch (err: any) {
      setResumeUploadError(err.message || "An unexpected error occurred during upload.");
      setResumeUploading(false);
    }
  };

  // Projects mutation handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    try {
      const payload = editingProjectId ? { ...newProject, id: editingProjectId } : newProject;
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewProject({ title: '', description: '', imageUrl: '', tech: '', liveUrl: '', sourceCode: '', category: 'web' });
        setEditingProjectId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setNewProject({
      title: p.title || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : (p.tech || ''),
      liveUrl: p.liveUrl || '',
      sourceCode: p.sourceCode || '',
      category: p.category || 'web'
    });
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConfirmDeleteProjectId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Skills Mutations
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      const payload = editingSkillId 
        ? { id: editingSkillId, ...newSkill } 
        : newSkill;

      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewSkill({ name: '', level: 80, category: 'frontend' });
        setEditingSkillId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConfirmDeleteSkillId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Services Mutations
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.description) return;
    try {
      const payload = editingServiceId 
        ? { id: editingServiceId, ...newService } 
        : newService;

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewService({ icon: 'Code', title: '', description: '' });
        setEditingServiceId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConfirmDeleteServiceId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Messages Actions
  const handleToggleRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/toggle-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditLog = (log: any) => {
    setEditingLogId(log.id || log.timestamp);
    setEditLogForm({
      message: log.message,
      reply: log.reply
    });
  };

  const handleSaveEditTelemetryLog = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/history/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editLogForm)
      });
      if (res.ok) {
        setEditingLogId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error saving telemetry log edit:', err);
    }
  };

  const handleDeleteTelemetryLog = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConfirmDeleteLogId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error deleting telemetry log:', err);
    }
  };

  // ---------------------------------
  // IMAGE AS BASE64 UPLOADER ASSIST
  // ---------------------------------
  const convertToBase64AndAssign = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatar' | 'profile' | 'project' | 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const b64 = reader.result as string;
      if (targetField === 'avatar') {
        setAboutForm(prev => ({ ...prev, avatarUrl: b64 }));
      } else if (targetField === 'profile') {
        setHeroForm(prev => ({ ...prev, profileImage: b64 }));
      } else if (targetField === 'project') {
        setNewProject(prev => ({ ...prev, imageUrl: b64 }));
      } else if (targetField === 'logo') {
        setSettingsForm(prev => ({ ...prev, logoImageUrl: b64 }));
      } else if (targetField === 'banner') {
        setSettingsForm(prev => ({ ...prev, bannerBgImageUrl: b64 }));
      }
    };
  };

  // Render Login state first if unauthorized
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-4">
        <div className="absolute inset-0 cyber-grid -z-10 opacity-40"></div>
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel-heavy border border-white/10 relative text-left shadow-[0_0_50px_rgba(138,43,226,0.2)]">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="p-3 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-2xl">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white uppercase">NEON Portfolio & Lab</h2>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Authenticate via standard administrator profiles to unlock live state controls.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">Root Identity</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. sanjeevidaa@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-purple hover:border-white/20 outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">Access Key</label>
              <div className="relative flex items-center">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-purple hover:border-white/20 outline-none text-white text-sm"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-4" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn || !email || !password}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:scale-103 cursor-pointer transition-transform duration-100 disabled:opacity-50"
            >
              {loggingIn ? 'Syncing...' : 'Handshake handshake'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Authorised Main view
  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${adminTheme === 'light' ? 'admin-lite' : ''} bg-[#0A0D16] text-white flex select-none font-sans`}>
      
      {/* LEFT SIDEBAR SECTION */}
      <aside className="w-72 bg-[#0F1322] border-r border-white/5 flex flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto">
        
        {/* Sidebar Header Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.25)] font-display">
              P
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold tracking-tight text-white uppercase font-display leading-none">Portfolio</h2>
              <span className="text-[10px] font-mono text-indigo-400 capitalize font-medium">Admin Panel</span>
            </div>
          </div>
          
          {/* Navigation Menu List */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('hero-about')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'hero-about' && activeTab === 'hero-about'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('hero-about')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'hero-about' && activeTab === 'hero-about'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>About</span>
            </button>

            <button
              onClick={() => setActiveTab('skills-services')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'skills-services' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Hammer className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Skills Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'projects' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Projects Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('skills-services')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'skills-services' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Services Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer relative ${
                activeTab === 'messages' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Contact Messages</span>
              {messages.filter(m => !m.read).length > 0 && (
                <span className="absolute right-4 px-1.5 py-0.5 rounded-full bg-indigo-500 text-[9px] font-black text-white leading-none">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chatbot')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'chatbot' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-slate-400" />
              <span>AI Companion</span>
            </button>

            <button
              onClick={() => setActiveTab('google-analytics')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'google-analytics' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Google Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'resume' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-slate-400" />
              <span>CV / Resume Details</span>
            </button>

            <button
              onClick={() => setActiveTab('design-fx')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'design-fx' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              <span className="font-bold text-amber-200">Design & FX Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-3 cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Global Settings</span>
            </button>
          </nav>
        </div>

        {/* User Card Profile & Online Status Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto px-1">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-300 overflow-hidden shrink-0">
                {portfolioData.about.avatarUrl && portfolioData.about.avatarUrl.trim() !== "" ? (
                  <img src={portfolioData.about.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  portfolioData.hero.name?.substring(0, 2).toUpperCase() || 'AD'
                )}
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0F1322] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white tracking-wide truncate max-w-[120px]">{portfolioData.hero.name || "John Doe"}</h4>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none block">Admin</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hover:text-white transition-colors cursor-pointer" />
        </div>

      </aside>

      {/* RIGHT MAIN PANEL VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0A0D16]">
        
        {/* Elegant Top Header Bar */}
        <header className="h-20 bg-[#0F1322] border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div className="text-left">
            <h1 className="text-base font-bold uppercase tracking-wider text-white font-display">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'hero-about' && 'Profile Workspace'}
              {activeTab === 'skills-services' && 'Skills & Services'}
              {activeTab === 'projects' && 'Projects Showcase'}
              {activeTab === 'messages' && 'Visitor Inbox'}
              {activeTab === 'chatbot' && 'Companion settings'}
              {activeTab === 'google-analytics' && 'Google Analytics'}
              {activeTab === 'settings' && 'Global configurations'}
              {activeTab === 'resume' && 'CV / Resume management'}
              {activeTab === 'design-fx' && 'Visual FX Laboratory & Canvas'}
            </h1>
            <p className="text-[10px] uppercase font-mono text-indigo-400 font-medium mt-0.5">
              {activeTab === 'overview' && `Welcome back, ${portfolioData.hero.name?.split(' ')[0] || 'Admin'}!`}
              {activeTab === 'hero-about' && 'Update biographical details, headers and titles.'}
              {activeTab === 'skills-services' && 'Manage tech competencies and standard professional offers.'}
              {activeTab === 'projects' && 'Synchronize recent study showcases and repositories.'}
              {activeTab === 'messages' && `Read client requests. Total emails: ${messages.length}`}
              {activeTab === 'chatbot' && 'Optimize local AI helper answers and provider tokens.'}
              {activeTab === 'google-analytics' && 'Capture custom visits and trace operational state.'}
              {activeTab === 'settings' && 'Configure active theme styles and base metadata details.'}
              {activeTab === 'resume' && 'Coordinate digital resume storage metrics.'}
              {activeTab === 'design-fx' && 'Design custom colors, grid overlays, glow frequencies and floating star parameters.'}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Mockup Search Bar */}
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500 w-56 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Notifications Alert Bell */}
            <div className="relative cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('messages')}>
              <Bell className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              {messages.filter(m => !m.read).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </div>

            {/* Dark Mode / Lite Mode switcher */}
            <button 
              onClick={toggleAdminTheme}
              className={`w-10 h-6 rounded-full p-0.5 flex items-center cursor-pointer transition-all duration-300 relative border ${
                adminTheme === 'light' 
                  ? 'bg-slate-200 border-slate-300' 
                  : 'bg-slate-800 border-white/10'
              }`}
              title={adminTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Lite Mode'}
            >
              <div className={`w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 absolute ${
                adminTheme === 'light' ? 'left-0.5' : 'left-4.5'
              }`}>
                {adminTheme === 'light' ? (
                  <Sun className="w-2.5 h-2.5 text-white" />
                ) : (
                  <Moon className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            </button>

            {/* Refresh portal */}
            <button 
              onClick={fetchAdminData}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Refresh database collections"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Exit Console */}
            <button onClick={onClose} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center space-x-1.5">
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </header>

        {/* MAIN PANEL CONTENT WINDOW */}
        <div className="flex-1 overflow-y-auto p-8 text-left space-y-8">

          {/* 1. COMPREHENSIVE OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Row 1: KPI Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Views */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/50 hover:bg-[#0F1322]/80 border border-white/5 transition-all text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                      ↑ 18.7%
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-display text-white">2,451</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mt-1">Profile Views</span>
                  </div>
                </div>

                {/* Projects */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/50 hover:bg-[#0F1322]/80 border border-white/5 transition-all text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Folder className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold font-display">
                      ↑ 2 new
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-display text-white">{portfolioData.projects.length}</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mt-1">Active Projects</span>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/50 hover:bg-[#0F1322]/80 border border-white/5 transition-all text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                      ↑ 4 new
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-display text-white">{portfolioData.services.length || 18}</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mt-1">Services Offered</span>
                  </div>
                </div>

                {/* Inbox Messages */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/50 hover:bg-[#0F1322]/80 border border-white/5 transition-all text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    {messages.filter(m => !m.read).length > 0 ? (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {messages.filter(m => !m.read).length} active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-bold">
                        12.5% this month
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold font-display text-white">{messages.length || 32}</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mt-1">Contact Messages</span>
                  </div>
                </div>

              </div>

              {/* Row 2: Graph and Recent Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Area Chart spline graph */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0F1322]/40 border border-white/5 flex flex-col justify-between h-[380px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">Profile Views</h4>
                      <p className="text-[9px] font-mono text-slate-400 uppercase">Interactive stats graph for core site visitation</p>
                    </div>
                    <select className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-300 outline-none">
                      <option value="30">Last 30 Days</option>
                    </select>
                  </div>

                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: 'Apr 24', views: 240 },
                          { name: 'Apr 29', views: 420 },
                          { name: 'May 4', views: 330 },
                          { name: 'May 9', views: 820 },
                          { name: 'May 14', views: 510 },
                          { name: 'May 19', views: 680 },
                          { name: 'May 24', views: 580 },
                          { name: 'May 29', views: 910 },
                        ]}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="viewsGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          className="font-mono"
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          className="font-mono"
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                          labelClassName="font-mono text-xs text-indigo-400 font-bold"
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#6366f1" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#viewsGlow)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Messages list */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0F1322]/40 border border-white/5 flex flex-col h-[380px] text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recent Messages</h4>
                    <button onClick={() => setActiveTab('messages')} className="text-[10px] font-mono text-indigo-400 font-bold hover:text-indigo-300 uppercase transition-all">View All</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-none pr-1">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <Mail className="w-8 h-8 text-slate-700 mb-2 animate-bounce" />
                        <p className="text-xs text-slate-500 font-mono italic">No communication logs recorded yet.</p>
                      </div>
                    ) : (
                      messages.slice(0, 4).map((msg) => (
                        <div key={msg.id} onClick={() => setActiveTab('messages')} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer flex items-start space-x-3 text-xs relative group">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[10px] uppercase font-bold text-indigo-400 shrink-0">
                            {msg.name?.substring(0, 2) || 'QS'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h5 className="font-bold text-slate-200 truncate pr-2">{msg.name}</h5>
                              <span className="text-[8px] font-mono text-slate-500 uppercase">{new Date(msg.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 truncate font-normal leading-tight">{msg.message}</p>
                          </div>
                          {!msg.read && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Row 3: Bottom columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Top Projects */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/40 border border-white/5 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Projects</h4>
                      <button onClick={() => setActiveTab('projects')} className="text-[10px] font-mono text-indigo-400 font-bold hover:text-indigo-300 uppercase">View All</button>
                    </div>

                    <div className="space-y-4">
                      {portfolioData.projects.length === 0 ? (
                        <p className="text-xs text-slate-500 italic font-mono">No projects tracked yet.</p>
                      ) : (
                        portfolioData.projects.slice(0, 4).map((proj, idx) => {
                          const percentages = [85, 72, 60, 48];
                          const pct = percentages[idx % percentages.length];
                          return (
                            <div key={proj.id} className="flex items-center space-x-3 text-xs">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/5 overflow-hidden shrink-0">
                                {proj.imageUrl ? (
                                  <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center uppercase font-mono text-[10px] text-slate-500">PRJ</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                  <h5 className="font-bold text-slate-200 truncate pr-2">{proj.title}</h5>
                                  <span className="text-[10px] text-slate-400 font-mono font-semibold">{pct * 10} views</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills overview list */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/40 border border-white/5 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Skills Overview</h4>
                      <button onClick={() => setActiveTab('skills-services')} className="text-[10px] font-mono text-indigo-400 font-bold hover:text-indigo-300 uppercase">View All</button>
                    </div>

                    <div className="space-y-4">
                      {portfolioData.skills.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No skill sets parsed.</p>
                      ) : (
                        portfolioData.skills.slice(0, 4).map((sk) => {
                          return (
                            <div key={sk.id} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-300">{sk.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{sk.level || 80}%</span>
                              </div>
                              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${sk.level || 80}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* System Overview */}
                <div className="p-6 rounded-2xl bg-[#0F1322]/40 border border-white/5 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between pb-3 border-b border-white/5 mb-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Overview</h4>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 uppercase tracking-widest text-[9.5px] font-mono">Total Pages</span>
                        <span className="font-bold text-white font-mono">24</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 uppercase tracking-widest text-[9.5px] font-mono">Media Files</span>
                        <span className="font-bold text-white font-mono">156</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 uppercase tracking-widest text-[9.5px] font-mono">Blog Posts</span>
                        <span className="font-bold text-white font-mono">8</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 uppercase tracking-widest text-[9.5px] font-mono">Last Backup</span>
                        <span className="text-slate-300 font-mono">May 24, 2024</span>
                      </div>
                      <div className="flex items-center justify-between pt-1.5">
                        <span className="text-slate-400 uppercase tracking-widest text-[9.5px] font-mono">System Status</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider font-mono">
                          All Systems Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 4: AI Companion chat logs / terminal dialogue */}
              <div className="space-y-4 pt-4 border-t border-white/5 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Companion Telemetry</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Live conversation dialogue logs logged by local proxy companion</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-xl uppercase leading-none font-bold">
                    {chatLogs.length} logged dialogues
                  </span>
                </div>

                {loadingLogs ? (
                  <p className="text-xs text-slate-500 font-mono">Syncing log streams...</p>
                ) : chatLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono italic">No recent AI companion logs captures.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                    {chatLogs.map((log, idx) => {
                      const idVal = log.id || log.timestamp;
                      const isEditing = editingLogId === idVal;
                      const isDeletingConfirm = confirmDeleteLogId === idVal;

                      return (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-mono space-y-3 relative group">
                          
                          <div className="flex justify-between items-center text-slate-500 text-[9px] uppercase border-b border-white/5 pb-1.5">
                            <span className="text-indigo-400 font-bold">Conversation session</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>

                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-mono text-slate-400">Visitor Prompt</label>
                                <textarea
                                  value={editLogForm.message}
                                  onChange={e => setEditLogForm({ ...editLogForm, message: e.target.value })}
                                  className="w-full p-2 text-xs rounded bg-[#0A0D16] text-white border border-white/10 focus:border-indigo-500 outline-none"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-mono text-slate-400">Response</label>
                                <textarea
                                  value={editLogForm.reply}
                                  onChange={e => setEditLogForm({ ...editLogForm, reply: e.target.value })}
                                  className="w-full p-2 text-xs rounded bg-[#0A0D16] text-white border border-white/10 focus:border-indigo-500 outline-none"
                                  rows={2}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button onClick={() => handleSaveEditTelemetryLog(idVal)} className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold uppercase cursor-pointer">Save</button>
                                <button onClick={() => setEditingLogId(null)} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[9px] font-bold uppercase cursor-pointer">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-[9px] uppercase tracking-wide text-slate-500 block mb-0.5">Visitor</span>
                                <p className="text-xs text-slate-200 font-normal leading-relaxed">{log.message}</p>
                              </div>
                              <div>
                                <span className="text-indigo-400 text-[9px] uppercase tracking-wide block mb-0.5">Proxy Companion</span>
                                <p className="text-xs text-slate-300 font-normal leading-relaxed">{log.reply}</p>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] text-slate-500">ID: {idVal.substring(0, 8)}</span>
                                
                                {isDeletingConfirm ? (
                                  <div className="flex items-center space-x-1.5 font-mono text-[9px]">
                                    <span className="text-red-400 uppercase font-semibold">Sure?</span>
                                    <button onClick={() => handleDeleteTelemetryLog(idVal)} className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase">Yes</button>
                                    <button onClick={() => setConfirmDeleteLogId(null)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[9px] uppercase">No</button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <button onClick={() => handleStartEditLog(log)} className="px-2 py-0.5 rounded border border-white/10 hover:border-white/20 hover:bg-white/5 text-[9.5px] text-slate-300">Edit</button>
                                    <button onClick={() => setConfirmDeleteLogId(idVal)} className="px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[9.5px]">Delete</button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 1.7 GOOGLE ANALYTICS CONFIGURATION */}
          {activeTab === 'google-analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">Google Analytics</h3>
                  <p className="text-[10px] font-mono text-emerald-400 uppercase mt-1">Configure external visitor tracking & engagement metrics</p>
                </div>
                <button 
                  onClick={saveGlobalSettings}
                  disabled={savingState}
                  className="px-4 py-2 bg-emerald-600 rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-700 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1" />
                  <span>{savingState && saveSuccess === 'settings' ? 'Saving...' : 'Sync Tracker'}</span>
                </button>
              </div>

              {saveSuccess === 'settings' && <p className="text-xs text-emerald-400 font-mono uppercase">✔ Analytics Tracking ID successfully synchronized!</p>}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                    <h4 className="text-xs font-mono font-bold text-neon-blue uppercase">Tracking Configuration</h4>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono text-slate-400 uppercase block">Google Analytics Measurement ID</label>
                       <div className="relative">
                         <input 
                           type="text" 
                           placeholder="G-XXXXXXXXXX"
                           value={settingsForm.googleAnalyticsId || ''}
                           onChange={e => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                           className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 text-white border border-white/10 focus:border-neon-purple outline-none font-mono"
                         />
                         <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <Activity className="w-4 h-4 text-emerald-500/50" />
                         </div>
                       </div>
                       <p className="text-[9px] font-mono text-slate-500 uppercase mt-2 italic">
                         * Format usually starts with 'G-'. This will automatically inject the gtag.js script into your live site.
                       </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 text-left space-y-3">
                    <h4 className="text-xs font-mono font-bold text-neon-pink uppercase">Quick Guide</h4>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-purple mt-1.5 flex-shrink-0"></span>
                        <span>Log in to your <strong>Google Analytics Console</strong>.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-purple mt-1.5 flex-shrink-0"></span>
                        <span>Navigate to <strong>Admin → Data Streams</strong>.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-purple mt-1.5 flex-shrink-0"></span>
                        <span>Select your Web stream and copy the <strong>Measurement ID</strong>.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neon-purple mt-1.5 flex-shrink-0"></span>
                        <span>Paste it here and click <strong>Sync Tracker</strong>.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <Activity className="w-10 h-10 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Live Tracking Activated</h4>
                    <p className="text-[10px] font-mono text-slate-400 uppercase max-w-[240px] leading-relaxed">
                      Your portfolio is currently bridging to Google’s global analytics infrastructure.
                    </p>
                  </div>
                  <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
                     <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase mb-2">
                        <span>Bridge Status</span>
                        <span className="text-emerald-500 font-bold">● Operational</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[85%] rounded-full opacity-80"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'hero-about' && (
            <div className="space-y-6">
              
              {/* Hero block update forms */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-base font-bold font-display text-white uppercase flex items-center space-x-2">
                    <span>1. Hero Intro configuration</span>
                  </h3>
                  <button 
                    onClick={saveHeroContent}
                    disabled={savingState}
                    className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(138,43,226,0.15)] hover:scale-103 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 inline mr-1" />
                    <span>{savingState && saveSuccess === null ? 'Saving...' : 'Save Intro'}</span>
                  </button>
                </div>

                {saveSuccess === 'hero' && <p className="text-xs text-emerald-400 font-mono uppercase">✔ Hero database node synchronized cleanly!</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Developer Name</label>
                    <input 
                      type="text" 
                      value={heroForm.name}
                      onChange={e => setHeroForm({ ...heroForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Developer Subtitle Headline</label>
                    <input 
                      type="text" 
                      value={heroForm.title}
                      onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Job Subbadge Tag</label>
                    <input 
                      type="text" 
                      value={heroForm.subtitle}
                      onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Hero Brief bio paragraph</label>
                    <input 
                      type="text" 
                      value={heroForm.introParagraph}
                      onChange={e => setHeroForm({ ...heroForm, introParagraph: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Profile Photo Upload (File or URL Link)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        placeholder="Or paste any URL..."
                        value={heroForm.profileImage}
                        onChange={e => setHeroForm({ ...heroForm, profileImage: e.target.value })}
                        className="flex-grow px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none h-10"
                      />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => convertToBase64AndAssign(e, 'profile')}
                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-slate-100 file:cursor-pointer !h-10 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Experience Yrs</label>
                    <input 
                      type="number" 
                      value={heroForm.experienceYears}
                      onChange={e => setHeroForm({ ...heroForm, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Projects Done</label>
                    <input 
                      type="number" 
                      value={heroForm.projectsCompleted}
                      onChange={e => setHeroForm({ ...heroForm, projectsCompleted: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Worked Clients</label>
                    <input 
                      type="number" 
                      value={heroForm.clientsWorked}
                      onChange={e => setHeroForm({ ...heroForm, clientsWorked: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Awards won</label>
                    <input 
                      type="number" 
                      value={heroForm.awardsWon}
                      onChange={e => setHeroForm({ ...heroForm, awardsWon: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About block update forms */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-base font-bold font-display text-white uppercase flex items-center space-x-2">
                    <span>2. Details identity card (About)</span>
                  </h3>
                  <button 
                    onClick={saveAboutContent}
                    disabled={savingState}
                    className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(138,43,226,0.15)] hover:scale-103 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 inline mr-1" />
                    <span>{savingState && saveSuccess === null ? 'Saving...' : 'Save Identity'}</span>
                  </button>
                </div>

                {saveSuccess === 'about' && <p className="text-xs text-emerald-400 font-mono uppercase">✔ About database node synchronized cleanly!</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Identity Name</label>
                    <input 
                      type="text" 
                      value={aboutForm.name}
                      onChange={e => setAboutForm({ ...aboutForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Identity Email</label>
                    <input 
                      type="text" 
                      value={aboutForm.email}
                      onChange={e => setAboutForm({ ...aboutForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Identity Phone</label>
                    <input 
                      type="text" 
                      value={aboutForm.phone}
                      onChange={e => setAboutForm({ ...aboutForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Identity Coordinates/Location</label>
                    <input 
                      type="text" 
                      value={aboutForm.location}
                      onChange={e => setAboutForm({ ...aboutForm, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Verification text</label>
                    <input 
                      type="text" 
                      value={aboutForm.experienceYearText}
                      onChange={e => setAboutForm({ ...aboutForm, experienceYearText: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Detailed Lab Bio summary</label>
                    <textarea 
                      rows={3}
                      value={aboutForm.description}
                      onChange={e => setAboutForm({ ...aboutForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Avatar Graphic Upload (File or URL Link)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        placeholder="Avatar url..."
                        value={aboutForm.avatarUrl}
                        onChange={e => setAboutForm({ ...aboutForm, avatarUrl: e.target.value })}
                        className="flex-grow px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none h-10"
                      />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => convertToBase64AndAssign(e, 'avatar')}
                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-slate-100 file:cursor-pointer !h-10 mt-1"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 3. PROJECTS CREATOR CHANNEL */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 uppercase">Projects Laboratory</h3>
              
              {/* Submission Form */}
              <form onSubmit={handleAddProject} className={`p-5 rounded-2xl bg-white/5 border text-xs font-mono space-y-4 text-left transition-all ${editingProjectId ? 'border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-white/5 hover:border-white/10'}`}>
                <span className="text-xs font-bold font-display text-neon-blue uppercase block mb-1">
                  {editingProjectId ? 'Modify Existing Creation' : 'Upload New Creation'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Project App Title</label>
                    <input 
                      type="text" 
                      required
                      value={newProject.title}
                      onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Neon Ledger"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Filtration category</label>
                    <select
                      value={newProject.category}
                      onChange={e => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white h-[34px]"
                    >
                      <option value="web">Web Platform</option>
                      <option value="app">Mobile App</option>
                      <option value="uiux">UI/UX Design</option>
                      <option value="backend">Backend/AI Service</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Visual description bio</label>
                    <input 
                      type="text" 
                      required
                      value={newProject.description}
                      onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Cyberpunk analytics ledger with customizable glass metrics."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Tech Stacks (Commas separated)</label>
                    <input 
                      type="text" 
                      value={newProject.tech}
                      onChange={e => setNewProject({ ...newProject, tech: e.target.value })}
                      placeholder="React, Tailwind, Node"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Live URL Demo link</label>
                    <input 
                      type="text" 
                      value={newProject.liveUrl}
                      onChange={e => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      placeholder="#"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Source code repository URL</label>
                    <input 
                      type="text" 
                      value={newProject.sourceCode}
                      onChange={e => setNewProject({ ...newProject, sourceCode: e.target.value })}
                      placeholder="#"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1">Card Image file upload</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => convertToBase64AndAssign(e, 'project')}
                      className="text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-slate-100 file:cursor-pointer mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    {editingProjectId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{editingProjectId ? 'Update Creation' : 'Publish Creation'}</span>
                  </button>

                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setNewProject({ title: '', description: '', imageUrl: '', tech: '', liveUrl: '', sourceCode: '', category: 'web' });
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-slate-300 font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Dynamic list layout */}
              <div className="space-y-3 pt-4">
                <span className="text-xs uppercase font-mono tracking-widest text-slate-500 block">Published Creational nodes</span>
                
                {portfolioData.projects.map(p => (
                  <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-white/10">
                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{p.title}</h4>
                        <p className="text-[10px] font-mono text-neon-blue uppercase mt-1">/{p.category}</p>
                      </div>
                    </div>
                    {confirmDeleteProjectId === p.id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-red-400 font-mono animate-pulse uppercase">Are you sure?</span>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-2.5 py-1 rounded-md border border-red-500 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-bold cursor-pointer transition-colors shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteProjectId(null)}
                          className="px-2.5 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] uppercase font-bold cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleStartEditProject(p)}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-all duration-200"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteProjectId(p.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all duration-200"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 4. SKILLS & SERVICES MANAGER */}
          {activeTab === 'skills-services' && (
            <div className="space-y-8">
              
              {/* Skills configurations */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white border-b border-white/5 pb-2 uppercase">Core Skill Matrix</h3>
                
                {/* Form to append skill */}
                <form onSubmit={handleAddSkill} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono flex flex-wrap gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Skill Name</label>
                    <input 
                      type="text" 
                      required
                      value={newSkill.name}
                      onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g. Next-JS"
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white font-sans w-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Skill Level (%)</label>
                    <input 
                      type="number" 
                      required
                      min={0}
                      max={100}
                      value={newSkill.level}
                      onChange={e => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white w-20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white h-[28px]"
                    >
                      <option value="frontend">Client Frontend</option>
                      <option value="backend">Database & APIs</option>
                      <option value="ai">AI Tools</option>
                      <option value="other">Creative Design</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-neon-purple text-white rounded-lg font-semibold hover:bg-neon-purple/80 cursor-pointer transition-all"
                    >
                      <span>{editingSkillId ? 'Update Skill' : 'Add Skill'}</span>
                    </button>
                    {editingSkillId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSkillId(null);
                          setNewSkill({ name: '', level: 80, category: 'frontend' });
                        }}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg cursor-pointer font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Skills render list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {portfolioData.skills.map(sk => (
                    <div key={sk.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-left">
                      <div>
                        <span className="text-sm font-semibold text-slate-200">{sk.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-mono text-neon-blue uppercase leading-none">{sk.category}</span>
                          <span className="text-[10px] text-slate-500 font-mono leading-none">● {sk.level}%</span>
                        </div>
                      </div>
                      {confirmDeleteSkillId === sk.id ? (
                        <div className="flex items-center space-x-1.5 font-mono">
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[9.5px] uppercase font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            Del
                          </button>
                          <button
                            onClick={() => setConfirmDeleteSkillId(null)}
                            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[9.5px] uppercase font-bold cursor-pointer transition-colors"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingSkillId(sk.id);
                              setNewSkill({ name: sk.name, level: sk.level, category: sk.category });
                            }}
                            className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-all"
                            title="Edit skill"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteSkillId(sk.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all"
                            title="Delete skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Service configurations */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-lg font-bold font-display text-white border-b border-white/5 pb-2 uppercase">Operational Services</h3>
                
                {/* Form to append service */}
                <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono space-y-3 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase text-slate-500">Service Title</label>
                      <input 
                        type="text" 
                        required
                        value={newService.title}
                        onChange={e => setNewService({ ...newService, title: e.target.value })}
                        placeholder="Web Optimization"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase text-slate-500">Visual Icon</label>
                      <select
                        value={newService.icon}
                        onChange={e => setNewService({ ...newService, icon: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white h-[28px]"
                      >
                        <option value="Code">Code (Developers)</option>
                        <option value="Smartphone">Smartphone (Responsive Apps)</option>
                        <option value="Palette">Palette (UX Visual Designer)</option>
                        <option value="Database">Database (API Architect)</option>
                        <option value="TrendingUp">TrendingUp (Performance Auditor)</option>
                      </select>
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-3">
                      <label className="text-[9px] uppercase text-slate-500">Short capabilities sentence</label>
                      <input 
                        type="text" 
                        required
                        value={newService.description}
                        onChange={e => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Detailed optimization auditing for core Web vites scoring."
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-white/10 focus:border-neon-purple outline-none text-white font-sans"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-neon-blue text-white rounded-lg font-semibold hover:bg-neon-blue/80 cursor-pointer transition-all"
                    >
                      <span>{editingServiceId ? 'Update Service' : 'Publish Service'}</span>
                    </button>
                    {editingServiceId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingServiceId(null);
                          setNewService({ icon: 'Code', title: '', description: '' });
                        }}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg cursor-pointer font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Services render list */}
                <div className="space-y-2 max-h-62 overflow-y-auto pr-2">
                  {portfolioData.services.map(sv => (
                    <div key={sv.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-left">
                      <div>
                        <span className="text-sm font-semibold text-slate-200">{sv.title}</span>
                        <p className="text-xs text-slate-400 font-sans mt-0.5 line-clamp-1">{sv.description}</p>
                      </div>
                      {confirmDeleteServiceId === sv.id ? (
                        <div className="flex items-center space-x-1.5 font-mono">
                          <button
                            onClick={() => handleDeleteService(sv.id)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[9.5px] uppercase font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            Del
                          </button>
                          <button
                            onClick={() => setConfirmDeleteServiceId(null)}
                            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[9.5px] uppercase font-bold cursor-pointer transition-colors"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingServiceId(sv.id);
                              setNewService({ icon: sv.icon || 'Code', title: sv.title, description: sv.description });
                            }}
                            className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-all"
                            title="Edit service"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteServiceId(sv.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all"
                            title="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 5. MESSAGES INBOX PANEL */}
          {activeTab === 'messages' && (
            <div className="space-y-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 uppercase">Customer Messages</h3>
              
              {messages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5 max-w-sm mx-auto flex-grow flex flex-col justify-center items-center">
                  <Mail className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p className="text-slate-400 text-sm mt-3 font-semibold">Inbox is clear</p>
                  <p className="text-xs text-slate-500 mt-1">No custom connection triggers recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 flex-grow">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-5 rounded-2xl border text-left relative overflow-hidden transition-all ${
                        msg.read 
                          ? 'bg-slate-900/20 border-white/5' 
                          : 'bg-[#1c1432]/30 border-neon-purple/40 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-white/5 mb-3">
                        <div>
                          <span className="text-xs font-bold text-white uppercase">{msg.name}</span>
                          <span className="text-[10px] font-mono text-neon-blue block uppercase mt-0.5">{msg.email}</span>
                          {msg.phone && (
                            <span className="text-[10px] font-mono text-neon-pink block uppercase mt-0.5">Phone: {msg.phone}</span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-white tracking-tight">Subject: {msg.subject}</span>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">{msg.message}</p>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5 mt-4 text-[10px] font-mono">
                        <button
                          onClick={() => handleToggleRead(msg.id)}
                          className={`px-2.5 py-1 rounded-md border text-[9px] uppercase font-bold cursor-pointer transition-colors ${
                            msg.read 
                              ? 'border-white/10 bg-white/5 text-slate-400' 
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>

                        <button
                          onClick={() => handleMarkReplied(msg.id)}
                          disabled={msg.replied}
                          className={`px-2.5 py-1 rounded-md border text-[9px] uppercase font-bold cursor-pointer transition-colors ${
                            msg.replied 
                              ? 'border-white/5 bg-white/5 text-slate-500' 
                              : 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue'
                          }`}
                        >
                          {msg.replied ? '✔ Answered' : 'Mark Answered'}
                        </button>

                        {confirmDeleteId === msg.id ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] text-red-400 font-mono animate-pulse uppercase">Are you sure?</span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-2.5 py-1 rounded-md border border-red-500 bg-red-600 hover:bg-red-700 text-white text-[9px] uppercase font-bold cursor-pointer transition-colors shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] uppercase font-bold cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(msg.id)}
                            className="px-2.5 py-1 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/30 text-red-400 text-[9px] uppercase font-bold cursor-pointer transition-colors"
                          >
                            <span>Delete Message</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 6. CHATBOT PARAMETERS EDIT CHANNELS */}
          {activeTab === 'chatbot' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold font-display text-white uppercase flex items-center space-x-2">
                  <span>AI Companion Control</span>
                </h3>
                <button 
                  onClick={saveGlobalSettings}
                  disabled={savingState}
                  className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(138,43,226,0.15)] hover:scale-103 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1" />
                  <span>{savingState && saveSuccess === 'settings' ? 'Saving...' : 'Save AI Parameters'}</span>
                </button>
              </div>

              {saveSuccess === 'settings' && <p className="text-xs text-emerald-400 font-mono uppercase">✔ Chatbot settings synchronized cleanly!</p>}

              <div className="space-y-5 flex-grow">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block uppercase">Toggle Active Status</span>
                    <span className="text-[10px] text-slate-400">Allows visitors to consult the companion floating widget.</span>
                  </div>
                  
                  <button
                    onClick={() => setSettingsForm({ ...settingsForm, chatbotEnabled: !settingsForm.chatbotEnabled })}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors ${
                      settingsForm.chatbotEnabled 
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                        : 'bg-red-500/20 border border-red-500/40 text-red-400'
                    }`}
                  >
                    {settingsForm.chatbotEnabled ? 'COMPANION ACTIVE' : 'COMPANION SLEEP'}
                  </button>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Select AI Chatbot Provider</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, chatbotProvider: 'gemini' })}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all flex flex-col items-center justify-center space-y-1 ${
                        (settingsForm.chatbotProvider || 'gemini') === 'gemini'
                          ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-neon-blue/60 text-neon-blue shadow-[0_0_15px_rgba(0,191,255,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>🤖 GOOGLE GEMINI</span>
                      <span className="text-[8px] opacity-75 font-normal">Fast, Contextual Q&A</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, chatbotProvider: 'openai' })}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all flex flex-col items-center justify-center space-y-1 ${
                        settingsForm.chatbotProvider === 'openai'
                          ? 'bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 border-neon-pink/60 text-neon-pink shadow-[0_0_15px_rgba(244,114,182,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>⚡ OPENAI API</span>
                      <span className="text-[8px] opacity-75 font-normal">GPT-4o Intelligent Reasoning</span>
                    </button>
                  </div>
                </div>

                {(settingsForm.chatbotProvider || 'gemini') === 'gemini' ? (
                  <div className="space-y-1 text-left border-l-2 border-neon-blue pl-4 py-1">
                    <label className="text-[10px] font-mono uppercase text-[#00bfff] flex items-center space-x-1">
                      <span>Google Gemini custom API Key (Optional)</span>
                    </label>
                    <input 
                      type="password" 
                      value={settingsForm.geminiApiKey || settingsForm.customApiKey || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, geminiApiKey: e.target.value, customApiKey: e.target.value })}
                      placeholder="Leave empty to use pre-provisioned developer environment key..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none text-xs text-white placeholder-slate-500"
                    />
                    <p className="text-[10px] font-sans text-slate-500 leading-normal pt-1">
                      By default, using Gemini 3.5 Flash via pre-injected environment parameters. Update here to override with personal keys.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 border-l-2 border-neon-pink pl-4 py-1">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-neon-pink">OpenAI API Key (Required for OpenAI Mode)</label>
                      <input 
                        type="password" 
                        value={settingsForm.openaiApiKey || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, openaiApiKey: e.target.value })}
                        placeholder="sk-proj-..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-pink outline-none text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">OpenAI Model Target</label>
                      <input 
                        type="text" 
                        value={settingsForm.openaiModel || 'gpt-4o-mini'}
                        onChange={e => setSettingsForm({ ...settingsForm, openaiModel: e.target.value })}
                        placeholder="gpt-4o-mini"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-pink outline-none text-xs text-white"
                      />
                      <p className="text-[9px] font-sans text-slate-500 leading-normal">
                        Defaulting to <span className="font-mono text-slate-400">gpt-4o-mini</span>. You can switch to any other chat model you have access to.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Quick replies array (Comma separated)</label>
                  <input 
                    type="text" 
                    value={settingsForm.quickReplies?.join(', ') || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, quickReplies: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Web Development, Pricing Plans"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-purple outline-none text-xs text-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* 7. GLOBAL MASTER CONFIGS CHANNEL */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold font-display text-white uppercase flex items-center space-x-2">
                  <span>Logo & Coordinates settings</span>
                </h3>
                <button 
                  onClick={saveGlobalSettings}
                  disabled={savingState}
                  className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(138,43,226,0.15)] hover:scale-103 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1" />
                  <span>{savingState && saveSuccess === 'settings' ? 'Saving...' : 'Save configs'}</span>
                </button>
              </div>

              {saveSuccess === 'settings' && <p className="text-xs text-emerald-400 font-mono uppercase">✔ Global systems nodes synchronized cleanly!</p>}

              <div className="space-y-4 py-2">
                {/* 1. Cyber Logo Identity Control */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                  <h4 className="text-xs font-mono font-bold text-neon-pink uppercase">1. Cyber Logo Identity Control</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Website Title (Fallback logo text)</label>
                      <input 
                        type="text" 
                        value={settingsForm.websiteTitle || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, websiteTitle: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Custom Brand Logo Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. SANJEEVI"
                        value={settingsForm.logoText || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Logo Type Mode</label>
                      <select
                        value={settingsForm.logoType || 'icon'}
                        onChange={e => setSettingsForm({ ...settingsForm, logoType: e.target.value as 'icon' | 'image' })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#0e0a1f] text-white border border-white/10 focus:border-neon-purple outline-none"
                      >
                        <option value="icon">Cyber Symbol / Icon</option>
                        <option value="image">Custom Uploaded Logo Image</option>
                      </select>
                    </div>

                    {settingsForm.logoType === 'image' ? (
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono uppercase text-slate-400 font-bold text-neon-blue">Logo Image (URL or Local File)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Image Url..."
                            value={settingsForm.logoImageUrl || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, logoImageUrl: e.target.value })}
                            className="flex-grow px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none h-9"
                          />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => convertToBase64AndAssign(e, 'logo')}
                            className="text-[10.5px] text-slate-400 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white/15 file:text-white file:text-[10px] file:cursor-pointer mt-0.5"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono uppercase text-slate-400">Select Cyber Vector Icon</label>
                        <select
                          value={settingsForm.logoIconName || 'Terminal'}
                          onChange={e => setSettingsForm({ ...settingsForm, logoIconName: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#0e0a1f] text-white border border-white/10 focus:border-neon-purple outline-none"
                        >
                          <option value="Terminal">Terminal (&gt;_)</option>
                          <option value="Sparkles">Sparkles (✦)</option>
                          <option value="Briefcase">Briefcase (💼)</option>
                          <option value="Cpu">CPU (💻)</option>
                          <option value="Code">Code (&lt;&gt;)</option>
                          <option value="Flame">Flame (🔥)</option>
                          <option value="Zap">Zap (⚡)</option>
                          <option value="Atom">Atom (⚛)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Interactive Hero Banner Backdrop Control */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                  <h4 className="text-xs font-mono font-bold text-neon-blue uppercase">2. Interactive Hero Banner Backdrop Control</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Banner Background Theme Mode</label>
                      <select
                        value={settingsForm.bannerBgType || 'glow'}
                        onChange={e => setSettingsForm({ ...settingsForm, bannerBgType: e.target.value as 'glow' | 'image' })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#0e0a1f] text-white border border-white/10 focus:border-neon-purple outline-none"
                      >
                        <option value="glow">Futuristic Radial Ambient Glow Only</option>
                        <option value="image">Premium Background Image with Overlay Glow</option>
                      </select>
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Cyber Grid Background Pattern</label>
                      <select
                        value={settingsForm.bannerShowGrid === false ? 'false' : 'true'}
                        onChange={e => setSettingsForm({ ...settingsForm, bannerShowGrid: e.target.value === 'true' })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#0e0a1f] text-white border border-white/10 focus:border-neon-purple outline-none"
                      >
                        <option value="true">Enable Digital Holographic Grid</option>
                        <option value="false">Disable Digital Grid (Clean Canvas)</option>
                      </select>
                    </div>

                    {settingsForm.bannerBgType === 'image' && (
                      <div className="space-y-1 text-left col-span-1 sm:col-span-2">
                        <label className="text-[10px] font-mono uppercase text-slate-400 font-bold text-neon-blue">Banner Background (URL or Local File)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Image Url link..."
                            value={settingsForm.bannerBgImageUrl || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, bannerBgImageUrl: e.target.value })}
                            className="flex-grow px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none h-9"
                          />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => convertToBase64AndAssign(e, 'banner')}
                            className="text-[10.5px] text-slate-400 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white/15 file:text-white file:text-[10px] file:cursor-pointer mt-0.5"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Primary Banner Bloom Color</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          value={settingsForm.bannerGlow1 || '#9333ea'}
                          onChange={e => setSettingsForm({ ...settingsForm, bannerGlow1: e.target.value })}
                          className="w-10 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{settingsForm.bannerGlow1 || '#9333ea'}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Secondary Banner Bloom Color</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          value={settingsForm.bannerGlow2 || '#3b82f6'}
                          onChange={e => setSettingsForm({ ...settingsForm, bannerGlow2: e.target.value })}
                          className="w-10 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{settingsForm.bannerGlow2 || '#3b82f6'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Coordinates & Links */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                  <h4 className="text-xs font-mono font-bold text-neon-purple uppercase">3. Developer Coordinates & Social Profiles</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Resume/CV download link</label>
                      <input 
                        type="text" 
                        value={settingsForm.resumeUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">GitHub Profile URL</label>
                      <input 
                        type="text" 
                        value={settingsForm.githubUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">LinkedIn Profile URL</label>
                      <input 
                        type="text" 
                        value={settingsForm.linkedinUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">Twitter Profile URL</label>
                      <input 
                        type="text" 
                        value={settingsForm.twitterUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono uppercase text-slate-400">YouTube Channel URL</label>
                      <input 
                        type="text" 
                        placeholder="e.g. https://youtube.com/c/yourchannel"
                        value={settingsForm.youtubeUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 text-white border border-white/10 focus:border-neon-purple outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Resume Management System (Live Upload & View) */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-neon-pink uppercase flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>4. Dynamic Resume/CV File Assistant</span>
                    </h4>
                    {resumeInfo && (
                      <span className="text-[9px] font-mono bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded uppercase">
                        ACTIVE FILE LOADED
                      </span>
                    )}
                  </div>

                  {/* Active Resume Card */}
                  {resumeInfo ? (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white font-mono break-all flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-neon-pink animate-pulse"></span>
                            {resumeInfo.fileName}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono">
                            <span>Size: {(resumeInfo.fileSize / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>Type: {resumeInfo.contentType}</span>
                            {resumeInfo.uploadedAt && (
                              <>
                                <span>•</span>
                                <span>Uploaded: {new Date(resumeInfo.uploadedAt).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Download / View Control Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a 
                          href="/api/resume/view" 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 text-[10px] font-mono uppercase bg-neon-purple/20 hover:bg-neon-purple/40 border border-neon-purple/40 text-white rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Live CV Inline</span>
                        </a>
                        <a 
                          href="/api/resume/download" 
                          download
                          className="px-3 py-1.5 text-[10px] font-mono uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Active Copy</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center py-6">
                      <p className="text-xs text-slate-400 font-mono">No uploaded resume PDF is recorded yet.</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Seeded default is active. Drag over or use the picker below to upload your custom file.</p>
                    </div>
                  )}

                  {/* Drag and Drop Zone Container */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { 
                      e.preventDefault(); 
                      setIsDragOver(false); 
                      if (e.dataTransfer.files?.[0]) { 
                        handleUploadResumeFile(e.dataTransfer.files[0]); 
                      } 
                    }}
                    onClick={() => document.getElementById('resume-file-picker')?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                      isDragOver 
                        ? 'border-neon-pink bg-neon-pink/5 scale-[1.01]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="resume-file-picker"
                      accept=".pdf,.docx,.jpg,.png,.txt"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadResumeFile(e.target.files[0]);
                        }
                      }}
                      className="hidden" 
                    />
                    
                    {resumeUploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                        <p className="text-xs font-mono text-slate-300 uppercase tracking-widest">TRANSMITTING FILE SECURELY...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center flex-grow">
                        <div className="p-3 bg-white/5 rounded-full text-slate-400 group-hover:text-white transition-all">
                          <Upload className="w-5 h-5 text-neon-pink animate-bounce" />
                        </div>
                        <p className="text-xs font-semibold text-white">
                          Drag & Drop Resume/CV File Here
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Or click here to browse files (PDF, DOCX, PNG, JPG, TXT up to 8MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Errors / Success Status Banners */}
                  {resumeUploadError && (
                    <div className="p-3 rounded-lg bg-red-400/15 border border-red-400/25 flex items-center space-x-2 text-red-400 text-xs text-left">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{resumeUploadError}</span>
                    </div>
                  )}

                  {resumeUploadSuccess && (
                     <div className="p-3 rounded-lg bg-emerald-400/15 border border-emerald-400/25 flex items-center space-x-2 text-emerald-400 text-xs text-left">
                       <Check className="w-4 h-4 flex-shrink-0" />
                       <span>Resume has been updated on cloud dashboard! Default resume links are now bound to it.</span>
                     </div>
                  )}
                </div>
              </div>

              {/* INTERACTIVE STYLE CUSTOMIZER SECTION */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center space-x-2 text-neon-blue mb-3 text-left">
                  <Sparkles className="w-4 h-4 animate-pulse text-neon-pink" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Cyber Theme & Design Console</span>
                </div>

                <div className="space-y-6">
                  {/* Part A: Choose Preset Theme */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Cyber Accent Presets</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'purple', name: 'Classic Neon' },
                        { id: 'blue', name: 'Cyber Indigo' },
                        { id: 'pink', name: 'Sunset Synth' },
                        { id: 'emerald', name: 'Bio Emerald' },
                        { id: 'sunset', name: 'Solar Flare' },
                        { id: 'cyberpunk', name: 'Neon Tokyo' },
                        { id: 'mono', name: 'Cyber Slate' },
                        { id: 'custom', name: 'Manual Overrides' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, themePreset: item.id })}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center h-12 ${
                            (settingsForm.themePreset || 'purple') === item.id
                              ? 'border-neon-purple bg-neon-purple/10 text-white font-bold'
                              : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] block truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Part B: Manual Color Overrides */}
                  {settingsForm.themePreset === 'custom' && (
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left space-y-3">
                      <span className="text-[10px] font-mono uppercase text-neon-pink block">Manual Neural Overrides</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase text-slate-400 block">Primary Glow</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="color" 
                              value={settingsForm.customPurple || '#9333ea'}
                              onChange={e => setSettingsForm({ ...settingsForm, customPurple: e.target.value })}
                              className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate-400">{settingsForm.customPurple || '#9333ea'}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase text-slate-400 block">Secondary Glow</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="color" 
                              value={settingsForm.customBlue || '#3b82f6'}
                              onChange={e => setSettingsForm({ ...settingsForm, customBlue: e.target.value })}
                              className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate-400">{settingsForm.customBlue || '#3b82f6'}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase text-slate-400 block">Highlight Accent</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="color" 
                              value={settingsForm.customPink || '#ec4899'}
                              onChange={e => setSettingsForm({ ...settingsForm, customPink: e.target.value })}
                              className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate-400">{settingsForm.customPink || '#ec4899'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part C: Profile Art Geometry */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Profile Art Geometry shape</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'circle', label: 'Orbiter Circle' },
                        { id: 'hexagon', label: 'Neural Hexagon' },
                        { id: 'octagon', label: 'Cyber Shield' },
                        { id: 'diamond', label: 'Hyper Diamond' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, artShape: item.id })}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center h-12 ${
                            (settingsForm.artShape || 'circle') === item.id
                              ? 'border-neon-pink bg-neon-pink/10 text-white font-bold'
                              : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] block truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Part D: Primary Interaction Buttons */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase text-slate-400">System Click Node styles</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'glow', label: 'Glow Capsule' },
                        { id: 'sharp', label: 'Sharp Monolith' },
                        { id: 'cyber-pill', label: 'Sleek Pill' },
                        { id: 'glitch', label: 'Slanted Glitch' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, buttonStyle: item.id })}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center h-12 ${
                            (settingsForm.buttonStyle || 'glow') === item.id
                              ? 'border-neon-blue bg-neon-blue/10 text-white font-bold'
                              : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] block truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* DANGEROUS DISASTER CONTROL: HARD RESET ZONE */}
              <div className="mt-8 border-t border-red-500/20 pt-6">
                <div className="flex items-center space-x-2 text-red-400 mb-3 text-left">
                  <AlertCircle className="w-4 h-4 animate-pulse text-red-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">System Disaster Control Node</span>
                </div>

                <div className="p-4 bg-red-950/10 border border-red-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                  <div className="space-y-1 max-w-md">
                    <span className="text-xs font-bold text-red-400 block uppercase font-display">Neural State Hard Reset</span>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Wipes all local backups, clears dynamic chat telemetry, removes portfolio edits, and cleanly re-seeds default settings templates in the database. <strong>This operation is irreversible.</strong>
                    </p>
                  </div>

                  <button
                    onClick={triggerHardReset}
                    disabled={resetState === 'resetting'}
                    className={`px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase cursor-pointer transition-all duration-300 w-full sm:w-auto text-center flex items-center justify-center space-x-2 border min-w-[210px] ${
                      resetState === 'idle'
                        ? 'bg-red-950/20 border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                        : resetState === 'confirming'
                        ? 'bg-amber-500 border-amber-600 text-slate-950 font-black animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : resetState === 'resetting'
                        ? 'bg-blue-600 border-blue-700 text-white cursor-not-allowed'
                        : 'bg-emerald-500 border-emerald-600 text-slate-950 font-bold'
                    }`}
                  >
                    {resetState === 'idle' && (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>HARD RESET DATA</span>
                      </>
                    )}
                    
                    {resetState === 'confirming' && (
                      <>
                        <Terminal className="w-3.5 h-3.5 animate-pulse" />
                        <span>CONFIRM ({resetCountdown}s)</span>
                      </>
                    )}

                    {resetState === 'resetting' && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>WIPING STATE...</span>
                      </>
                    )}

                    {resetState === 'success' && (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>RESET COMPLETED!</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 9. CV / RESUME STRUCTURED DETAILS EDITOR */}
          {activeTab === 'resume' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
                    <FileText className="w-5 h-5 text-neon-blue" />
                    <span>CV / Interactive Resume Editor</span>
                  </h3>
                  <p className="text-slate-400 text-xs font-mono mt-1">
                    Manage the live structured timeline, framework competencies, and interactive profile snapshots.
                  </p>
                </div>
                
                <button
                  onClick={saveResumeDetailsData}
                  disabled={savingResumeDetails}
                  className="px-5 py-2.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/90 hover:to-neon-blue/90 text-white text-xs font-mono uppercase font-bold rounded-xl transition-all shadow-lg shadow-neon-purple/20 flex items-center gap-2 cursor-pointer"
                >
                  {savingResumeDetails ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingResumeDetails ? "Saving Configuration..." : "Commit CV Changes"}</span>
                </button>
              </div>

              {saveSuccess === 'resume_details' && (
                <div id="save-success-banner" className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Interactive resume credentials saved & live-synchronized with Firestore database successfully.</span>
                </div>
              )}

              {loadingResumeDetails ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                  <p className="text-slate-400 text-xs font-mono">Retrieving structured timeline schemas from cloud database...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Part A: Personal details and Snapshot */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-neon-pink font-bold pb-2 border-b border-white/5">
                      Personal Identity & Summary Header
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Full Professional Name</label>
                        <input 
                          type="text" 
                          value={resumeForm.fullName || ""}
                          onChange={e => setResumeForm({ ...resumeForm, fullName: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                          placeholder="e.g. Sanjeevi"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Interactive Role Subtitle</label>
                        <input 
                          type="text" 
                          value={resumeForm.subtitle || ""}
                          onChange={e => setResumeForm({ ...resumeForm, subtitle: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                          placeholder="e.g. Full-Stack Engineer & AI Craftsman"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Global Geographic Location</label>
                        <input 
                          type="text" 
                          value={resumeForm.location || ""}
                          onChange={e => setResumeForm({ ...resumeForm, location: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                          placeholder="e.g. San Francisco, CA (Remote)"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Direct Email Address</label>
                        <input 
                          type="text" 
                          value={resumeForm.email || ""}
                          onChange={e => setResumeForm({ ...resumeForm, email: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                        />
                      </div>
                      <div className="space-y-1 text-left md:col-span-2">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Contact Number (Optional)</label>
                        <input 
                          type="text" 
                          value={resumeForm.phone || ""}
                          onChange={e => setResumeForm({ ...resumeForm, phone: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                          placeholder="e.g. +1 (555) 019-2834"
                        />
                      </div>
                      <div className="space-y-1 text-left md:col-span-2">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Interactive Engineering Philosophy Statement</label>
                        <textarea 
                          rows={3}
                          value={resumeForm.philosophy || ""}
                          onChange={e => setResumeForm({ ...resumeForm, philosophy: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-sans leading-relaxed"
                          placeholder="State your software design or development thesis statement..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part B: Competencies & Framework Skills */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-xs font-mono uppercase text-neon-blue font-bold pb-2 border-b border-white/5">
                      Expert Competencies & Core Skills
                    </h4>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Framework Skills (Comma separated)</label>
                      <input 
                        type="text" 
                        value={resumeSkillsText}
                        onChange={e => setResumeSkillsText(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple font-mono"
                        placeholder="React, TypeScript, Node.js, Express, Tailwind CSS, Firestore, Google Cloud"
                      />
                      <p className="text-[10px] text-slate-500 font-mono">
                        These tags will display interactively inside the skills cloud container on the resume popover modal.
                      </p>
                    </div>
                  </div>

                  {/* Part C: Professional Experience Timeline */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="text-xs font-mono uppercase text-neon-pink font-bold">
                        Professional Work Experience Timeline
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedList = [...(resumeForm.experienceList || [])];
                          updatedList.push({
                            id: Date.now().toString(),
                            role: 'Software Architect / System Lead',
                            company: 'Independent Contractor',
                            duration: '2023 - PRESENT',
                            description: 'Architecting system micro-services'
                          });
                          setResumeForm({ ...resumeForm, experienceList: updatedList });
                        }}
                        className="px-3 py-1.5 bg-neon-pink/10 border border-neon-pink/30 hover:bg-neon-pink/20 text-neon-pink text-[10px] font-mono uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Timeline Node</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resumeForm.experienceList && resumeForm.experienceList.length > 0 ? (
                        resumeForm.experienceList.map((exp, index) => (
                          <div key={exp.id || index} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedList = resumeForm.experienceList.filter((_, idx) => idx !== index);
                                setResumeForm({ ...resumeForm, experienceList: updatedList });
                              }}
                              className="absolute top-4 right-4 p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                              title="Delete Timeline Node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Professional Role / Title</label>
                                <input 
                                  type="text" 
                                  value={exp.role || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.experienceList];
                                    updatedList[index].role = e.target.value;
                                    setResumeForm({ ...resumeForm, experienceList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple font-sans font-bold"
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Institution / Company</label>
                                <input 
                                  type="text" 
                                  value={exp.company || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.experienceList];
                                    updatedList[index].company = e.target.value;
                                    setResumeForm({ ...resumeForm, experienceList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple font-mono"
                                />
                              </div>

                              <div className="space-y-1 text-left pr-10">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Duration Period</label>
                                <input 
                                  type="text" 
                                  value={exp.duration || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.experienceList];
                                    updatedList[index].duration = e.target.value;
                                    setResumeForm({ ...resumeForm, experienceList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-purple font-mono"
                                  placeholder="e.g. 2022 - PRESENT"
                                />
                              </div>

                              <div className="space-y-1 text-left md:col-span-3">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Achievement Summary & Duties</label>
                                <textarea 
                                  rows={2}
                                  value={exp.description || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.experienceList];
                                    updatedList[index].description = e.target.value;
                                    setResumeForm({ ...resumeForm, experienceList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-neon-purple font-sans leading-relaxed"
                                  placeholder="Describe core initiatives, tech stack, and achievements..."
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 font-mono text-xs">
                          Your timeline path is empty. Press "Add Timeline Node" to architect your experience list history.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part D: Education & Certification schema */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="text-xs font-mono uppercase text-neon-blue font-bold">
                        Education background & Certifications
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedList = [...(resumeForm.educationList || [])];
                          updatedList.push({
                            id: Date.now().toString(),
                            degree: 'B.S. in Computer Science',
                            school: 'Technical State University',
                            duration: '2016 - 2020'
                          });
                          setResumeForm({ ...resumeForm, educationList: updatedList });
                        }}
                        className="px-3 py-1.5 bg-neon-blue/10 border border-neon-blue/30 hover:bg-neon-blue/20 text-neon-blue text-[10px] font-mono uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resumeForm.educationList && resumeForm.educationList.length > 0 ? (
                        resumeForm.educationList.map((edu, index) => (
                          <div key={edu.id || index} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedList = resumeForm.educationList.filter((_, idx) => idx !== index);
                                setResumeForm({ ...resumeForm, educationList: updatedList });
                              }}
                              className="absolute top-4 right-4 p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                              title="Delete Education Node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Degree / Certificate Name</label>
                                <input 
                                  type="text" 
                                  value={edu.degree || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.educationList];
                                    updatedList[index].degree = e.target.value;
                                    setResumeForm({ ...resumeForm, educationList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple font-sans font-bold"
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Educational Institution</label>
                                <input 
                                  type="text" 
                                  value={edu.school || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.educationList];
                                    updatedList[index].school = e.target.value;
                                    setResumeForm({ ...resumeForm, educationList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple font-mono"
                                />
                              </div>

                              <div className="space-y-1 text-left pr-10">
                                <label className="text-[9px] font-mono text-slate-500 uppercase">Passing out Year / Duration</label>
                                <input 
                                  type="text" 
                                  value={edu.duration || ""}
                                  onChange={e => {
                                    const updatedList = [...resumeForm.educationList];
                                    updatedList[index].duration = e.target.value;
                                    setResumeForm({ ...resumeForm, educationList: updatedList });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-purple font-mono"
                                  placeholder="e.g. 2020"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 font-mono text-xs">
                          No educational items present. Hit "Add Education" to document your degrees.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commit action bar */}
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={saveResumeDetailsData}
                      disabled={savingResumeDetails}
                      className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/90 hover:to-neon-blue/90 text-white text-xs font-mono uppercase font-bold rounded-xl transition-all shadow-lg shadow-neon-purple/20 flex items-center gap-2 cursor-pointer"
                    >
                      {savingResumeDetails ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{savingResumeDetails ? "Actively Syncing..." : "Publish CV Updates"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'design-fx' && (
            <div className="space-y-6 text-left">
              {/* Header Action Row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-3">
                <h3 className="text-xl font-bold font-display text-white uppercase flex items-center space-x-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-neon-pink font-display">Interactive Design & FX Lab</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <button 
                    onMouseEnter={() => playBeep('hover')}
                    onClick={() => {
                      playBeep('click');
                      setGridEnabled(true);
                      setGridColor('#4f46e5');
                      setGridSpeed(15);
                      setGridAngle(15);
                      setScanlineEnabled(true);
                      setScanlineSpeed(6);
                      setScanlineOpacity(0.12);
                      setGlowIntensity(80);
                      setGlowPulse(true);
                      setParticlesCount(20);
                      setParticleShape('sparkle');
                      setCardBorderPreset('neon-laser');
                      setFxSoundEnabled(true);
                      setFxSynthVolume(0.15);
                      setFxSynthWaveform('sine');
                      setFxSynthFrequency(440);
                      setFxAmbientHumEnabled(false);
                      setFxGlitchIntensity(30);
                      setFxChromaticOffset(4);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 font-mono transition-all flex items-center space-x-1 border border-white/10 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    <span>Reset Lab</span>
                  </button>
                  <button 
                    onMouseEnter={() => playBeep('hover')}
                    onClick={saveFxSettings}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-neon-pink rounded-xl text-xs text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)] hover:scale-103 cursor-pointer flex items-center space-x-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Laboratory</span>
                  </button>
                </div>
              </div>

              {saveSuccess === 'design-fx' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase rounded-xl animate-pulse">
                  ✔ Custom designs, color configurations, acoustic registers & graphics effects synchronized in active neural core!
                </div>
              )}

              {/* Bento Grid Splitter */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Parameters Controls Panel (lg:span-7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Cyber Accent Neural Models Bento Grid */}
                  <div className="p-6 rounded-2xl bg-[#0d0922]/80 border border-[#4f46e5]/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] space-y-4 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">0. Cyber Accent Neural Models (20 Coordinated Presets)</h4>
                      </div>
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                        Neural Core v1.2
                      </span>
                    </div>

                    {/* Active Preset HUD Display */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2 relative overflow-hidden">
                      {/* Grid background effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px]" />
                      
                      {activePresetId ? (
                        (() => {
                          const activePreset = CYBER_ACCENT_PRESETS.find(p => p.id === activePresetId);
                          if (!activePreset) return null;
                          return (
                            <div className="relative z-10 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[8px] font-mono uppercase text-slate-500 block">Active Preset Model</span>
                                  <h5 className="text-sm font-black font-mono uppercase tracking-tight" style={{ color: activePreset.color }}>
                                    {activePreset.name} <span className="text-xs text-slate-400 font-normal">({activePreset.codename})</span>
                                  </h5>
                                </div>
                                <span className="flex items-center space-x-1.5 text-[9px] font-mono text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  <span>SYNCHRONIZED</span>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 font-mono leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                                {activePreset.description}
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[9px] font-mono text-slate-400">
                                <div className="bg-white/5 px-2 py-1 rounded">
                                  <span className="text-slate-500 block">WAVEFORM</span>
                                  <span className="text-slate-200 uppercase font-bold">{activePreset.waveform}</span>
                                </div>
                                <div className="bg-white/5 px-2 py-1 rounded">
                                  <span className="text-slate-500 block">FREQUENCY</span>
                                  <span className="text-slate-200 font-bold">{activePreset.frequency} Hz</span>
                                </div>
                                <div className="bg-white/5 px-2 py-1 rounded">
                                  <span className="text-slate-500 block">GRID SPEED</span>
                                  <span className="text-slate-200 font-bold">{activePreset.speed}s cycle</span>
                                </div>
                                <div className="bg-white/5 px-2 py-1 rounded">
                                  <span className="text-slate-500 block">GRID SKEW</span>
                                  <span className="text-slate-200 font-bold">{activePreset.angle}° skew</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="relative z-10 text-center py-4 space-y-1">
                          <Cpu className="w-6 h-6 text-slate-500 mx-auto animate-pulse" />
                          <p className="text-[10px] font-mono text-slate-400">
                            No Active Preset Model Selected. Choose a model below to instantly re-architect coordinates.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                      {CYBER_ACCENT_PRESETS.map((preset) => {
                        const isSelected = activePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => applyCyberPreset(preset)}
                            className={`p-2 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-20 cursor-pointer relative overflow-hidden group ${
                              isSelected
                                ? 'bg-white/10 text-white'
                                : 'bg-[#0a0618]/60 hover:bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                            }`}
                            style={{
                              borderColor: isSelected ? preset.color : undefined,
                              boxShadow: isSelected ? `0 0 15px ${preset.color}33` : undefined
                            }}
                          >
                            {/* Accent Glow backdrop for hover/selected */}
                            <div 
                              className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full filter blur-xl opacity-20 transition-opacity group-hover:opacity-40"
                              style={{ backgroundColor: preset.color }}
                            />

                            <div className="flex items-center justify-between w-full relative z-10">
                              <span 
                                className="w-2 h-2 rounded-full shrink-0" 
                                style={{ 
                                  backgroundColor: preset.color,
                                  boxShadow: `0 0 8px ${preset.color}` 
                                }}
                              />
                              <span className="text-[8px] font-mono text-slate-500 tracking-wider group-hover:text-slate-300">
                                {preset.codename}
                              </span>
                            </div>

                            <div className="relative z-10 mt-auto">
                              <span className="text-[9px] font-mono font-bold uppercase block tracking-tight truncate leading-tight group-hover:text-white">
                                {preset.name.split(' ')[0]}
                              </span>
                              <span className="text-[8px] font-mono text-slate-500 block truncate leading-none">
                                {preset.name.split(' ')[1] || 'Core'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gridbackdrop configurations */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase">1. Gridbackdrop Space configurations</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Grid Toggle */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Grid Overlay backdrop</label>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setGridEnabled(true); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${gridEnabled ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            Enabled
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setGridEnabled(false); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${!gridEnabled ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            Disabled
                          </button>
                        </div>
                      </div>

                      {/* Grid Color Picker */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Grid Line Color</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <input 
                            type="color" 
                            value={gridColor} 
                            onChange={(e) => { setGridColor(e.target.value); }}
                            className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                          />
                          <span className="text-xs font-mono text-slate-300 uppercase">{gridColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Grid Scroll Speed Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Grid scroll Speed</span>
                          <span className="text-indigo-400 font-bold">{31 - gridSpeed}s cycle</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="30" 
                          value={gridSpeed} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setGridSpeed(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer bg-white/5 h-1.5 rounded"
                        />
                      </div>

                      {/* Perspective angle Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Perspective skew angle</span>
                          <span className="text-indigo-400 font-bold">{gridAngle}° Skew</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="45" 
                          value={gridAngle} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setGridAngle(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer bg-white/5 h-1.5 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scanline configurations */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <Cpu className="w-4 h-4 text-neon-pink" />
                      <h4 className="text-xs font-mono font-bold text-neon-pink uppercase">2. Cathode CRT Scanlines overlay</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Scanline Toggle */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Overlay CRT Scanlines</label>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setScanlineEnabled(true); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${scanlineEnabled ? 'bg-pink-600/20 border-neon-pink text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setScanlineEnabled(false); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${!scanlineEnabled ? 'bg-pink-600/20 border-neon-pink text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            Deactivated
                          </button>
                        </div>
                      </div>

                      {/* Scanline roll duration */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Scanline roll speed</span>
                          <span className="text-neon-pink font-bold">{11 - scanlineSpeed}s duration</span>
                        </div>
                        <input 
                          type="range" 
                          min="2" 
                          max="10" 
                          value={scanlineSpeed} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setScanlineSpeed(Number(e.target.value))}
                          className="w-full accent-neon-pink cursor-pointer bg-white/5 h-1.5 rounded mt-1.5"
                        />
                      </div>
                    </div>

                    {/* Scanline opacity Slider */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                        <span>CRT lines intensity (Opacity)</span>
                        <span className="text-neon-pink font-bold">{Math.round(scanlineOpacity * 100)}% density</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.03" 
                        max="0.35" 
                        step="0.01"
                        value={scanlineOpacity} 
                        onMouseDown={() => playBeep('hover')}
                        onChange={(e) => setScanlineOpacity(Number(e.target.value))}
                        className="w-full accent-neon-pink cursor-pointer bg-white/5 h-1.5 rounded"
                      />
                    </div>
                  </div>

                  {/* Aura Glow and sparkles */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">3. Aura glow & Ambient particles</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Aura Glow Intensity */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Neon radial Glow Intensity</span>
                          <span className="text-amber-400 font-bold">{glowIntensity}px glow radius</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="150" 
                          value={glowIntensity} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setGlowIntensity(Number(e.target.value))}
                          className="w-full accent-amber-400 cursor-pointer bg-white/5 h-1.5 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Glow Pulse Toggle */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase block">Glow breathing Pulse effect</label>
                          <div className="flex items-center space-x-3 mt-1">
                            <button
                              type="button"
                              onMouseEnter={() => playBeep('hover')}
                              onClick={() => { playBeep('click'); setGlowPulse(true); }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${glowPulse ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                            >
                              Pulsating
                            </button>
                            <button
                              type="button"
                              onMouseEnter={() => playBeep('hover')}
                              onClick={() => { playBeep('click'); setGlowPulse(false); }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${!glowPulse ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                            >
                              Static glow
                            </button>
                          </div>
                        </div>

                        {/* Particle Shapes dropdown */}
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-mono text-slate-400 uppercase block">Ambient Star Particle style</label>
                          <select
                            value={particleShape}
                            onChange={(e) => { playBeep('click'); setParticleShape(e.target.value as any); }}
                            className="w-full px-3 py-2 text-xs rounded-lg bg-[#0e0a1f] text-slate-200 border border-white/10 focus:border-amber-400 outline-none mt-1 h-9"
                          >
                            <option value="sparkle">✨ Retro Sparkle Crosses</option>
                            <option value="diamond">🔷 Cyber Diamonds</option>
                            <option value="circle">⚪ Neon Float Orbs</option>
                            <option value="hexagon">⬡ Quantum Hexagons</option>
                          </select>
                        </div>
                      </div>

                      {/* Sparkles count */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Floating star count (Density)</span>
                          <span className="text-amber-400 font-bold">{particlesCount} active emitters</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="45" 
                          value={particlesCount} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setParticlesCount(Number(e.target.value))}
                          className="w-full accent-amber-400 cursor-pointer bg-white/5 h-1.5 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* UI Acoustic Synthesizer Controller */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">4. Direct UI Acoustic Synthesizer Controller</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Audio Enable / Silence Toggle */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Synth Audio Core Status</label>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { setFxSoundEnabled(true); setTimeout(() => playBeep('success'), 30); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer flex items-center space-x-1 ${fxSoundEnabled ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Operational</span>
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => setFxSoundEnabled(false)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer flex items-center space-x-1 ${!fxSoundEnabled ? 'bg-red-500/20 border-red-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Silenced</span>
                          </button>
                        </div>
                      </div>

                      {/* Continuous Background Transformers Hum */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">60Hz Transformer Background Hum</label>
                        <div className="flex items-center space-x-3 mt-1">
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setFxAmbientHumEnabled(true); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${fxAmbientHumEnabled ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-transparent border-white/10 text-slate-400'}`}
                          >
                            Active Hum
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => playBeep('hover')}
                            onClick={() => { playBeep('click'); setFxAmbientHumEnabled(false); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${!fxAmbientHumEnabled ? 'bg-transparent border-white/10 text-slate-400' : 'bg-[#0a0d16] text-slate-500 border-white/5'}`}
                          >
                            Off
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Waveform type */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Oscillator Waveform Type</label>
                        <select
                          value={fxSynthWaveform}
                          onChange={(e) => { setFxSynthWaveform(e.target.value as any); setTimeout(() => playBeep('success'), 30); }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0e0a1f] text-slate-200 border border-white/10 focus:border-emerald-500 outline-none mt-1 h-9"
                        >
                          <option value="sine">sine Wave (Smooth & Soft)</option>
                          <option value="triangle">triangle Wave (Warm & Subtle)</option>
                          <option value="square">square Wave (Retro 8-Bit Chiptune)</option>
                          <option value="sawtooth">sawtooth Wave (Buzzing Sci-Fi Laser)</option>
                        </select>
                      </div>

                      {/* Pitch scale frequency */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Acoustic Base Frequency</span>
                          <span className="text-emerald-400 font-bold">{fxSynthFrequency} Hz</span>
                        </div>
                        <input 
                          type="range" 
                          min="100" 
                          max="1200" 
                          value={fxSynthFrequency} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setFxSynthFrequency(Number(e.target.value))}
                          className="w-full accent-emerald-400 cursor-pointer bg-white/5 h-1.5 rounded mt-3"
                        />
                      </div>
                    </div>

                    {/* Volume and Test Trigger Row */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Synthesizer Gain (Volume)</span>
                          <span className="text-emerald-400 font-bold">{Math.round(fxSynthVolume * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.02" 
                          max="0.4" 
                          step="0.01"
                          value={fxSynthVolume} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setFxSynthVolume(Number(e.target.value))}
                          className="w-full accent-emerald-400 cursor-pointer bg-white/5 h-1.5 rounded"
                        />
                      </div>

                      {/* Direct sound test buttons */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Acoustic Signal Diagnostics:</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            { label: 'Hover Click', type: 'hover' as const },
                            { label: 'Active Tap', type: 'click' as const },
                            { label: 'Handshake OK', type: 'success' as const },
                            { label: 'Warning Reject', type: 'fail' as const },
                            { label: 'Quantum Glitch', type: 'glitch' as const }
                          ].map((b) => (
                            <button
                              key={b.label}
                              type="button"
                              onClick={() => playBeep(b.type)}
                              className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-[10px] font-mono text-slate-300 rounded transition-all cursor-pointer"
                            >
                              🔊 {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantum Glitch Overrides */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <Activity className="w-4 h-4 text-neon-pink shrink-0 animate-pulse" />
                      <h4 className="text-xs font-mono font-bold text-neon-pink uppercase">5. Quantum Glitch & Chromatic Overrides</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Aberration splitting */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                          <span>Chromatic Aberration offset</span>
                          <span className="text-neon-pink font-bold">{fxChromaticOffset} px split</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="15" 
                          value={fxChromaticOffset} 
                          onMouseDown={() => playBeep('hover')}
                          onChange={(e) => setFxChromaticOffset(Number(e.target.value))}
                          className="w-full accent-neon-pink cursor-pointer bg-white/5 h-1.5 rounded mt-3"
                        />
                      </div>

                      {/* Manual trigger override */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block">Manual Circuit Override</label>
                        <button
                          type="button"
                          onMouseEnter={() => playBeep('hover')}
                          onClick={() => {
                            setFxGlitchActive(true);
                            playBeep('glitch');
                            setTimeout(() => setFxGlitchActive(false), 300);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-red-500/20 to-neon-pink/20 hover:from-red-500/30 hover:to-neon-pink/30 border border-red-500/30 hover:border-neon-pink/50 rounded-xl text-xs font-mono text-red-300 font-bold transition-all uppercase flex items-center justify-center space-x-1 cursor-pointer h-10 mt-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping mr-1" />
                          <span>Trigger Glitch simulation</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Telemetry HUD Terminal Console */}
                  <div className="p-6 rounded-2xl bg-black/80 border border-indigo-500/20 space-y-4 text-left">
                    <div className="flex justify-between items-center border-b border-indigo-500/20 pb-2">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase">6. Cyber Terminal command shell console</h4>
                      </div>
                      <span className="text-[8px] font-mono text-indigo-500 tracking-wider">DIRECT ADDRESS SHELL v1.07</span>
                    </div>

                    {/* Shell Output log window */}
                    <div className="h-44 rounded-xl bg-black border border-white/5 p-3 overflow-y-auto font-mono text-[10px] space-y-2 text-left">
                      {terminalLog.map((log, index) => (
                        <div 
                          key={index}
                          className={`${
                            log.type === 'system' ? 'text-indigo-400 font-semibold' :
                            log.type === 'input' ? 'text-slate-400' :
                            log.type === 'success' ? 'text-emerald-400' :
                            log.type === 'error' ? 'text-red-400 font-bold animate-pulse' :
                            'text-amber-400/80'
                          } whitespace-pre-wrap leading-relaxed`}
                        >
                          {log.text}
                        </div>
                      ))}
                    </div>

                    {/* Command form field */}
                    <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                      <div className="relative flex-grow">
                        <span className="absolute left-3 top-2 text-indigo-400 font-mono text-xs font-bold">&gt;</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type 'help' for station directives & grid commands..."
                          className="w-full pl-7 pr-3 py-2 text-xs rounded-xl bg-black text-emerald-400 border border-indigo-500/20 focus:border-emerald-500 font-mono focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-xs font-mono text-indigo-300 uppercase font-bold rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        Run
                      </button>
                    </form>
                  </div>

                  {/* Card Border Presets */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left">
                    <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                      <SettingsIcon className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">7. Cyber Frame border preset styles</h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'glass', name: 'Ambient Glass', desc: 'Minimal frosting' },
                        { id: 'solid-glowing', name: 'Solid Glowing', desc: 'Intense outer aura' },
                        { id: 'double-neon', name: 'Double Frame', desc: 'Double neon stroke' },
                        { id: 'neon-laser', name: 'Laser Beam', desc: 'Pulsing color border' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onMouseEnter={() => playBeep('hover')}
                          onClick={() => { playBeep('click'); setCardBorderPreset(preset.id as any); }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                            cardBorderPreset === preset.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                              : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] font-bold block truncate">{preset.name}</span>
                          <span className="text-[8px] font-mono text-slate-500 block truncate">{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side: LIVE FX PLAYGROUND PREVIEW STAGE (lg:span-5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="p-5 rounded-2xl bg-[#080a13] border border-white/5 flex flex-col h-full min-h-[500px] relative overflow-hidden group">
                    {/* Perspective Outer Container wrapper */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                      {gridEnabled && (
                        <div 
                          className="absolute inset-0 cyber-grid animate-grid-scroll"
                          style={{
                            '--grid-duration': `${31 - gridSpeed}s`,
                            transform: `perspective(400px) rotateX(${gridAngle}deg)`,
                            transformOrigin: 'top center',
                            borderColor: gridColor,
                            backgroundImage: `linear-gradient(${gridColor}0a 1px, transparent 1px), linear-gradient(90deg, ${gridColor}0a 1px, transparent 1px)`
                          } as any}
                        />
                      )}
                    </div>

                    {/* CRT Scanline layers overlay */}
                    {scanlineEnabled && (
                      <div 
                        className="absolute inset-0 z-10 pointer-events-none cyber-scanline-overlay"
                        style={{
                          '--scanline-brightness': scanlineOpacity,
                          '--scanline-duration': `${11 - scanlineSpeed}s`
                        } as any}
                      />
                    )}

                    {/* Interactive Particle Emitter Layer */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                      {Array.from({ length: particlesCount }).map((_, i) => {
                        const delay = i * 0.15;
                        const left = (i * 27) % 95;
                        const top = (i * 19) % 90;
                        const duration = 2 + (i % 4);
                        return (
                          <div 
                            key={i}
                            className="absolute animate-pulse"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              animationDelay: `${delay}s`,
                              animationDuration: `${duration}s`,
                              color: i % 2 === 0 ? gridColor : '#ec4899'
                            }}
                          >
                            {particleShape === 'sparkle' && <span className="text-[8px]">✦</span>}
                            {particleShape === 'diamond' && <span className="text-[6px]">♦</span>}
                            {particleShape === 'circle' && <span className="text-[6px]">●</span>}
                            {particleShape === 'hexagon' && <span className="text-[8px]">⬡</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Stage Label Tab */}
                    <div className="relative z-10 flex justify-between items-center pb-3 border-b border-white/5">
                      <div className="flex items-center space-x-2 text-left">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">LIVE TELEMETRY PLAYGROUND</span>
                      </div>
                      <span className="text-[8px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">STAGE 01</span>
                    </div>

                    {/* Actual Simulated Card Node Element (Centered on Stage) */}
                    <div className="flex-grow flex items-center justify-center p-4 relative z-10">
                      
                      <div 
                        className={`w-full max-w-sm rounded-2xl p-6 relative flex flex-col space-y-4 bg-black/60 backdrop-blur-md text-left transition-all duration-300 ${
                          fxGlitchActive ? 'skew-x-3 scale-98 select-none' : ''
                        } ${
                          cardBorderPreset === 'glass' ? 'border border-white/10 shadow-xl' :
                          cardBorderPreset === 'solid-glowing' ? 'border border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' :
                          cardBorderPreset === 'double-neon' ? 'border-2 border-double border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]' :
                          'animate-neon-pulse border border-indigo-500'
                        }`}
                        style={{
                          boxShadow: glowPulse 
                            ? undefined 
                            : `0 0 ${glowIntensity / 3}px rgba(99,102,241,${glowIntensity / 150})`
                        }}
                      >
                        {/* Laser line effect inside Laser Beam preset */}
                        {cardBorderPreset === 'neon-laser' && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-laser-sweep z-20" />
                        )}

                        {/* Top Header Badge */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-400 block">SYSTEM CORE</span>
                            <h5 
                              className="text-sm font-black text-white font-display uppercase tracking-tight"
                              style={{
                                textShadow: fxGlitchActive 
                                  ? `${fxChromaticOffset}px 0 0 rgba(255,0,0,0.6), -${fxChromaticOffset}px 0 0 rgba(0,255,255,0.6)` 
                                  : undefined
                              }}
                            >
                              {portfolioData.hero.name || 'SANJEEVI'}
                            </h5>
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">ACTIVE NODE</span>
                        </div>

                        {/* Middle Tech description */}
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                          <p 
                            className="text-[10px] text-slate-300 font-mono leading-relaxed"
                            style={{
                              textShadow: fxGlitchActive 
                                ? `${fxChromaticOffset}px 0 0 rgba(255,0,0,0.4), -${fxChromaticOffset}px 0 0 rgba(0,255,255,0.4)` 
                                : undefined
                            }}
                          >
                            {portfolioData.hero.title || 'Architecting highly-interactive cybernetic interface environments.'}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {['TypeScript', 'React 18', 'Dynamic FX'].map(t => (
                              <span key={t} className="text-[8px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dynamic Wave Audio Visualizer Mockup */}
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-mono text-slate-500 uppercase block">Frequency Modulator Waveform</span>
                          <div className="h-10 flex items-end justify-between px-3 py-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((bar, i) => {
                              const bounces = [
                                'animate-wave-bounce-1',
                                'animate-wave-bounce-2',
                                'animate-wave-bounce-3',
                                'animate-wave-bounce-4',
                                'animate-wave-bounce-5'
                              ];
                              const animationClass = bounces[i % bounces.length];
                              return (
                                <div 
                                  key={bar} 
                                  className={`w-1 rounded-t transform origin-bottom ${animationClass}`}
                                  style={{
                                    height: `${(bar * 5) % 100 + 10}%`,
                                    backgroundColor: i % 2 === 0 ? gridColor : '#ec4899'
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Telemetry info row */}
                        <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 pt-2 border-t border-white/5">
                          <span>SYS.STATUS: ONLINE</span>
                          <span>LATENCY: 12ms</span>
                          <span>PREVIEW SCALE: {fxGlitchActive ? '0.98' : '1.00'}</span>
                        </div>

                      </div>

                    </div>

                    {/* Bottom visualizer helper prompt */}
                    <div className="relative z-10 text-center space-y-1 mt-auto pt-3 border-t border-white/5">
                      <p className="text-[9px] font-mono text-slate-400 leading-normal">
                        Sliders and commands react immediately. Save settings to lock in these styles globally across the developer administrative framework portal.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
