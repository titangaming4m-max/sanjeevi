import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc
} from 'firebase/firestore';

// Initialize Firebase using applet config
let firestoreDb: any = null;
let firebaseConfig: any = null;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(firebaseConfig);
    // Use the specified firestoreDatabaseId for custom instances
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');
    console.log('Firebase Web SDK successfully initialized on server side.');
  } else {
    console.warn('firebase-applet-config.json not found in server, using in-memory fallbacks.');
  }
} catch (err) {
  console.error('Failed to initialize database on server:', err);
}

// In-Memory Backup/Default State in case Firestore is unreachable
let localBackupData = {
  settings: {
    websiteTitle: "NEON Portfolio & Lab",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
    resumeUrl: "#",
    chatbotEnabled: true,
    quickReplies: ["Web Development", "UI/UX Design", "Mobile Apps", "Pricing Plans", "Contact Me"],
    customApiKey: "",
    artShape: "circle",
    buttonStyle: "glow"
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
    description: "I'm a digital architect with a passion for designing visual interfaces that bridge high aesthetics and scalable backends. Over the last 8 years, I've developed interactive installations, e-commerce solutions, and custom AI tools. I strive for pixel-perfect fidelity, optimal performance, and solid data security.",
    name: "Thennarasi",
    email: "thennarasi@neon.dev",
    phone: "+1 (555) 792-4211",
    location: "San Francisco, CA",
    experienceYearText: "8+ Years Experience",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
  },
  skills: [
    { id: "1", name: "HTML & CSS/Tailwind", level: 95, category: "frontend" },
    { id: "2", name: "React & Vite", level: 92, category: "frontend" },
    { id: "3", name: "TypeScript", level: 88, category: "frontend" },
    { id: "4", name: "Node.js & Express", level: 85, category: "backend" },
    { id: "5", name: "Firebase & Firestore", level: 90, category: "backend" },
    { id: "6", name: "PostgreSQL & SQL", level: 80, category: "backend" },
    { id: "7", name: "UI/UX Design", level: 90, category: "other" },
    { id: "8", name: "SEO & Optimization", level: 85, category: "other" }
  ],
  services: [
    { id: "1", icon: "Code", title: "Web Development", description: "Ultra-fast Next-gen static SPAs and complex full-stack web platforms styled with pure Tailwind." },
    { id: "2", icon: "Smartphone", title: "Mobile App Development", description: "Fully responsive hybrid apps and progressive web companions with dynamic layouts." },
    { id: "3", icon: "Palette", title: "UI/UX Design", description: "Bespoke glassmorphism layouts, elegant typographies, wireframe boards, and immersive dark components." },
    { id: "4", icon: "Database", title: "Backend Development", description: "Bulletproof REST endpoints, secure authorization tokens, and scalable database integrations." },
    { id: "5", icon: "TrendingUp", title: "SEO & Performance", description: "Blazing fast load times, 100/100 Lighthouse audits, structured metadata schema, and semantic tags." }
  ],
  projects: [
    {
      id: "p1",
      title: "Cosmic Analytics Hub",
      description: "A dark futuristic analytics dashboard featuring glowing dynamic charts, multi-user websocket tracking, and real-time report generations.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      tech: ["React", "Tailwind", "Recharts", "Express"],
      liveUrl: "#",
      sourceCode: "#",
      category: "web"
    },
    {
      id: "p2",
      title: "Aura Mobile Wallet",
      description: "A secure cryptocurrencies client app with beautiful smooth layouts, biometric token unlocking, and instant gas fees optimization.",
      imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop",
      tech: ["React Native", "TailwindCSS", "Ethers.js"],
      liveUrl: "#",
      sourceCode: "#",
      category: "app"
    },
    {
      id: "p3",
      title: "Cyberpunk Arcade UI Kit",
      description: "A brutalist cyberpunk component library with neon glowing states, canvas-based click ripples, and high contrast typography presets.",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      tech: ["Figma", "React", "Framer Motion"],
      liveUrl: "#",
      sourceCode: "#",
      category: "uiux"
    },
    {
      id: "p4",
      title: "Gemini Summarizer Service",
      description: "Microservice leveraging server-side LLMs to parse voluminous records, index transcripts, and trigger automated Slack intelligence feeds.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      tech: ["NodeJS", "Google GenAI", "Firestore"],
      liveUrl: "#",
      sourceCode: "#",
      category: "backend"
    }
  ],
  messages: [] as any[],
  chatLogs: [] as any[],
  adminToken: 'session-neon-admin-token-2026'
};

// Help initialize Firestore collections with default configurations if empty
async function preseedFirestoreDatabase() {
  if (!firestoreDb) return;
  try {
    const configDocRef = doc(firestoreDb, 'portfolio_data', 'config');
    const configDoc = await getDoc(configDocRef);
    
    if (!configDoc.exists()) {
      console.log('Firestore data missing, seeding default portfolio data...');
      
      // Save settings
      await setDoc(doc(firestoreDb, 'portfolio_data', 'settings'), localBackupData.settings);
      
      // Save hero
      await setDoc(doc(firestoreDb, 'portfolio_data', 'hero'), localBackupData.hero);
      
      // Save about
      await setDoc(doc(firestoreDb, 'portfolio_data', 'about'), localBackupData.about);
      
      // Save skills
      for (const sk of localBackupData.skills) {
        await setDoc(doc(firestoreDb, 'portfolio_skills', sk.id), { name: sk.name, level: sk.level, category: sk.category });
      }
      
      // Save services
      for (const sv of localBackupData.services) {
        await setDoc(doc(firestoreDb, 'portfolio_services', sv.id), { icon: sv.icon, title: sv.title, description: sv.description });
      }
      
      // Save projects
      for (const pr of localBackupData.projects) {
        await setDoc(doc(firestoreDb, 'portfolio_projects', pr.id), {
          title: pr.title,
          description: pr.description,
          imageUrl: pr.imageUrl,
          tech: pr.tech,
          liveUrl: pr.liveUrl,
          sourceCode: pr.sourceCode,
          category: pr.category
        });
      }

      // Mark database as seeded
      await setDoc(configDocRef, { seeded: true, createdAt: new Date().toISOString() });
      console.log('Firestore portfolio database seeded successfully.');
    } else {
      console.log('Firestore already populated with portfolio settings. Running user name updates if needed...');
      
      try {
        const heroDocRef = doc(firestoreDb, 'portfolio_data', 'hero');
        const heroDoc = await getDoc(heroDocRef);
        if (heroDoc.exists() && heroDoc.data()?.name === 'Alex Rivera') {
          await updateDoc(heroDocRef, { name: 'Thennarasi' });
          console.log('Successfully updated Firestore hero name reference.');
        }

        const aboutDocRef = doc(firestoreDb, 'portfolio_data', 'about');
        const aboutDoc = await getDoc(aboutDocRef);
        if (aboutDoc.exists() && aboutDoc.data()?.name === 'Alex Rivera') {
          await updateDoc(aboutDocRef, { name: 'Thennarasi', email: 'thennarasi@neon.dev' });
          console.log('Successfully updated Firestore about name reference.');
        }
      } catch (dbErr) {
        console.warn('Could not run automated username update migration in Firestore:', dbErr);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Trigger preseed on launch
setTimeout(preseedFirestoreDatabase, 1000);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Middleware for Admin session verification
const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  
  const token = authHeader.replace(/^Bearer\s+/, '');
  if (token === localBackupData.adminToken) {
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized: Invalid token' });
};

// ---------------------------------
// AUTHENTICATION ENDPOINTS
// ---------------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Standard preset admin credentials for single dashboard administrator:
  if (email === 'sanjeevidaa@gmail.com' && password === 'sanjay@2002') {
    return res.json({ 
      success: true, 
      token: localBackupData.adminToken, 
      user: { email: 'sanjeevidaa@gmail.com', name: 'Website Admin' } 
    });
  }
  return res.status(401).json({ error: 'Invalid admin email or password' });
});

app.get('/api/check-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace(/^Bearer\s+/, '') === localBackupData.adminToken) {
    return res.json({ authenticated: true });
  }
  return res.json({ authenticated: false });
});

// ---------------------------------
// PORTFOLIO CLIENT / ADMIN DATA COMPOSITE
// ---------------------------------
app.get('/api/portfolio', async (req, res) => {
  // Prevent any browser or intermediary caching of current state variables
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    if (!firestoreDb) {
      // In-memory fallback
      return res.json({
        settings: localBackupData.settings,
        hero: localBackupData.hero,
        about: localBackupData.about,
        skills: localBackupData.skills,
        services: localBackupData.services,
        projects: localBackupData.projects
      });
    }

    const settingsSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'settings'));
    const heroSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'hero'));
    const aboutSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'about'));
    
    const settings = settingsSnap.exists() ? settingsSnap.data() : localBackupData.settings;
    const hero = heroSnap.exists() ? heroSnap.data() : localBackupData.hero;
    const about = aboutSnap.exists() ? aboutSnap.data() : localBackupData.about;

    // Sync database seeded status
    const configSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'config'));
    const isSeeded = configSnap.exists() && configSnap.data()?.seeded;

    // Fetch skills
    const skillsSnap = await getDocs(collection(firestoreDb, 'portfolio_skills'));
    const skills: any[] = [];
    skillsSnap.forEach(docSnap => {
      skills.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (skills.length === 0 && !isSeeded) {
      skills.push(...localBackupData.skills);
    }

    // Fetch services
    const servicesSnap = await getDocs(collection(firestoreDb, 'portfolio_services'));
    const services: any[] = [];
    servicesSnap.forEach(docSnap => {
      services.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (services.length === 0 && !isSeeded) {
      services.push(...localBackupData.services);
    }

    // Fetch projects
    const projectsSnap = await getDocs(collection(firestoreDb, 'portfolio_projects'));
    const projects: any[] = [];
    projectsSnap.forEach(docSnap => {
      projects.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (projects.length === 0 && !isSeeded) {
      projects.push(...localBackupData.projects);
    }

    res.json({
      settings,
      hero,
      about,
      skills,
      services,
      projects
    });
  } catch (error: any) {
    console.error('Error fetching dynamic portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------
// SYSTEM UTILITIES (ADMIN SECURED)
// ---------------------------------
app.post('/api/admin/reset', verifyAdmin, async (req, res) => {
  try {
    // 1. Reset memory data
    localBackupData.settings = {
      websiteTitle: "NEON Portfolio & Lab",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      resumeUrl: "#",
      chatbotEnabled: true,
      quickReplies: ["Web Development", "UI/UX Design", "Mobile Apps", "Pricing Plans", "Contact Me"],
      customApiKey: "",
      artShape: "circle",
      buttonStyle: "glow"
    };
    
    localBackupData.hero = {
      title: "CREATING FUTURISTIC DIGITAL EXPERIENCE",
      subtitle: "Interactive Fullstack Developer",
      name: "Thennarasi",
      introParagraph: "I design and code pixel-perfect, highly immersive web applications. Specializing in React, Node, and advanced glassmorphism components with clean typography and motion.",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      experienceYears: 8,
      projectsCompleted: 42,
      clientsWorked: 19,
      awardsWon: 5
    };
    
    localBackupData.about = {
      description: "I'm a digital architect with a passion for designing visual interfaces that bridge high aesthetics and scalable backends. Over the last 8 years, I've developed interactive installations, e-commerce solutions, and custom AI tools. I strive for pixel-perfect fidelity, optimal performance, and solid data security.",
      name: "Thennarasi",
      email: "thennarasi@neon.dev",
      phone: "+1 (555) 792-4211",
      location: "San Francisco, CA",
      experienceYearText: "8+ Years Experience",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    };

    localBackupData.skills = [
      { id: "1", name: "HTML & CSS/Tailwind", level: 95, category: "frontend" },
      { id: "2", name: "React & Vite", level: 92, category: "frontend" },
      { id: "3", name: "TypeScript", level: 88, category: "frontend" },
      { id: "4", name: "Node.js & Express", level: 85, category: "backend" },
      { id: "5", name: "Firebase & Firestore", level: 90, category: "backend" },
      { id: "6", name: "PostgreSQL & SQL", level: 80, category: "backend" },
      { id: "7", name: "UI/UX Design", level: 90, category: "other" },
      { id: "8", name: "SEO & Optimization", level: 85, category: "other" }
    ];

    localBackupData.services = [
      { id: "1", icon: "Code", title: "Web Development", description: "Ultra-fast Next-gen static SPAs and complex full-stack web platforms styled with pure Tailwind." },
      { id: "2", icon: "Smartphone", title: "Mobile App Development", description: "Fully responsive hybrid apps and progressive web companions with dynamic layouts." },
      { id: "3", icon: "Palette", title: "UI/UX Design", description: "Bespoke glassmorphism layouts, elegant typographies, wireframe boards, and immersive dark components." },
      { id: "4", icon: "Database", title: "Backend Development", description: "Bulletproof REST endpoints, secure authorization tokens, and scalable database integrations." },
      { id: "5", icon: "TrendingUp", title: "SEO & Performance", description: "Blazing fast load times, 100/100 Lighthouse audits, structured metadata schema, and semantic tags." }
    ];

    localBackupData.projects = [
      {
        id: "p1",
        title: "Cosmic Analytics Hub",
        description: "A dark futuristic analytics dashboard featuring glowing dynamic charts, multi-user websocket tracking, and real-time report generations.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        tech: ["React", "Tailwind", "Recharts", "Express"],
        liveUrl: "#",
        sourceCode: "#",
        category: "web"
      },
      {
        id: "p2",
        title: "Aura Mobile Wallet",
        description: "A secure cryptocurrencies client app with beautiful smooth layouts, biometric token unlocking, and instant gas fees optimization.",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop",
        tech: ["React Native", "TailwindCSS", "Ethers.js"],
        liveUrl: "#",
        sourceCode: "#",
        category: "app"
      },
      {
        id: "p3",
        title: "Cyberpunk Arcade UI Kit",
        description: "A brutalist cyberpunk component library with neon glowing states, canvas-based click ripples, and high contrast typography presets.",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        tech: ["Figma", "React", "Framer Motion"],
        liveUrl: "#",
        sourceCode: "#",
        category: "uiux"
      },
      {
        id: "p4",
        title: "Gemini Summarizer Service",
        description: "Microservice leveraging server-side LLMs to parse voluminous records, index transcripts, and trigger automated Slack intelligence feeds.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        tech: ["NodeJS", "Google GenAI", "Firestore"],
        liveUrl: "#",
        sourceCode: "#",
        category: "backend"
      }
    ];

    localBackupData.messages = [];
    localBackupData.chatLogs = [];

    // 2. Clear & Seed Firestore
    if (firestoreDb) {
      console.log('Admin triggered database hard reset, wiping and re-seeding Firestore...');
      
      const configDocRef = doc(firestoreDb, 'portfolio_data', 'config');
      await deleteDoc(configDocRef);
      await setDoc(doc(firestoreDb, 'portfolio_data', 'settings'), localBackupData.settings);
      await setDoc(doc(firestoreDb, 'portfolio_data', 'hero'), localBackupData.hero);
      await setDoc(doc(firestoreDb, 'portfolio_data', 'about'), localBackupData.about);

      // Clean skills
      const skillsSnap = await getDocs(collection(firestoreDb, 'portfolio_skills'));
      for (const d of skillsSnap.docs) {
        await deleteDoc(doc(firestoreDb, 'portfolio_skills', d.id));
      }
      for (const sk of localBackupData.skills) {
        await setDoc(doc(firestoreDb, 'portfolio_skills', sk.id), { name: sk.name, level: sk.level, category: sk.category });
      }

      // Clean services
      const servicesSnap = await getDocs(collection(firestoreDb, 'portfolio_services'));
      for (const d of servicesSnap.docs) {
        await deleteDoc(doc(firestoreDb, 'portfolio_services', d.id));
      }
      for (const sv of localBackupData.services) {
        await setDoc(doc(firestoreDb, 'portfolio_services', sv.id), { icon: sv.icon, title: sv.title, description: sv.description });
      }

      // Clean projects
      const projectsSnap = await getDocs(collection(firestoreDb, 'portfolio_projects'));
      for (const d of projectsSnap.docs) {
        await deleteDoc(doc(firestoreDb, 'portfolio_projects', d.id));
      }
      for (const pr of localBackupData.projects) {
        await setDoc(doc(firestoreDb, 'portfolio_projects', pr.id), {
          title: pr.title,
          description: pr.description,
          imageUrl: pr.imageUrl,
          tech: pr.tech,
          liveUrl: pr.liveUrl,
          sourceCode: pr.sourceCode,
          category: pr.category
        });
      }

      // Set seeded config again
      await setDoc(configDocRef, { seeded: true, createdAt: new Date().toISOString() });
    }

    res.json({ success: true, message: 'All portfolio nodes and database states have been hard reset back to pristine development defaults.' });
  } catch (error: any) {
    console.error('Error executing admin hard reset:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------
// CONTENT UPDATE CHANNELS (ADMIN SECURED)
// ---------------------------------
app.post('/api/settings/update', verifyAdmin, async (req, res) => {
  try {
    const updatedSettings = req.body;
    // Always keep fallback memory and Firestore in perfect alignment
    localBackupData.settings = { ...localBackupData.settings, ...updatedSettings };
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_data', 'settings'), updatedSettings, { merge: true });
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero/update', verifyAdmin, async (req, res) => {
  try {
    const updatedHero = req.body;
    // Always keep fallback memory and Firestore in perfect alignment
    localBackupData.hero = { ...localBackupData.hero, ...updatedHero };
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_data', 'hero'), updatedHero, { merge: true });
    }
    res.json({ success: true, message: 'Hero content saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/about/update', verifyAdmin, async (req, res) => {
  try {
    const updatedAbout = req.body;
    // Always keep fallback memory and Firestore in perfect alignment
    localBackupData.about = { ...localBackupData.about, ...updatedAbout };
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_data', 'about'), updatedAbout, { merge: true });
    }
    res.json({ success: true, message: 'About section saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Skills management (Secure Admin Endpoints)
app.post('/api/skills', verifyAdmin, async (req, res) => {
  try {
    const skill = req.body;
    const skillId = skill.id || 'sk_' + Date.now();
    const cleanSkill = { id: skillId, name: skill.name, level: Number(skill.level), category: skill.category };
    
    // Set fallback backup state with updated array elements
    const index = localBackupData.skills.findIndex(s => s.id === skillId);
    if (index !== -1) {
      localBackupData.skills[index] = cleanSkill;
    } else {
      localBackupData.skills.push(cleanSkill);
    }

    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_skills', skillId), cleanSkill);
    }
    res.json({ success: true, skill: cleanSkill });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    localBackupData.skills = localBackupData.skills.filter(s => s.id !== id);
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'portfolio_skills', id));
    }
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Services management (Secure Admin Endpoints)
app.post('/api/services', verifyAdmin, async (req, res) => {
  try {
    const service = req.body;
    const serviceId = service.id || 'sv_' + Date.now();
    const cleanService = { id: serviceId, icon: service.icon || 'Code', title: service.title, description: service.description };

    const index = localBackupData.services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      localBackupData.services[index] = cleanService;
    } else {
      localBackupData.services.push(cleanService);
    }

    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_services', serviceId), cleanService);
    }
    res.json({ success: true, service: cleanService });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/services/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    localBackupData.services = localBackupData.services.filter(s => s.id !== id);
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'portfolio_services', id));
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Projects Management (Secure Admin Endpoints)
app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    const proj = req.body;
    const projId = proj.id || 'proj_' + Date.now();
    const cleanProj = {
      id: projId,
      title: proj.title,
      description: proj.description,
      imageUrl: proj.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      tech: Array.isArray(proj.tech) ? proj.tech : proj.tech.split(',').map((t: string) => t.trim()),
      liveUrl: proj.liveUrl || '#',
      sourceCode: proj.sourceCode || '#',
      category: proj.category || 'web'
    };

    const index = localBackupData.projects.findIndex(p => p.id === projId);
    if (index !== -1) {
      localBackupData.projects[index] = cleanProj;
    } else {
      localBackupData.projects.push(cleanProj);
    }

    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_projects', projId), cleanProj);
    }
    res.json({ success: true, project: cleanProj });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    localBackupData.projects = localBackupData.projects.filter(p => p.id !== id);
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'portfolio_projects', id));
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------
// CONTACT FORM ENDPOINTS
// ---------------------------------
app.post('/api/messages/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields' });
    }

    const newMessage = {
      id: 'msg_' + Date.now(),
      name,
      email,
      subject: subject || 'No Subject',
      message,
      timestamp: new Date().toISOString(),
      read: false,
      replied: false
    };

    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'portfolio_messages', newMessage.id), newMessage);
    } else {
      localBackupData.messages.unshift(newMessage);
    }

    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages', verifyAdmin, async (req, res) => {
  try {
    if (firestoreDb) {
      const messagesSnap = await getDocs(collection(firestoreDb, 'portfolio_messages'));
      const list: any[] = [];
      messagesSnap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      // Sort message from latest to oldest
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return res.json(list);
    } else {
      return res.json(localBackupData.messages);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages/:id/toggle-read', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    let updatedVal = false;
    
    if (firestoreDb) {
      const msgRef = doc(firestoreDb, 'portfolio_messages', id);
      const msgDoc = await getDoc(msgRef);
      if (msgDoc.exists()) {
        updatedVal = !msgDoc.data()?.read;
        await updateDoc(msgRef, { read: updatedVal });
      }
    } else {
      const idx = localBackupData.messages.findIndex(m => m.id === id);
      if (idx !== -1) {
        localBackupData.messages[idx].read = !localBackupData.messages[idx].read;
        updatedVal = localBackupData.messages[idx].read;
      }
    }
    res.json({ success: true, read: updatedVal });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages/:id/reply', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (firestoreDb) {
      const msgRef = doc(firestoreDb, 'portfolio_messages', id);
      await updateDoc(msgRef, { replied: true });
    } else {
      const idx = localBackupData.messages.findIndex(m => m.id === id);
      if (idx !== -1) {
        localBackupData.messages[idx].replied = true;
      }
    }
    res.json({ success: true, message: 'Message marked as replied' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'portfolio_messages', id));
    } else {
      localBackupData.messages = localBackupData.messages.filter(m => m.id !== id);
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------
// CHATBOT / AI CHAT ENGINE
// ---------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    let customKey = "";
    let chatBotEnabled = true;

    // Load developer API key or fallback to environment key
    if (firestoreDb) {
      const settingsSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'settings'));
      if (settingsSnap.exists()) {
        const sd = settingsSnap.data();
        customKey = sd?.customApiKey || "";
        chatBotEnabled = sd?.chatbotEnabled !== false;
      }
    } else {
      customKey = localBackupData.settings.customApiKey || "";
      chatBotEnabled = localBackupData.settings.chatbotEnabled;
    }

    if (!chatBotEnabled) {
      return res.json({ response: "The portfolio chatbot is currently disabled by the administrator." });
    }

    const apiKey = customKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ response: "AI Companion is currently sleeping (API key is not configured yet). Drop a line in the Contact form to reach me!" });
    }

    // Initialize Google GenAI with the verified API key
    const ai = new GoogleGenAI({ apiKey });
    
    // Build context about the developer
    let profileContext = "";
    if (firestoreDb) {
      const heroSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'hero'));
      const hero = heroSnap.exists() ? heroSnap.data() : localBackupData.hero;
      const aboutSnap = await getDoc(doc(firestoreDb, 'portfolio_data', 'about'));
      const about = aboutSnap.exists() ? aboutSnap.data() : localBackupData.about;
      profileContext = `
        You are the AI assistant representing ${hero.name}. Keep your responses warm, elegant, concise, and highly professional.
        Here details about ${hero.name}:
        - Title: ${hero.subtitle}
        - Introduction: ${hero.introParagraph}
        - Statistics: ${hero.experienceYears} Years of experience, ${hero.projectsCompleted} Projects completed, ${hero.clientsWorked} Clients, ${hero.awardsWon} Awards.
        - Bio: ${about.description}
        - Key Details: Email is ${about.email}, Phone is ${about.phone}, Location is ${about.location}.
      `;
    } else {
      profileContext = `
        You are the AI assistant representing ${localBackupData.hero.name}. Keep your responses warm, elegant, concise, and highly professional.
        Here are details:
        - Title: ${localBackupData.hero.subtitle}
        - Bio: ${localBackupData.about.description}
        - Email: ${localBackupData.about.email}
        - Location: ${localBackupData.about.location}
      `;
    }

    const systemInstruction = `
      ${profileContext}
      Always speak from the perspective of an AI helper managing ${localBackupData.hero.name}'s virtual portfolio.
      Be enthusiastic about hiring, custom development, responsive websites, motion designs, or layout consultation.
      Answer questions about skills, pricing guidelines, services, and locations. Give exact, useful, non-rambling answers.
      Keep content in clear human terms, occasionally highlighting futuristic tech elements in your description.
    `;

    // Map conversation logs format
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const aiTextResponse = result.text || "I'm processing that. Let me review and follow up!";

    // Save logs
    const logItem = {
      message,
      reply: aiTextResponse,
      timestamp: new Date().toISOString()
    };
    if (firestoreDb) {
      await addDoc(collection(firestoreDb, 'portfolio_chat_logs'), logItem);
    } else {
      localBackupData.chatLogs.push(logItem);
    }

    res.json({ response: aiTextResponse });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.json({ response: `Hey! I ran into an authentication or communication hiccup. Please configure valid API credentials in the Admin settings! Error info: ${error.message}` });
  }
});

// Admin endpoint to view Chatbot histories
app.get('/api/chat/history', verifyAdmin, async (req, res) => {
  try {
    if (firestoreDb) {
      const logsSnap = await getDocs(collection(firestoreDb, 'portfolio_chat_logs'));
      const list: any[] = [];
      logsSnap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return res.json(list.slice(0, 50)); // Last 50 conversations
    } else {
      return res.json(localBackupData.chatLogs.reverse());
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched successfully at http://localhost:${PORT}`);
  });
}

startServer();
