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
  resumeUrl: string;
  chatbotEnabled: boolean;
  customApiKey?: string;
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
}
