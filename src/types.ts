export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tech: string[];
  liveUrl: string;
  sourceCode: string;
  category: 'web' | 'app' | 'uiux' | 'backend';
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'other';
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: any;
  read: boolean;
  replied: boolean;
  phone?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  name: string;
  introParagraph: string;
  resumeUrl: string;
  profileImage: string;
  experienceYears: number;
  projectsCompleted: number;
  clientsWorked: number;
  awardsWon: number;
}

export interface AboutData {
  description: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experienceYearText: string;
  avatarUrl: string;
}

export interface Settings {
  websiteTitle: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl?: string;
  resumeUrl: string;
  chatbotEnabled: boolean;
  customApiKey?: string;
  chatbotProvider?: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiApiKey?: string;
  openaiModel?: string;
  quickReplies: string[];
  themePreset?: string;
  customPurple?: string;
  customBlue?: string;
  customPink?: string;
  artShape?: string;
  buttonStyle?: string;
  // Brand Logo & Banner Controls
  logoText?: string;
  logoType?: 'icon' | 'image';
  logoImageUrl?: string;
  logoIconName?: string;
  bannerBgType?: 'glow' | 'image';
  bannerBgImageUrl?: string;
  bannerGlow1?: string;
  bannerGlow2?: string;
  bannerShowGrid?: boolean;
  googleAnalyticsId?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  duration: string;
}

export interface ResumeDetails {
  fullName: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  philosophy: string;
  skills: string[];
  experienceList: WorkExperience[];
  educationList: EducationEntry[];
}
