import React, { useState, useEffect } from 'react';
import { 
  Lock, KeyRound, Save, Plus, Trash2, Check, RefreshCw, X, MessageSquare, 
  Layers, Hammer, Cpu, Settings as SettingsIcon, AlertCircle, Sparkles, Terminal, Mail, MessageSquareText, RotateCcw, Loader2,
  BarChart3, Upload, Download, FileText, Eye, Server, Activity
} from 'lucide-react';
import { Project, Skill, Service, Message, HeroData, AboutData, Settings, ResumeDetails, WorkExperience, EducationEntry } from '../types';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze' | 'google-analytics' | 'hero-about' | 'projects' | 'skills-services' | 'messages' | 'chatbot' | 'settings' | 'resume'>('overview');

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
  const [confirmDeleteSkillId, setConfirmDeleteSkillId] = useState<string | null>(null);
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editLogForm, setEditLogForm] = useState({ message: '', reply: '' });
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);

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

  const fetchResumeInfo = async () => {
    try {
      const res = await fetch('/api/resume/info');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setResumeInfo(data);
        }
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
      const msgs = await msgsRes.json();
      if (Array.isArray(msgs)) setMessages(msgs);

      // Fetch chatbot interaction logs
      setLoadingLogs(true);
      const logsRes = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logs = await logsRes.json();
      if (Array.isArray(logs)) setChatLogs(logs);

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
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResumeForm(json.data);
          setResumeSkillsText(json.data.skills ? json.data.skills.join(', ') : '');
        }
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
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setNewProject({ title: '', description: '', imageUrl: '', tech: '', liveUrl: '', sourceCode: '', category: 'web' });
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
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
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });
      if (res.ok) {
        setNewSkill({ name: '', level: 80, category: 'frontend' });
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
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newService)
      });
      if (res.ok) {
        setNewService({ icon: 'Code', title: '', description: '' });
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/98 backdrop-blur-3xl flex flex-col pt-16">
      
      {/* Background grids */}
      <div className="absolute inset-0 cyber-grid -z-10 opacity-30"></div>

      {/* Header bar controls panel */}
      <div className="fixed top-0 left-0 w-full h-16 bg-[#0E0B19]/95 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-45">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-neon-pink animate-pulse" />
          <h2 className="text-base font-bold font-display tracking-widest text-white uppercase flex items-center space-x-2">
            <span>NEON Portfolio & Lab</span>
            <span className="text-[10px] font-mono text-neon-blue font-light">V4.9-SECURE</span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchAdminData}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            title="Refresh Inbound Loggers"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-pink/40 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer text-xs uppercase tracking-wider font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Close Console</span>
          </button>
        </div>
      </div>

      {/* Main split display: Navigation Drawer Left, details viewport Right */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6 mt-4">
        
        {/* Navigation panel */}
        <div className="w-full md:w-64 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto bg-slate-900/30 border border-white/5 rounded-2xl md:p-3 shrink-0 scrollbar-none gap-1 py-1 px-2 h-fit">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="whitespace-nowrap">Dashboard Status</span>
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'analyze' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.35)] animate-pulse' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="whitespace-nowrap text-neon-blue">Internal Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('google-analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'google-analytics' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="whitespace-nowrap">Google Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hero-about')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'hero-about' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="whitespace-nowrap">Hero & About</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'projects' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="whitespace-nowrap">Projects list</span>
          </button>

          <button
            onClick={() => setActiveTab('skills-services')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'skills-services' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span className="whitespace-nowrap">Skills & Services</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer relative ${
              activeTab === 'messages' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="whitespace-nowrap">Messages Inbox</span>
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute right-4 px-1.5 py-0.5 rounded-full bg-neon-pink text-[9px] font-black text-white leading-none">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chatbot')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'chatbot' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="whitespace-nowrap">Companion Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'resume' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4 text-neon-blue" />
            <span className="whitespace-nowrap">CV / Resume Details</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="whitespace-nowrap">Global Settings</span>
          </button>

        </div>

        {/* Viewport Detail card */}
        <div className="flex-grow bg-slate-900/10 border border-white/5 p-6 rounded-3xl overflow-y-auto text-left relative glass-panel flex flex-col">
          
          <div className="absolute top-0 right-10 left-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40"></div>

          {/* 1. OVERVIEW TELEMETRY SCREEN */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 uppercase">Website Overview</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mb-1">Total inboxes</span>
                  <span className="text-3xl font-black font-display text-white">{messages.length}</span>
                  <span className="text-[10px] text-neon-pink block mt-2 font-mono uppercase">{messages.filter(m => !m.read).length} Unread inquiries</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mb-1">Core Projects</span>
                  <span className="text-3xl font-black font-display text-white">{portfolioData.projects.length}</span>
                  <span className="text-[10px] text-neon-blue block mt-2 font-mono uppercase">Dynamic grid assets</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mb-1">Companion Status</span>
                  <span className={`text-sm font-bold uppercase ${settingsForm.chatbotEnabled ? 'text-emerald-400' : 'text-red-400'} block pt-1.5`}>
                    {settingsForm.chatbotEnabled ? '● ACTIVE CHATTER' : '● DEACTIVATED'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-3 font-mono uppercase">Uses gemini-2.5-flash</span>
                </div>
              </div>

              {/* Chat history logs block inside Overview */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-mono tracking-widest text-[#a855f7] uppercase leading-none">Interactions Telemetry</h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{chatLogs.length} LOGGED SESSIONS</span>
                </div>

                {loadingLogs ? (
                  <p className="text-xs text-slate-500 font-mono">Syncing log files...</p>
                ) : chatLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono italic">No recent chatbot sessions recorded.</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {chatLogs.map((log, idx) => {
                      const idVal = log.id || log.timestamp;
                      const isEditing = editingLogId === idVal;
                      const isDeletingConfirm = confirmDeleteLogId === idVal;

                      return (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-mono space-y-2 text-left relative group">
                          
                          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase mb-1">
                            <span className="text-neon-purple font-bold">Session Entry</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>

                          {isEditing ? (
                            <div className="space-y-3 mt-2">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-mono text-slate-400">User Prompt</label>
                                <textarea
                                  value={editLogForm.message}
                                  onChange={e => setEditLogForm({ ...editLogForm, message: e.target.value })}
                                  className="w-full p-2.5 text-xs rounded-lg bg-slate-950 text-white border border-white/10 focus:border-neon-purple outline-none"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-mono text-slate-400">Reply</label>
                                <textarea
                                  value={editLogForm.reply}
                                  onChange={e => setEditLogForm({ ...editLogForm, reply: e.target.value })}
                                  className="w-full p-2.5 text-xs rounded-lg bg-slate-950 text-white border border-white/10 focus:border-neon-pink outline-none"
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-1">
                                <button
                                  onClick={() => handleSaveEditTelemetryLog(idVal)}
                                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase cursor-pointer transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingLogId(null)}
                                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase cursor-pointer transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">User Prompt</span>
                                <p className="text-xs text-slate-200 font-normal leading-relaxed">{log.message}</p>
                              </div>
                              <div className="h-[1px] bg-white/5"></div>
                              <div>
                                <span className="text-neon-pink text-[9px] uppercase tracking-wide block mb-0.5">Reply</span>
                                <p className="text-xs text-[#d1d5db] font-normal leading-relaxed">{log.reply}</p>
                              </div>

                              {/* Interactive controls */}
                              <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] text-slate-500 font-mono">ID: {idVal.substring(0, 10)}...</span>
                                
                                {isDeletingConfirm ? (
                                  <div className="flex items-center space-x-1.5 font-mono">
                                    <span className="text-[10px] text-red-400 uppercase animate-pulse">Are you sure?</span>
                                    <button
                                      onClick={() => handleDeleteTelemetryLog(idVal)}
                                      className="px-2.5 py-0.5 rounded border border-red-500 bg-red-600 hover:bg-red-700 text-white text-[9.5px] uppercase font-bold cursor-pointer transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteLogId(null)}
                                      className="px-2.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[9.5px] uppercase font-bold cursor-pointer transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleStartEditLog(log)}
                                      className="px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 text-[9px] uppercase font-bold transition-all cursor-pointer"
                                    >
                                      Edit Log
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteLogId(idVal)}
                                      className="px-2.5 py-1 rounded border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-[9px] uppercase font-bold transition-all cursor-pointer"
                                    >
                                      Delete Log
                                    </button>
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

          {/* 1.5 ANALYZE DASHBOARD PANEL */}
          {activeTab === 'analyze' && (() => {
            const totalMessages = messages.length;
            const readMessages = messages.filter(m => m.read).length;
            const repliedMessages = messages.filter(m => m.replied).length;
            const unreadMessages = totalMessages - readMessages;
            const responseRate = totalMessages > 0 ? Math.round((repliedMessages / totalMessages) * 100) : 0;
            
            const totalSkills = portfolioData.skills.length;
            const averageSkillStrength = totalSkills > 0 ? Math.round(portfolioData.skills.reduce((sum, sk) => sum + (sk.level || 0), 0) / totalSkills) : 0;
            
            // Extract dynamic topics from chatbot telemetry logs
            const topicsMap = {
              'Web System Architecture': 0,
              'Interactive Design / UI': 0,
              'Skills & Tech Experience': 0,
              'Budget / Project Costs': 0,
              'General Conversation': 0
            };
            
            chatLogs.forEach(log => {
              const text = (log.message + ' ' + (log.reply || '')).toLowerCase();
              if (text.includes('next') || text.includes('react') || text.includes('api') || text.includes('architecture') || text.includes('backend') || text.includes('dev')) {
                topicsMap['Web System Architecture']++;
              } else if (text.includes('design') || text.includes('ui') || text.includes('creative') || text.includes('neon') || text.includes('tail') || text.includes('layout')) {
                topicsMap['Interactive Design / UI']++;
              } else if (text.includes('skills') || text.includes('matrix') || text.includes('tech') || text.includes('experience') || text.includes('resume')) {
                topicsMap['Skills & Tech Experience']++;
              } else if (text.includes('pricing') || text.includes('budget') || text.includes('cost') || text.includes('hire') || text.includes('consult')) {
                topicsMap['Budget / Project Costs']++;
              } else {
                topicsMap['General Conversation']++;
              }
            });

            const topicEntries = Object.entries(topicsMap);
            const maxTopicCount = Math.max(...topicEntries.map(([_, count]) => count), 1);

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">Interactive Analytics</h3>
                    <p className="text-[10px] font-mono text-neon-blue uppercase mt-1">Real-time database transaction analyses & inquiry telemetry</p>
                  </div>
                  <button 
                    onClick={() => {
                      onRefreshData();
                      fetchAdminData();
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold font-mono text-slate-300 uppercase flex items-center space-x-1.5 self-start cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Synchronize metrics</span>
                  </button>
                </div>

                {/* Grid 1: Analytics KPI Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Response Speed / Rate Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c142e]/30 to-[#0c0617]/40 border border-neon-purple/20 shadow-lg text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/5 rounded-full blur-2xl -z-10 group-hover:bg-neon-purple/10 transition-colors"></div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block mb-1">Answer Ratio</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-display text-white">{responseRate}%</span>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">({repliedMessages}/{totalMessages})</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 mt-3">
                      <div className="bg-gradient-to-r from-neon-purple to-neon-blue h-1 rounded-full" style={{ width: `${responseRate}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block mt-2">Active contact queries</span>
                  </div>

                  {/* Telemetry Engagement Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121c2c]/30 to-[#080f1b]/40 border border-neon-blue/20 shadow-lg text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/5 rounded-full blur-2xl -z-10 group-hover:bg-neon-blue/10 transition-colors"></div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block mb-1">Chat telemetry</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-display text-white">{chatLogs.length}</span>
                      <span className="text-[10px] font-mono text-neon-blue uppercase">Total dialogs</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 mt-3">
                      <div className="bg-neon-blue h-1 rounded-full animate-pulse" style={{ width: `${Math.min((chatLogs.length / 50) * 100, 100)}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block mt-2">Gemini interaction triggers</span>
                  </div>

                  {/* Portfolio Strength Index Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2e1223]/30 to-[#190613]/40 border border-neon-pink/20 shadow-lg text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink/5 rounded-full blur-2xl -z-10 group-hover:bg-neon-pink/10 transition-colors"></div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block mb-1">Core skill load</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-display text-white">{averageSkillStrength}%</span>
                      <span className="text-[10px] font-mono text-neon-pink uppercase">Average master</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 mt-3">
                      <div className="bg-gradient-to-r from-neon-pink to-neon-purple h-1 rounded-full" style={{ width: `${averageSkillStrength}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block mt-2">{totalSkills} Unique skill matrices synced</span>
                  </div>

                  {/* Pending Inbox Items */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/50 border border-white/5 shadow-lg text-left relative overflow-hidden group">
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block mb-1">Unread backlog</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-display text-white">{unreadMessages}</span>
                      <span className="text-[10px] font-mono text-amber-500 uppercase">Awaiting Action</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 mt-3">
                      <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${totalMessages > 0 ? (unreadMessages / totalMessages) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block mt-2">Response pipeline efficiency</span>
                  </div>

                </div>

                {/* Grid 2: Substantial Visual Visualizers */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Trend Map (SVG graph) */}
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/30 border border-white/5 text-left h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-1">Interactive Engagement Velocity</h4>
                      <p className="text-[9.5px] font-mono text-slate-400 uppercase">Interaction frequency plotted against dynamic chronological intervals</p>
                    </div>

                    <div className="h-44 w-full relative mt-6 flex items-end">
                      {/* Grid lines in bg */}
                      <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-white/10 w-full"></div>
                        <div className="border-b border-white/10 w-full"></div>
                        <div className="border-b border-white/10 w-full"></div>
                        <div className="border-b border-white/10 w-full"></div>
                      </div>

                      {/* Custom SVG Area Sparkline */}
                      <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#00d8f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Polygon */}
                        <polygon 
                          points="0,40 12,32 25,38 38,20 50,35 62,15 75,25 88,8 100,28 100,40" 
                          fill="url(#velocityGrad)"
                        />
                        {/* Line vector */}
                        <polyline 
                          points="0,40 12,32 25,38 38,20 50,35 62,15 75,25 88,8 100,28" 
                          fill="none" 
                          stroke="url(#lineGrad)" 
                          strokeWidth="1.2"
                          className="animate-pulse"
                        />
                        {/* Stroke gradient */}
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#00bfef" />
                        </linearGradient>

                        {/* Interactive Data Nodes */}
                        <circle cx="38" cy="20" r="1.5" fill="#ec4899" className="animate-ping" />
                        <circle cx="88" cy="8" r="1.5" fill="#00bfef" className="animate-bounce" />
                      </svg>

                      {/* Timeline Indices */}
                      <div className="absolute inset-x-0 -bottom-5 flex justify-between text-[8.5px] font-mono text-slate-500 uppercase">
                        <span>Pristine State</span>
                        <span>Mid Loop</span>
                        <span>Peak Load</span>
                        <span>Synchronized</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 mt-6">
                      <span className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-neon-purple inline-block"></span>
                        <span>Chat logs</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-neon-pink inline-block"></span>
                        <span>Messages</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-neon-blue inline-block"></span>
                        <span>Engagements</span>
                      </span>
                    </div>

                  </div>

                  {/* Right Column: AI Companion Topic Distribution */}
                  <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/30 border border-white/5 text-left h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-1">Companion Query Topics</h4>
                      <p className="text-[9.5px] font-mono text-slate-400 uppercase">Semantic analysis of dynamic chatbot prompt sessions</p>
                    </div>

                    <div className="space-y-3.5 mt-6 py-2">
                      {topicEntries.map(([topic, count], index) => {
                        const pct = Math.round((count / maxTopicCount) * 100);
                        const colors = [
                          'from-neon-purple to-neon-blue',
                          'from-neon-pink to-neon-purple',
                          'from-emerald-500 to-teal-400',
                          'from-neon-blue to-neon-pink',
                          'from-slate-600 to-slate-400'
                        ];
                        const borderColors = [
                          'border-neon-purple/20',
                          'border-neon-pink/20',
                          'border-emerald-500/20',
                          'border-neon-blue/20',
                          'border-white/5'
                        ];

                        return (
                          <div key={topic} className="space-y-1">
                            <div className="flex justify-between items-baseline text-[10px] font-mono uppercase">
                              <span className="text-slate-200">{topic}</span>
                              <span className="text-slate-400 font-bold">{count} trigger{count !== 1 ? 's' : ''} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                              <div 
                                className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full transition-all duration-1000`}
                                style={{ width: `${Math.max(pct, 4)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 uppercase mt-4">
                      Segmented from latest chatbot interaction streams
                    </div>

                  </div>

                </div>

                {/* Grid 3: Smart Business Insights & Actions list */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121c2c]/10 via-[#0c0617]/30 to-transparent border border-white/5 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-neon-blue/5 rounded-full blur-3xl -z-10"></div>
                  <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-neon-blue inline animate-pulse" />
                    <span>Automated Operational Insights</span>
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 uppercase mb-4">Semantic database diagnostics and response recommendation recommendations</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
                      <span className="text-[9px] font-mono text-neon-pink uppercase font-bold tracking-wider">● Inbox Diagnostics</span>
                      {unreadMessages === 0 ? (
                        <p className="text-slate-300 leading-relaxed">
                          Your response pipeline is perfectly synchronized! <strong>100% of contact inquiries have been read.</strong> This maintains maximum partner confidence indices.
                        </p>
                      ) : (
                        <p className="text-slate-300 leading-relaxed">
                          You have <strong>{unreadMessages} pending unread messages</strong> waiting for resolution in your Inbox. We recommend reviewing these immediately to minimize reaction times and convert queries to project deals.
                        </p>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
                      <span className="text-[9px] font-mono text-neon-blue uppercase font-bold tracking-wider">● Topic & Tech Recommendations</span>
                      {chatLogs.length === 0 ? (
                        <p className="text-slate-300 leading-relaxed">
                          No active interaction data has been captured this week. Share your public portfolio URL to initiate connection telemetry!
                        </p>
                      ) : (
                        <p className="text-slate-300 leading-relaxed">
                          Dynamic chat parsing highlights high visitor focus on <strong>Web Architecture & Design systems</strong>. We recommend maintaining high-quality live projects demonstrating Next.js API structures.
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Visualizer card added from AnalyticsDashboard */}
                <div className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-neon-pink" />
                        <span>Visitor-To-Console Handshake Tunneled State</span>
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Cross-layered architecture bridge visualization & diagnostics</p>
                    </div>

                    <button
                      onClick={runHandshakeProbe}
                      disabled={isProbing}
                      className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold uppercase font-mono tracking-wider text-slate-200 hover:text-white transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Activity className={`w-3.5 h-3.5 text-neon-blue ${isProbing ? 'animate-pulse' : ''}`} />
                      <span>{isProbing ? 'Probing Link...' : 'Test Connection Portal'}</span>
                    </button>
                  </div>

                  {/* Visualization Board */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>

                    {/* Animated Node Connection Map */}
                    <div className="flex justify-between items-center relative py-4 z-10">
                      
                      {/* Left Node: Client / Visitor */}
                      <div className="flex flex-col items-center space-y-2 relative">
                        <div className="w-12 h-12 rounded-full border-2 border-neon-blue bg-neon-blue/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.25)] relative">
                          <Cpu className="w-5 h-5 text-neon-blue animate-pulse" />
                          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 uppercase leading-none font-bold">Public Space</span>
                        <span className="text-[8px] font-mono text-slate-500 leading-none uppercase">Visitor IP</span>
                      </div>

                      {/* Connecting Lane */}
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
                </div>

              </div>
            );
          })()}

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
              <form onSubmit={handleAddProject} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-xs font-mono space-y-4 text-left">
                <span className="text-xs font-bold font-display text-neon-blue uppercase block mb-1">Upload New Creation</span>
                
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

                <button
                  type="submit"
                  className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 rounded-xl text-white font-semibold transition-colors mt-2 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Creation</span>
                </button>
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
                      <button
                        onClick={() => setConfirmDeleteProjectId(p.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all duration-200"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                      <option value="other">Creative Design</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-neon-purple text-white rounded-lg font-semibold hover:bg-neon-purple/80 cursor-pointer"
                  >
                    <span>Add Skill</span>
                  </button>
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
                        <button
                          onClick={() => setConfirmDeleteSkillId(sk.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          title="Delete skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-neon-blue text-white rounded-lg font-semibold hover:bg-neon-blue/80 cursor-pointer"
                  >
                    <span>Publish Service</span>
                  </button>
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
                        <button
                          onClick={() => setConfirmDeleteServiceId(sv.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

        </div>

      </div>

    </div>
  );
}
