import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { AboutData } from '../types';

interface ContactProps {
  aboutData: AboutData;
}

export default function Contact({ aboutData }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setStatusMsg('Please fill in Name, Email, and Message before launching the query!');
      return;
    }

    setLoading(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/messages/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setStatusMsg('Quantum signal received! Your inquiry is logged in the database.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Failed to dispatch the connection. Try again later!');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg('Connection fault: Server unreachable. Details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      
      {/* Visual background lights */}
      <div className="absolute top-10 left-10 w-96 h-96 radial-glow-1 opacity-20 -z-15"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 radial-glow-2 opacity-20 -z-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">

        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-widest text-[#a855f7] font-semibold mb-1">
            Secure Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight flex items-center space-x-2">
            <span>Establish</span>
            <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">Contact</span>
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-neon-purple to-neon-pink mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Grid: Details Info card list */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-xl text-left h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[5px] h-full bg-gradient-to-b from-neon-purple to-neon-pink"></div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-display text-white tracking-tight">Let's build together</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Have a challenging project, scalable web application, design concept, or API module in mind? Reach out! Complete the secure form, or ping me via my contact details.
                </p>
              </div>

              <div className="space-y-6 py-8">
                {/* Email details */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 border border-white/10 hover:border-neon-purple/40 rounded-2xl text-neon-purple transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">Cyber Mail</span>
                    <a href={`mailto:${aboutData.email}`} className="text-sm font-semibold text-slate-100 hover:text-neon-pink transition-colors">
                      {aboutData.email || 'alex.rivera@neon.dev'}
                    </a>
                  </div>
                </div>

                {/* Phone details */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 border border-white/10 hover:border-neon-blue/40 rounded-2xl text-neon-blue transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">Secure Line</span>
                    <a href={`tel:${aboutData.phone}`} className="text-sm font-semibold text-slate-100 hover:text-neon-pink transition-colors">
                      {aboutData.phone || '+1 (555) 792-4211'}
                    </a>
                  </div>
                </div>

                {/* Location details */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 border border-white/10 hover:border-neon-pink/40 rounded-2xl text-neon-pink transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">Core Node Coordinates</span>
                    <span className="text-sm font-semibold text-slate-100 block">
                      {aboutData.location || 'San Francisco, CA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified status bar */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-slate-500">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 flex items-center space-x-1 uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse mr-1"></span>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Right Grid: Form components */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                {/* Input Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Your Name <span className="text-neon-pink">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Satoshi"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-purple/80 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] text-sm text-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Your Email <span className="text-neon-pink">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. satoshi@bitcoin.org"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-blue/80 focus:shadow-[0_0_15px_rgba(0,191,255,0.15)] text-sm text-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Subject Block */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Custom platform architecture"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-purple/80 focus:shadow-[0_0_15px_rgba(138,43,226,0.15)] text-sm text-white transition-all outline-none"
                  />
                </div>

                {/* Message Block */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Deep Message <span className="text-neon-pink">*</span></label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="e.g. I need a modular landing architecture with custom database schema."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-pink/80 focus:shadow-[0_0_15px_rgba(255,77,255,0.15)] text-sm text-white transition-all outline-none resize-none"
                  ></textarea>
                </div>

                {/* Notifications overlay inside form */}
                {status === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {/* Submit button container */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-fit px-6 py-3.5 rounded-xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:shadow-[0_0_25px_rgba(138,43,226,0.25)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 hover:border-white/25 border border-transparent transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Transmitting signal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Signal</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
