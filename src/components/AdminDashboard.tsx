import React, { useState, useEffect } from 'react';
import { 
  Lock, KeyRound, Save, Plus, Trash2, Check, RefreshCw, X, MessageSquare, 
  Layers, Hammer, Cpu, Settings as SettingsIcon, AlertCircle, Sparkles, Terminal, Mail, MessageSquareText, RotateCcw, Loader2,
  BarChart3, Upload, Download, FileText, Eye, Server, Activity,
  LayoutDashboard, User, Briefcase, Bell, Search, Moon, Folder, ChevronDown, ExternalLink, Edit
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
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
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0A0D16] text-white flex select-none font-sans">
      
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

            {/* Dark Mode switcher mockup */}
            <div className="w-10 h-6 bg-slate-800 border border-white/10 rounded-full p-1 flex items-center cursor-pointer transition-colors justify-end">
              <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                <Moon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

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

      </main>

    </div>
  );
}
