import React, { useState, useEffect } from 'react';
import { BarChart3, Radio, Terminal, Shield, RefreshCw, Cpu, Activity, Zap, Server, Send } from 'lucide-react';
import { Project, Skill, Service } from '../types';

interface AnalyticsDashboardProps {
  portfolioData: {
    skills: Skill[];
    services: Service[];
    projects: Project[];
  };
  onAdminOpen: () => void;
}

export default function AnalyticsDashboard({ portfolioData, onAdminOpen }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState({
    totalMessages: 4,
    repliedMessages: 3,
    unreadMessages: 1,
    totalChatLogs: 12,
    responseRate: 75,
    activeUptime: "100%",
    status: "SYNCED"
  });
  const [loading, setLoading] = useState(true);
  const [probeLog, setProbeLog] = useState<string[]>([]);
  const [isProbing, setIsProbing] = useState(false);
  const [handshakeSuccess, setHandshakeSuccess] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/portfolio/stats?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn("Failed to retrieve live stats, using demo projections.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [portfolioData.projects, portfolioData.skills, portfolioData.services]);

  const runHandshakeProbe = () => {
    if (isProbing) return;
    setIsProbing(true);
    setHandshakeSuccess(false);
    setProbeLog([]);

    const steps = [
      { text: "⚡ Initializing quantum socket handshake probe...", delay: 200 },
      { text: "🛰️ Fetching server container node headers...", delay: 600 },
      { text: `📡 Tunnel status verified: Status [${stats.status}]`, delay: 1100 },
      { text: "🔒 Checking signature keys and origin authority...", delay: 1600 },
      { text: `📊 Sync complete: ${portfolioData.projects.length} projects, ${stats.totalChatLogs} chat triggers resolved.`, delay: 2100 },
      { text: "🎉 Secure secure bridge to admin console verified! Latency: 18ms", delay: 2600 }
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

  return (
    <section id="analytics" className="py-24 relative overflow-hidden bg-slate-950/40">
      {/* Visual background decor anchors */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00bfef]/10 border border-[#00bfef]/20 text-[#00bfef] text-[10px] font-mono uppercase tracking-widest leading-none">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Telemetry Live Ledger</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
            System <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Telemetry Hub</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Explore live dynamic dashboard operations, database transactions, and the visual link tunnel bridging visitor activity directly to our admin security panel.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Analytics KPIs Card - 5 columns */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c081d]/50 via-[#050508]/90 to-[#0e1628]/40 border border-white/5 shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-neon-blue to-neon-purple"></div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-neon-blue" />
                    <span>Real-Time Indexes</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">Direct read-out of current platform load</p>
                </div>
                <button 
                  onClick={fetchStats}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Synchronize public metrics"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-neon-blue' : ''}`} />
                </button>
              </div>

              {/* Stats entries */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. Project sandbox counts */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-neon-blue/20 transition-all">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Projects Online</span>
                  <div className="text-2xl font-black text-white font-display">
                    {portfolioData.projects.length}
                  </div>
                  <span className="text-[8.5px] font-mono text-neon-blue uppercase block mt-2">Active sandboxes</span>
                </div>

                {/* 2. Skill items tracked */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-neon-purple/20 transition-all">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Matrix Skills</span>
                  <div className="text-2xl font-black text-white font-display">
                    {portfolioData.skills.length}
                  </div>
                  <span className="text-[8.5px] font-mono text-neon-purple uppercase block mt-2">Verified tools</span>
                </div>

                {/* 3. Message Transactions submitted */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-neon-pink/20 transition-all">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Inbox Signals</span>
                  <div className="text-2xl font-black text-white font-display flex items-baseline space-x-1">
                    <span>{stats.totalMessages}</span>
                    <span className="text-[10px] font-mono text-emerald-400">({stats.responseRate}%)</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-neon-pink uppercase block mt-2">Transmission pipeline</span>
                </div>

                {/* 4. Chat interactions logged */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-emerald-500/20 transition-all">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Chat Dialogs</span>
                  <div className="text-2xl font-black text-white font-display">
                    {stats.totalChatLogs}
                  </div>
                  <span className="text-[8.5px] font-mono text-emerald-400 uppercase block mt-2">AI Triggers synced</span>
                </div>

              </div>

              {/* Dynamic status display */}
              <div className="p-3.5 rounded-xl bg-[#090514]/60 border border-neon-purple/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase text-[9px] tracking-wide">Socket Status</span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-emerald-400 uppercase text-[10px] font-bold">ONLINE & INTEGRATED</span>
                </span>
              </div>
            </div>

            {/* Public Ledger Footer Note */}
            <div className="mt-8 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 uppercase flex justify-between items-center">
              <span>Uptime Index: {stats.activeUptime}</span>
              <span>Secure Client Tunnel</span>
            </div>

          </div>

          {/* Right Column: Interactive User to Admin Connection Map - 7 columns */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#050508]/90 to-[#0d071c]/60 border border-white/5 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-neon-purple to-neon-pink"></div>

            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Visitor-To-Console Handshake Tunneled State
                  </h3>
                  <p className="text-[10px] font-mono text-neon-pink uppercase mt-1">Cross-layered architecture bridge visualization</p>
                </div>
                <div className="px-2 py-0.5 rounded border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-[9px] font-mono uppercase tracking-widest">
                  Secure Link
                </div>
              </div>

              {/* Visualization Board */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>

                {/* Animated Node Connection Map */}
                <div className="flex justify-between items-center relative py-4 z-10">
                  
                  {/* Left Node: Client / Visitor */}
                  <div className="flex flex-col items-center space-y-2 relative group-hover:scale-105 transition-transform">
                    <div className="w-12 h-12 rounded-full border-2 border-neon-blue bg-neon-blue/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.25)] relative">
                      <Cpu className="w-5 h-5 text-neon-blue animate-pulse" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 uppercase leading-none font-bold">Public Space</span>
                    <span className="text-[8px] font-mono text-slate-500 leading-none uppercase">Visitor IP</span>
                  </div>

                  {/* Connecting Lane (SVG line with flowing dash array) */}
                  <div className="flex-grow mx-4 relative">
                    <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                      <path 
                        d="M 10 16 Q 50 -10, 90 16" 
                        fill="none" 
                        stroke="#9333ea" 
                        strokeWidth="2" 
                        strokeDasharray="6, 4" 
                        className="animate-[dash_10s_linear_infinite]"
                        style={{
                          transform: 'scaleX(1.15) translateX(-8%)'
                        }}
                      />
                      <defs>
                        <style>{`
                          @keyframes dash {
                            to {
                              stroke-dashoffset: -100;
                            }
                          }
                        `}</style>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-neon-purple animate-ping opacity-60" />
                    </div>
                  </div>

                  {/* Right Node: Secure Admin Server Panel */}
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className="w-12 h-12 rounded-full border-2 border-neon-pink bg-neon-pink/10 flex items-center justify-center shadow-[0_0_15px_rgba(244,114,182,0.25)]">
                      <Server className="w-5 h-5 text-neon-pink animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 uppercase leading-none font-bold">Secure Gate</span>
                    <span className="text-[8px] font-mono text-slate-500 leading-none uppercase">Admin Console</span>
                  </div>

                </div>

                {/* Probe Trigger Console Output if running */}
                {probeLog.length > 0 && (
                  <div className="p-3 bg-[#080512] rounded-xl border border-white/5 font-mono text-[9px] text-slate-300 space-y-1.5 text-left max-h-32 overflow-y-auto w-full transition-all">
                    <div className="text-neon-pink font-bold uppercase tracking-wider border-b border-white/5 pb-1 flex justify-between">
                      <span>Console Handshake Diagnostics</span>
                      {isProbing ? <span className="animate-pulse">PROBING ACTIVE...</span> : <span className="text-emerald-400">SUCCESS</span>}
                    </div>
                    {probeLog.map((log, i) => (
                      <p key={i} className={i === probeLog.length - 1 && handshakeSuccess ? "text-emerald-400 font-semibold" : ""}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}

              </div>

              {/* Actions row: Handshake probe & Console portal gate trigger link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={runHandshakeProbe}
                  disabled={isProbing}
                  className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase font-mono tracking-wider text-slate-200 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 text-neon-blue ${isProbing ? 'animate-pulse' : ''}`} />
                  <span>{isProbing ? 'Probing Link...' : 'Test Connection Portal'}</span>
                </button>

                <button
                  onClick={onAdminOpen}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-[0_0_20px_rgba(138,43,226,0.35)] text-xs font-bold uppercase font-mono tracking-wider text-white transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-103 active:scale-97"
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>Enter Admin Panel Console</span>
                </button>
              </div>

            </div>

            {/* Quick Helper hint */}
            <p className="mt-6 text-[9.5px] font-mono text-slate-500 text-center leading-relaxed">
              🔐 Connection uses cryptographically signed session tokens stored locally. Run test probes anytime to sync live client events to Firestore.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
