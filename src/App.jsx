import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, Mail, Github, Linkedin, 
  Globe, Terminal, Cpu, Wifi, Battery, BatteryFull,
  Volume2, Power, X, Minus, Square, Search,
  ChevronUp, Code, Briefcase, ExternalLink, Download, Compass,
  CheckCircle2, Signal, FastForward, Play, Calendar, Star, Sparkles, Smile,
  Bluetooth, Plane, Moon, Sun, RefreshCw, TerminalSquare, ShieldAlert, FileText, Image as ImageIcon
} from 'lucide-react';

// --- AUDIO SYNTHESIZER FOR STARTUP SOUND (DESKTOP ONLY) ---
const playStartupSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq, startTime, duration, volume, type='sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    const base = 0;
    playNote(311.13, base, 3.5, 0.08, 'sine');       
    playNote(392.00, base + 0.05, 3.5, 0.06, 'sine'); 
    playNote(466.16, base + 0.1, 3.5, 0.06, 'sine');  
    playNote(587.33, base + 0.15, 3.5, 0.04, 'sine'); 
    playNote(932.33, base + 0.2, 4, 0.02, 'triangle'); 
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

// --- REAL USER DATA FROM RESUME ---
const PORTFOLIO_DATA = {
  expertise: [
    { title: "Core Security", skills: ["Penetration Testing", "Vulnerability Assessment", "Network Scanning", "Privilege Escalation"] },
    { title: "Security Tools", skills: ["Nmap", "Burp Suite", "Wireshark", "Metasploit", "SQLmap", "Hydra", "Gobuster"] },
    { title: "Development & OS", skills: ["Python", "C/C++", "React", "Kali Linux", "Docker", "Git"] }
  ],
  experience: [
    { id: 1, role: "Cybersecurity Intern", company: "Global Technology & Information Security (GTIS)", period: "12/2024 - 01/2025", desc: "Worked on penetration testing, threat analysis, and incident response. Identified vulnerabilities and enhanced defenses." },
    { id: 2, role: "Founding Member", company: "Secventra", period: "2024", desc: "Assisted in establishing Secventra, contributing to technical setup, security testing methodology, and platform development." },
  ],
  projects: [
    { id: 1, name: "IMHIDE", desc: "Python CLI app for steganography, embedding/extracting encrypted messages in images via LSB with minimal distortion.", tech: ["Python", "Cryptography", "Data-Hiding"], color: "from-purple-500 to-indigo-500" },
    { id: 2, name: "In-Memory Reverse Shell PoC", desc: "Developed a memory-resident reverse shell (no disk writes) to study execution techniques and evaluate EDR detection.", tech: ["C/C++", "Malware Analysis", "Red Teaming"], color: "from-red-500 to-rose-600" },
    { id: 3, name: "C++ System Monitoring Tool", desc: "Windows system monitoring utility for OS internals, keyboard input, and event programming to detect unauthorized captures.", tech: ["C++", "WinAPI", "Memory Management"], color: "from-blue-400 to-cyan-500" },
  ],
  achievements: [
    { id: 1, title: "Top 7% Global Rank on TryHackMe", date: "2024", readTime: "Completed 50+ advanced labs", hasCert: true, certFile: "/certificate.jpg" },
    { id: 2, title: "Certified Red Team Operations Management (CRTOM)", date: "Certification", readTime: "redteamleaders", hasCert: true, certFile: "/certificate.jpg" },
    { id: 3, title: "OSCP (In Progress)", date: "Certification", readTime: "OffSec", hasCert: false },
    { id: 4, title: "Cyber Job Simulations (Deloitte, MasterCard, Tata)", date: "Experience", readTime: "Forage", hasCert: false },
  ]
};

// --- ICONS & AVATARS ---
const WindowsLogo = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 87 87" className={className}>
    <rect x="0" y="0" width="41" height="41" fill="#00a4ef" />
    <rect x="46" y="0" width="41" height="41" fill="#00a4ef" />
    <rect x="0" y="46" width="41" height="41" fill="#00a4ef" />
    <rect x="46" y="46" width="41" height="41" fill="#00a4ef" />
  </svg>
);

const UserIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

// Profile Picture Component (Fixed clean URL)
const ProfilePicture = () => (
  <img 
    src="https://github.com/janushsahni.png" 
    alt="Janush Sahni" 
    className="w-full h-full rounded-full object-cover"
    onError={(e) => {
      e.target.onerror = null; 
      e.target.src = "https://ui-avatars.com/api/?name=Janush+Sahni&background=0D8ABC&color=fff&size=256";
    }}
  />
);

// --- STATIC AESTHETIC WALLPAPER (DESKTOP ONLY) (Fixed clean URL) ---
const DesktopWallpaper = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f172a]">
    <img 
      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
      alt="Aesthetic macOS style wallpaper" 
      className="absolute w-full h-full object-cover opacity-90"
    />
    <div className="absolute inset-0 bg-black/20"></div>
  </div>
);

// --- IOS DYNAMIC WALLPAPER (MOBILE ONLY) ---
const MobileWallpaper = () => (
  <>
    <style>{`
      .ios-bg-mesh {
        background-color: #050510;
        background-image: 
          radial-gradient(at 0% 0%, hsla(253,16%,12%,1) 0, transparent 50%), 
          radial-gradient(at 50% 0%, hsla(225,39%,20%,1) 0, transparent 50%), 
          radial-gradient(at 100% 0%, hsla(339,49%,20%,1) 0, transparent 50%);
      }
      .ios-blob {
        position: absolute;
        filter: blur(80px);
        border-radius: 50%;
        opacity: 0.85;
      }
      
      @keyframes iosFloat1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(10vw, 15vh) scale(1.1); }
      }
      @keyframes iosFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-10vw, -10vh) scale(1.05); }
      }
      @keyframes iosFloat3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-5vw, 15vh) scale(1.15); }
      }
    `}</style>
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ios-bg-mesh">
      <div className="ios-blob w-[80vw] h-[80vh] top-[-20%] left-[-10%] bg-[#007aff] animate-[iosFloat1_22s_infinite_ease-in-out]"></div>
      <div className="ios-blob w-[90vw] h-[90vh] bottom-[-20%] right-[-20%] bg-[#ff2a5f] animate-[iosFloat2_28s_infinite_ease-in-out]"></div>
      <div className="ios-blob w-[70vw] h-[70vh] top-[20%] left-[30%] bg-[#7b2cbf] animate-[iosFloat3_25s_infinite_ease-in-out]"></div>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[30px]"></div>
    </div>
  </>
);

// --- NETFLIX-STYLE LOGO ANIMATION COMPONENT ---
const NetflixLogoScreen = ({ onComplete }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes netflixZoom {
          0% { transform: scale(0.5); opacity: 0; text-shadow: 0 0 0px rgba(229, 9, 20, 0); }
          15% { transform: scale(1); opacity: 1; text-shadow: 0 0 20px rgba(229, 9, 20, 0.8); }
          60% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 40px rgba(229, 9, 20, 1); }
          100% { transform: scale(15); opacity: 0; text-shadow: 0 0 100px rgba(229, 9, 20, 1); }
        }
        .netflix-logo {
          animation: netflixZoom 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          color: #E50914;
          font-weight: 900;
          font-size: clamp(3rem, 8vw, 6rem);
          letter-spacing: -2px;
          display: inline-block;
          white-space: nowrap;
        }
      `}</style>
      <div className="absolute inset-0 bg-black flex items-center justify-center z-[100] overflow-hidden">
         <div className="netflix-logo">JANYSHH</div>
      </div>
    </>
  );
};

// --- IOS 26 DYNAMIC ISLAND FACE ID SCREEN ---
const FaceIdScreen = ({ onComplete }) => {
  const [islandState, setIslandState] = useState('idle');

  useEffect(() => {
    let isMounted = true;
    const runAnimation = async () => {
      await new Promise(r => setTimeout(r, 400));
      if(!isMounted) return; setIslandState('expanding');
      
      await new Promise(r => setTimeout(r, 500));
      if(!isMounted) return; setIslandState('scanning');
      
      await new Promise(r => setTimeout(r, 1200));
      if(!isMounted) return; setIslandState('success');
      
      await new Promise(r => setTimeout(r, 800));
      if(!isMounted) return; setIslandState('collapsing');
      
      await new Promise(r => setTimeout(r, 500));
      if(!isMounted) return; onComplete();
    };
    runAnimation();
    return () => { isMounted = false; };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-[#09090b] flex flex-col items-center pt-1 z-[100] overflow-hidden">
       {/* iOS Status Bar Mock during unlock */}
       <div className="absolute top-0 w-full flex justify-between px-6 pt-3 text-xs font-semibold text-white z-[90] pointer-events-none opacity-60">
         <span>{new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
         <div className="flex items-center gap-1.5">
           <Signal size={12} />
           <Wifi size={12} />
           <BatteryFull size={14} className="ml-1" />
         </div>
       </div>

       {/* Dynamic Island Pill */}
       <div className={`bg-black transition-all duration-500 flex items-center justify-center relative z-[100] shadow-[0_0_20px_rgba(0,0,0,0.8)]
         ${(islandState === 'idle' || islandState === 'collapsing') ? 'w-[120px] h-[35px] rounded-[24px] mt-1' : 'w-[160px] h-[160px] rounded-[42px] mt-5'}
       `}
       style={{
         transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Authentic iOS Spring Physics
       }}
       >
         {/* Scanning Animation */}
         <div className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${islandState === 'scanning' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[70px] h-[70px] border-2 border-blue-500/30 rounded-2xl animate-[spin_3s_linear_infinite]"></div>
              <Smile size={42} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <span className="text-blue-400 text-[10px] font-bold tracking-widest mt-4 opacity-80">FACE ID</span>
         </div>

         {/* Success Animation */}
         <div className={`absolute flex flex-col items-center justify-center transition-all duration-300 delay-100 ${islandState === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative flex items-center justify-center bg-green-500/20 w-[70px] h-[70px] rounded-full">
              <Smile size={42} className="text-green-400" strokeWidth={2} />
            </div>
         </div>
       </div>
    </div>
  );
};

// --- BOOT SCREENS ---
const BiosScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const allLines = [
    "American Megatrends Inc.",
    "BIOS Date: 02/20/26 03:43:00 Ver: 04.06.05",
    "CPU: Intel(R) Core(TM) i9-14900K @ 3.20GHz",
    "Speed: 3.20 GHz",
    "Press DEL to run Setup",
    "Press F11 for Boot Menu",
    "Single-Channel Memory Mode",
    "65536MB OK",
    "USB Devices total: 1 Drive, 1 Keyboard, 1 Mouse, 1 Hub",
    "Detected ATA/ATAPI Devices...",
    "SATA6G_1: NVMe SSD 2TB",
    "SATA6G_2: None",
    "Booting from Hard Disk...",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < allLines.length) {
        setLines(prev => [...prev, allLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 100); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-black text-gray-300 font-mono text-sm p-4 md:text-base flex flex-col overflow-hidden" onClick={onComplete}>
      {lines.map((line, i) => <div key={i} className="mb-1">{line}</div>)}
      {lines.length < allLines.length && <div className="animate-pulse">_</div>}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-gray-500 animate-pulse cursor-pointer hover:text-white transition-colors">
        <span>Click anywhere to skip</span> <FastForward size={16} />
      </div>
    </div>
  );
};

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    playStartupSound();
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center cursor-pointer" onClick={onComplete}>
      <WindowsLogo className="w-24 h-24 md:w-32 md:h-32 mb-16 animate-pulse" />
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-gray-500 animate-pulse hover:text-white transition-colors">
        <span>Click to skip</span> <FastForward size={16} />
      </div>
    </div>
  );
};

// --- SHARED WINDOW APPS ---
const AboutApp = () => {
  return (
    <div className="p-6 pt-12 md:pt-6 text-gray-800 dark:text-gray-200 h-full overflow-y-auto bg-slate-50/95 dark:bg-slate-900/95 pb-20 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm mt-4 md:mt-0 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-800 shadow-lg flex-shrink-0 relative transition-colors duration-300">
            <ProfilePicture />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full transition-colors duration-300"></div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">Janush Sahni</h1>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-md md:text-sm flex items-center gap-2">
              Cybersecurity Specialist <CheckCircle2 size={16} className="text-blue-500 dark:text-blue-400"/>
            </p>
          </div>
        </div>
        {/* OPENS REAL PDF RESUME FROM PUBLIC FOLDER */}
        <button onClick={() => window.open('/JanushSahniResume.pdf', '_blank')} className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-blue-600 dark:to-indigo-600 hover:from-black hover:to-gray-900 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-medium w-full md:w-auto justify-center transform hover:-translate-y-0.5">
          <FileText size={18} /> View PDF Resume
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Star size={20} className="text-yellow-500"/> About Me</h2>
            <p className="text-md leading-relaxed text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
              A strong enthusiasm for cybersecurity and a commitment to enhancing digital safety are demonstrated through hands-on experience in penetration testing and threat analysis. Skills in ethical hacking and risk assessment have been developed, reflecting a proactive approach to tackling security challenges. A dedication to staying ahead in the rapidly evolving landscape positions me well for contributing to impactful security initiatives and supporting a vision of a safer digital world.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Briefcase size={20} className="text-indigo-500 dark:text-indigo-400"/> Work Experience</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 relative transition-colors duration-300">
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-slate-700 hidden md:block transition-colors duration-300"></div>
              <div className="space-y-6">
                {PORTFOLIO_DATA.experience.map((job) => (
                  <div key={job.id} className="relative md:pl-10">
                    <div className="hidden md:block absolute left-[-29px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 bg-indigo-500 dark:bg-indigo-400 shadow-sm transition-colors duration-300"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{job.role}</h3>
                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 px-2.5 py-1 rounded-full w-fit transition-colors duration-300">
                        <Calendar size={12}/> {job.period}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-2">{job.company}</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{job.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Cpu size={20} className="text-emerald-500 dark:text-emerald-400"/> Technical Skills</h2>
          {PORTFOLIO_DATA.expertise.map((exp, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{exp.title}</h3>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsApp = () => (
  <div className="p-6 pt-16 md:pt-6 bg-slate-50 dark:bg-slate-900 h-full overflow-y-auto pb-20 transition-colors duration-300">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Folder size={28} className="text-blue-500 dark:text-blue-400 fill-blue-500/20 dark:fill-blue-400/20"/> Featured Projects
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PORTFOLIO_DATA.projects.map(proj => (
        <div key={proj.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col transform hover:-translate-y-1">
          {/* Project Image Placeholder */}
          <div className={`h-32 w-full bg-gradient-to-br ${proj.color} relative overflow-hidden flex items-center justify-center`}>
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 dark:bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 dark:text-white shadow-sm flex items-center gap-1 transition-colors">
              <Sparkles size={12} className="text-yellow-500"/> Tech Focus
            </div>
            <TerminalSquare size={48} className="text-white opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{proj.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">{proj.desc}</p>
            
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {proj.tech.map(t => (
                <span key={t} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md border border-gray-200 dark:border-slate-600 transition-colors">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                <Github size={14} /> GitHub Repos
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BlogsApp = () => (
  <div className="h-full flex flex-col bg-white dark:bg-slate-900 pt-10 md:pt-0 pb-10 md:pb-0 transition-colors duration-300">
    <div className="bg-gray-100 dark:bg-slate-800 p-2 border-b dark:border-slate-700 flex items-center gap-2 mt-4 md:mt-0 transition-colors duration-300">
      <div className="flex gap-1 px-2 text-gray-400 dark:text-gray-500">
        <ChevronUp size={16} className="-rotate-90"/>
        <ChevronUp size={16} className="rotate-90"/>
      </div>
      <div className="flex-1 bg-white dark:bg-slate-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-300 border border-transparent dark:border-slate-600 flex items-center justify-center md:justify-start gap-2 shadow-inner transition-colors duration-300">
        <Globe size={14} /> certifications.local
      </div>
    </div>
    <div className="p-6 overflow-y-auto flex-1">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2"><ShieldAlert size={24} className="text-red-500"/> Certifications & Ranks</h2>
      <div className="space-y-4">
        {PORTFOLIO_DATA.achievements.map(ach => (
          <div key={ach.id} className="p-4 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm transition-colors duration-300 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-1">{ach.title}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>{ach.date}</span><span>•</span><span>{ach.readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              {ach.hasCert && (
                <button onClick={() => window.open(ach.certFile, '_blank')} className="text-xs flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors font-semibold border border-blue-200 dark:border-blue-500/30">
                  <ImageIcon size={14} /> View
                </button>
              )}
              <CheckCircle2 size={24} className="text-green-500 opacity-80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactApp = () => (
  <div className="p-6 h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center pb-20 transition-colors duration-300">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transition-colors duration-300">
      <Mail size={32} />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Get In Touch</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
      I'm currently open for new opportunities in Cybersecurity and Development. Send me an email and let's secure the future together.
    </p>
    <div className="flex gap-4 flex-wrap justify-center w-full">
      <button onClick={() => window.location.href = "mailto:janushsahni24@gmail.com"} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl w-full md:w-auto shadow-sm hover:opacity-90 transition-opacity">
        <Mail size={18} /> GMail
      </button>
      <button onClick={() => window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank')} className="flex items-center justify-center gap-2 bg-[#0a66c2] text-white px-6 py-3 rounded-xl w-full md:w-auto shadow-sm hover:opacity-90 transition-opacity">
        <Linkedin size={18} /> LinkedIn
      </button>
      <button onClick={() => window.open('https://github.com/janushsahni', '_blank')} className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-xl w-full md:w-auto shadow-sm hover:opacity-90 transition-opacity border border-transparent dark:border-gray-700">
        <Github size={18} /> GitHub
      </button>
    </div>
  </div>
);

const TerminalApp = () => {
  const [history, setHistory] = useState([
    "Kali Linux v2026.1",
    "root@kali:~#",
    "",
    "Try 'help' to see available commands."
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const currentInput = input;
      const newHistory = [...history, `root@kali:~# ${currentInput}`];
      const cmd = currentInput.trim().toLowerCase();
      
      setInput("");
      
      if (cmd === 'help') {
        newHistory.push("Available commands: help, whoami, clear, date, resume, nmap");
        setHistory(newHistory);
      } else if (cmd === 'whoami') {
        newHistory.push("Janush Sahni - Cybersecurity Professional");
        setHistory(newHistory);
      } else if (cmd === 'clear') {
        setHistory([]);
      } else if (cmd === 'date') {
        newHistory.push(new Date().toString());
        setHistory(newHistory);
      } else if (cmd === 'resume') {
        newHistory.push("Opening resume PDF...");
        setHistory(newHistory);
        window.open('/JanushSahniResume.pdf', '_blank');
      } else if (cmd === 'nmap' || cmd === 'sudo hack' || cmd === 'matrix') {
        const hackLines = [
          "Starting Nmap 7.94 ( https://nmap.org )",
          "Nmap scan report for target-host (192.168.1.100)",
          "Host is up (0.00012s latency).",
          "PORT     STATE SERVICE",
          "22/tcp   open  ssh",
          "80/tcp   open  http",
          "443/tcp  open  https",
          "",
          "[!] VULNERABILITY DETECTED: Talent missing.",
          "[SUCCESS] Deploying payload: Janush Sahni Resume...",
          "----------------------------------------",
          "STATUS: TOP TIER DEVELOPER DETECTED.",
          "RECOMMENDATION: HIRE IMMEDIATELY.",
          "----------------------------------------"
        ];
        newHistory.push(...hackLines);
        setHistory(newHistory);
      } else if (cmd !== '') {
        newHistory.push(`bash: ${cmd}: command not found`);
        setHistory(newHistory);
      }
    }
  };

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

  return (
    <div 
      className="bg-[#0c0c0c]/95 backdrop-blur-md text-[#cccccc] font-mono text-sm h-full p-4 pt-4 overflow-y-auto w-full cursor-text pb-20 md:pb-10" 
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => <div key={i} className={`min-h-[1.25rem] whitespace-pre-wrap break-words mb-1 ${line.includes('SUCCESS') || line.includes('HIRE') ? 'text-[#00ff00] font-bold' : ''}`}>{line}</div>)}
      <div className="flex mt-1 w-full">
        <span className="mr-2 text-red-500 whitespace-nowrap shrink-0 font-bold">root@kali:~#</span>
        <input 
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent outline-none flex-1 text-[#cccccc] min-w-0"
          spellCheck="false"
          autoComplete="off"
        />
      </div>
      <div ref={endRef} className="pb-4" />
    </div>
  );
};

const LinkedinApp = () => (
  <div className="bg-[#f3f2ef] dark:bg-slate-900 h-full overflow-y-auto pb-20 transition-colors duration-300">
    <div className="bg-white dark:bg-slate-800 max-w-2xl mx-auto md:my-4 md:rounded-lg border-x border-b md:border-t border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm min-h-full md:min-h-0 transition-colors duration-300">
      <div className="h-28 md:h-32 bg-gray-900 relative border-b-4 border-blue-500 overflow-hidden">
        {/* Hacker/Cybersecurity Themed Background Cover */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-80"></div>
      </div>
      <div className="px-4 md:px-6 pb-6 relative pt-14">
        <div className="absolute -top-12 left-4 md:left-6 w-24 h-24 bg-white dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-md z-10 transition-colors duration-300">
           {/* Replace Generic UserIcon with actual GitHub profile picture */}
           <ProfilePicture />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">Janush Sahni</h1>
          <p className="text-gray-900 dark:text-gray-300 text-sm mb-1 mt-1 font-medium">Cybersecurity Enthusiast | TryHackMe Top 7% | Python & C++ | BE CSE Student at Chandigarh University</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Rohtak, Haryana, India • 500+ connections</p>
          <div className="flex gap-2 mb-6">
            <button onClick={() => window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank')} className="bg-[#0a66c2] text-white px-5 py-1.5 rounded-full font-semibold text-sm hover:bg-[#004182] transition-colors">Connect</button>
            <button onClick={() => window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank')} className="border-2 border-[#0a66c2] text-[#0a66c2] dark:text-blue-400 dark:border-blue-400 px-5 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">Message</button>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-100 dark:border-slate-600 transition-colors duration-300">
            <h2 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">About</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              A strong enthusiasm for cybersecurity and a commitment to enhancing digital safety are demonstrated through hands-on experience in penetration testing and threat analysis. Skills in ethical hacking and risk assessment have been developed, reflecting a proactive approach to tackling security challenges. 
              {'\n\n'}
              Top 7% global rank on TryHackMe.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


// --- APP DEFINITIONS ---
const ALL_APPS = [
  { id: 'about', title: 'Resume', icon: UserIcon, component: AboutApp, bgColor: 'bg-gradient-to-b from-gray-200 to-gray-300 border-gray-300', iconColor: 'text-gray-700', taskbarColor: 'text-gray-700', hasBadge: false },
  { id: 'projects', title: 'Projects', icon: Folder, component: ProjectsApp, bgColor: 'bg-gradient-to-b from-blue-300 to-blue-500 border-blue-400', iconColor: 'text-white fill-white/20', taskbarColor: 'text-blue-500 fill-blue-500', hasBadge: false },
  { id: 'terminal', title: 'Kali Term', icon: Terminal, component: TerminalApp, bgColor: 'bg-gradient-to-b from-gray-800 to-black border-gray-700', iconColor: 'text-red-500', taskbarColor: 'text-gray-800', hasBadge: false },
  { id: 'linkedin', title: 'LinkedIn', icon: Linkedin, component: LinkedinApp, bgColor: 'bg-gradient-to-b from-[#0077b5] to-[#005582] border-[#0077b5]', iconColor: 'text-white', taskbarColor: 'text-[#0a66c2]', hasBadge: true },
  { id: 'blogs', title: 'Certs', icon: ShieldAlert, component: BlogsApp, bgColor: 'bg-gradient-to-b from-red-500 to-rose-600 border-red-500', iconColor: 'text-white', taskbarColor: 'text-red-500', hasBadge: false },
  { id: 'contact', title: 'Mail', icon: Mail, component: ContactApp, bgColor: 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-500', iconColor: 'text-white', taskbarColor: 'text-blue-500', hasBadge: true },
];

// =========================================================================
// --- MOBILE IOS INTERFACE ---
// =========================================================================
const MobileIOS = ({ isDarkMode, setIsDarkMode }) => {
  const [time, setTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [islandExpanded, setIslandExpanded] = useState(false);

  const touchStartY = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gridApps = ALL_APPS.filter(a => ['terminal', 'blogs'].includes(a.id));
  const dockApps = ALL_APPS.filter(a => ['about', 'projects', 'contact', 'linkedin'].includes(a.id));

  const ActiveComponent = activeApp ? ALL_APPS.find(a => a.id === activeApp)?.component : null;

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY.current > 60 && !activeApp) {
      setShowSearch(true);
    }
  };

  const handleAppClick = (appId, e) => {
    if(e) e.stopPropagation();
    setActiveApp(appId);
  };

  return (
    <div className="absolute inset-0 bg-black overflow-hidden font-sans select-none flex justify-center items-center">
      <div className="relative w-full h-full bg-black overflow-hidden shadow-2xl">
        
        <MobileWallpaper />

        {/* iOS Status Bar */}
        <div className="absolute top-0 w-full flex justify-between px-6 pt-3 text-xs font-semibold text-white z-[90] pointer-events-none drop-shadow-md">
          <span>{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryFull size={14} className="ml-1" />
          </div>
        </div>

        {/* Dynamic Island (Interactive Dark Mode Toggle) */}
        <div 
          onClick={() => setIslandExpanded(!islandExpanded)}
          className={`absolute left-1/2 transform -translate-x-1/2 bg-black z-[95] transition-all duration-300 ease-spring flex items-center justify-center overflow-hidden shadow-[0_0_1px_rgba(255,255,255,0.2)] cursor-pointer
          ${islandExpanded ? 'top-2 w-64 h-16 rounded-[24px]' : 'top-2 w-32 h-7 rounded-full'}`}
        >
          {!islandExpanded && (
             <div className="absolute right-3 flex items-end gap-0.5 h-3 opacity-60">
               <div className="w-0.5 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0ms', height: '6px'}}></div>
               <div className="w-0.5 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '200ms', height: '10px'}}></div>
             </div>
          )}
          {islandExpanded && (
            <div className="flex items-center justify-between w-full px-4 animate-in fade-in duration-200">
               <div className="flex items-center gap-3">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); setIslandExpanded(false); }} 
                   className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center cursor-pointer active:scale-90 transition-all hover:bg-blue-600/40"
                 >
                   {isDarkMode ? <Moon size={14} className="text-blue-400"/> : <Sun size={14} className="text-yellow-400"/>}
                 </button>
                 <div className="flex flex-col">
                   <span className="text-white text-xs font-bold">Status: Ready</span>
                   <span className="text-blue-400 text-[10px]">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                 </div>
               </div>
               <div className="flex items-end gap-0.5 h-4 opacity-80">
                 <div className="w-1 bg-blue-500 rounded-full h-2 animate-pulse" style={{animationDelay: '0ms'}}></div>
                 <div className="w-1 bg-blue-500 rounded-full h-4 animate-pulse" style={{animationDelay: '150ms'}}></div>
                 <div className="w-1 bg-blue-500 rounded-full h-3 animate-pulse" style={{animationDelay: '300ms'}}></div>
               </div>
            </div>
          )}
        </div>

        {/* --- SPOTLIGHT SEARCH OVERLAY --- */}
        <div className={`absolute inset-0 z-[85] bg-black/40 backdrop-blur-xl transition-all duration-300 flex flex-col pt-20 px-4 ${showSearch ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-10'}`} onClick={() => setShowSearch(false)}>
           <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 mb-6 border border-white/20 shadow-lg" onClick={e => e.stopPropagation()}>
              <Search size={18} className="text-white/70" />
              <div className="text-white/90 text-sm font-medium flex-1 flex items-center">
                 <span className="typing-effect overflow-hidden whitespace-nowrap border-r-2 border-blue-400 pr-1">Looking for top talent...</span>
              </div>
           </div>
           
           <h3 className="text-white/60 text-xs font-bold uppercase mb-3 px-2">Quick Actions</h3>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col">
              <div className="flex items-center gap-4 p-4 border-b border-white/10 active:bg-white/20 transition-colors cursor-pointer" onClick={() => { setIsDarkMode(!isDarkMode); setShowSearch(false); }}>
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                   {isDarkMode ? <Moon size={16} className="text-blue-400"/> : <Sun size={16} className="text-yellow-400"/>}
                 </div>
                 <span className="text-white font-medium text-sm">Turn {isDarkMode ? 'Light' : 'Dark'} Mode On</span>
              </div>
              <div className="flex items-center gap-4 p-4 border-b border-white/10 active:bg-white/20 transition-colors cursor-pointer" onClick={() => { setActiveApp('about'); setShowSearch(false); }}>
                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><UserIcon size={16} className="text-white"/></div>
                 <span className="text-white font-medium text-sm">View Janush's Resume</span>
              </div>
              <div className="flex items-center gap-4 p-4 border-b border-white/10 active:bg-white/20 transition-colors cursor-pointer" onClick={() => { setActiveApp('projects'); setShowSearch(false); }}>
                 <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center"><Briefcase size={16} className="text-white"/></div>
                 <span className="text-white font-medium text-sm">See Featured Projects</span>
              </div>
              <div className="flex items-center gap-4 p-4 active:bg-white/20 transition-colors cursor-pointer" onClick={() => window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank')}>
                 <div className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center"><Linkedin size={16} className="text-white"/></div>
                 <span className="text-white font-medium text-sm">Connect on LinkedIn</span>
              </div>
           </div>
        </div>

        {/* --- HOME SCREEN INTERFACE --- */}
        <div 
          className={`absolute inset-0 flex flex-col transition-all duration-300 ${islandExpanded || showSearch ? 'blur-sm scale-[0.98] opacity-80' : 'blur-none scale-100 opacity-100'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          <div className="px-6 pt-24 pb-4 w-full relative z-10">
            {/* Quick Hire Profile Widget */}
            <div 
              className="bg-white/20 backdrop-blur-xl rounded-[1.5rem] p-5 w-full flex items-center justify-between border border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.15)] mb-4 active:scale-95 transition-transform cursor-pointer"
              onClick={() => setActiveApp('about')}
            >
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white border-[3px] border-white/40 shadow-inner overflow-hidden">
                    <ProfilePicture />
                  </div>
                  <div>
                     <p className="text-white font-bold text-lg leading-tight drop-shadow-md">Janush Sahni</p>
                     <p className="text-white/90 text-xs font-medium">Cybersecurity Specialist</p>
                  </div>
               </div>
               <div className="bg-white text-blue-600 px-4 py-2 rounded-full text-xs font-extrabold shadow-lg animate-pulse">Hire Me</div>
            </div>

            {/* Featured Project Small Widget */}
            <div 
              className="bg-gradient-to-br from-red-500/80 to-rose-600/80 backdrop-blur-xl rounded-[1.5rem] p-5 w-full border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)] active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
              onClick={() => setActiveApp('projects')}
            >
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                 <div className="bg-white/20 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider flex items-center gap-1"><Sparkles size={10}/> MALWARE POC</div>
                 <Folder size={20} className="text-white/80"/>
              </div>
              <h3 className="text-white font-bold text-base relative z-10">Memory Reverse Shell</h3>
              <p className="text-white/70 text-xs mt-1 relative z-10">C/C++ • EDR Evasion</p>
            </div>
          </div>

          {/* Regular App Grid */}
          <div className="px-6 grid grid-cols-4 gap-x-4 gap-y-6 mt-2 relative z-10">
            {gridApps.map((app) => (
              <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform relative" onClick={(e) => handleAppClick(app.id, e)}>
                <div className={`w-[60px] h-[60px] flex items-center justify-center rounded-[18px] shadow-lg border border-white/20 relative overflow-hidden ${app.bgColor}`}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                  <app.icon size={30} className={app.iconColor} />
                </div>
                <span className="text-white text-[11px] font-medium drop-shadow-md">{app.title}</span>
              </div>
            ))}
            
            {/* Custom GitHub Shortcut */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform relative" onClick={() => window.open('https://github.com/janushsahni', '_blank')}>
              <div className="w-[60px] h-[60px] flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 border border-gray-600 rounded-[18px] shadow-lg text-white relative overflow-hidden">
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                 <Github size={30} className="relative z-10" />
              </div>
              <span className="text-white text-[11px] font-medium drop-shadow-md">GitHub</span>
            </div>
          </div>

          {/* Dock */}
          <div className="absolute bottom-6 left-4 right-4 h-[90px] bg-white/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-around px-3 z-10 border border-white/30 shadow-2xl">
            {dockApps.map((app) => (
              <div key={app.id} className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform relative" onClick={(e) => handleAppClick(app.id, e)}>
                <div className={`w-[60px] h-[60px] flex items-center justify-center rounded-[18px] shadow-md border border-white/20 relative overflow-hidden ${app.bgColor}`}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                  <app.icon size={30} className={app.iconColor} />
                </div>
                {app.hasBadge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#1e293b] rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">1</div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* --- ACTIVE APP FULL SCREEN --- */}
        <div className={`absolute inset-0 z-[80] transition-all duration-300 ease-in-out flex flex-col bg-white dark:bg-slate-900 overflow-hidden transform origin-center ${activeApp ? 'scale-100 opacity-100 rounded-none' : 'scale-75 opacity-0 rounded-[3rem] pointer-events-none'}`}>
          {ActiveComponent && <ActiveComponent />}
          
          <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-center items-end pb-2 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent">
            <div 
              className="w-1/3 h-1.5 bg-black/90 dark:bg-white/90 rounded-full cursor-pointer hover:bg-black dark:hover:bg-white hover:h-2 hover:w-2/5 active:scale-95 transition-all shadow-sm"
              onClick={() => setActiveApp(null)}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};


// =========================================================================
// --- DESKTOP WINDOWS 11 INTERFACE ---
// =========================================================================
const Desktop = ({ isDarkMode, setIsDarkMode }) => {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [draggingWin, setDraggingWin] = useState(null);
  
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [showActionCenter, setShowActionCenter] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId) => {
    const app = ALL_APPS.find(a => a.id === appId);
    if (!app) return;
    
    const isAlreadyOpen = windows.find(w => w.id === appId);
    if (isAlreadyOpen) {
      if (isAlreadyOpen.minimized) {
        setWindows(windows.map(w => w.id === appId ? { ...w, minimized: false } : w));
      }
      setActiveWindow(appId);
      setStartOpen(false);
      return;
    }

    const newWindow = {
      ...app,
      minimized: false,
      maximized: false, 
      zIndex: windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) + 1 : 10,
    };
    
    setWindows([...windows, newWindow]);
    setActiveWindow(appId);
    setStartOpen(false);
  };

  const closeWindow = (id, e) => {
    if(e) e.stopPropagation();
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  const toggleMaximize = (id, e) => {
    if(e) e.stopPropagation();
    setWindows(windows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  };

  const minimizeWindow = (id, e) => {
    if(e) e.stopPropagation();
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w));
    setActiveWindow(null);
  };

  const focusWindow = (id) => {
    if (activeWindow === id) return;
    const win = windows.find(w => w.id === id);
    let newZ = windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) + 1 : 10;
    if (win && win.minimized) {
      setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: newZ } : w));
    } else {
      setWindows(windows.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
    }
    setActiveWindow(id);
    setStartOpen(false);
  };

  const handlePointerDown = (e, id) => {
    const win = windows.find(w => w.id === id);
    if (win.maximized) return; 

    const el = document.getElementById(`window-${id}`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    
    e.target.setPointerCapture(e.pointerId);
    
    setDraggingWin({
      id,
      startX: e.clientX,
      startY: e.clientY,
      initX: win.customX !== undefined ? win.customX : rect.left,
      initY: win.customY !== undefined ? win.customY : rect.top
    });
    
    if (win.customX === undefined) {
      setWindows(windows.map(w => w.id === id ? {...w, customX: rect.left, customY: rect.top} : w));
    }
    
    focusWindow(id);
  };

  const handlePointerMove = (e) => {
    if (!draggingWin) return;
    const dx = e.clientX - draggingWin.startX;
    const dy = e.clientY - draggingWin.startY;
    
    let newY = draggingWin.initY + dy;
    if (newY < 0) newY = 0;
    
    setWindows(windows.map(w => 
      w.id === draggingWin.id 
        ? { ...w, customX: draggingWin.initX + dx, customY: newY }
        : w
    ));
  };

  const handlePointerUp = (e) => {
    if (draggingWin) {
      e.target.releasePointerCapture(e.pointerId);
      setDraggingWin(null);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    let x = e.pageX;
    let y = e.pageY;
    if (x + 220 > window.innerWidth) x = window.innerWidth - 220;
    if (y + 180 > window.innerHeight) y = window.innerHeight - 180;
    setContextMenu({ show: true, x, y });
  };

  const closeMenus = () => {
    setContextMenu({ show: false, x: 0, y: 0 });
    setShowActionCenter(false);
    setStartOpen(false);
  };

  const visibleWindows = windows.filter(w => !w.minimized);

  return (
    <>
      <div 
        className="fixed inset-0 flex flex-col font-sans text-gray-900 bg-black" 
        onClick={closeMenus}
        onContextMenu={handleContextMenu}
      >
        
        <DesktopWallpaper />

        {/* CUSTOM RIGHT-CLICK CONTEXT MENU */}
        {contextMenu.show && (
          <div 
            className="absolute bg-white/70 dark:bg-slate-800/80 backdrop-blur-3xl border border-white/40 dark:border-slate-600/40 shadow-2xl rounded-xl py-1.5 w-48 z-[99999] animate-in fade-in zoom-in-95 duration-100" 
            style={{ top: contextMenu.y, left: contextMenu.x }} 
            onClick={e => e.stopPropagation()}
            onContextMenu={e => e.preventDefault()}
          >
            <button onClick={() => { openApp('about'); closeMenus(); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"><UserIcon size={14}/> View Resume</button>
            <button onClick={() => closeMenus()} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"><RefreshCw size={14}/> Refresh OS</button>
            <div className="h-px bg-black/10 dark:bg-white/10 my-1"></div>
            <button onClick={() => { openApp('terminal'); closeMenus(); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"><TerminalSquare size={14}/> Open Terminal</button>
            <button onClick={() => { window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank'); closeMenus(); }} className="w-full text-left px-4 py-2 hover:bg-[#0a66c2] hover:text-white text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"><Linkedin size={14}/> Connect on LinkedIn</button>
          </div>
        )}

        {/* WINDOWS 11 ACTION CENTER PANEL */}
        {showActionCenter && (
          <div 
            className="absolute bottom-20 right-4 w-80 bg-white/70 dark:bg-slate-800/80 backdrop-blur-3xl border border-white/40 dark:border-slate-600/40 shadow-2xl rounded-2xl p-5 z-[10000] animate-in slide-in-from-bottom-4 fade-in duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">Action Center <CheckCircle2 size={14} className="text-blue-500"/></h3>
            
            {/* Control Toggles */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-blue-500 text-white p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm"><Wifi size={20} className="mb-1"/><span className="text-[10px] font-bold">Wi-Fi</span></div>
              <div className="bg-blue-500 text-white p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm"><Bluetooth size={20} className="mb-1"/><span className="text-[10px] font-bold">Bluetooth</span></div>
              <div className="bg-white/50 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm transition-colors"><Plane size={20} className="mb-1"/><span className="text-[10px] font-bold">Flight Mode</span></div>
              <div className="bg-white/50 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm transition-colors"><Moon size={20} className="mb-1"/><span className="text-[10px] font-bold">Focus</span></div>
              <div className="bg-white/50 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm transition-colors" onClick={() => setIsDarkMode(!isDarkMode)}>
                 {isDarkMode ? <Moon size={20} className="mb-1 text-blue-400"/> : <Sun size={20} className="mb-1 text-yellow-500"/>}
                 <span className="text-[10px] font-bold">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className="bg-white/50 dark:bg-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-sm transition-colors" onClick={() => openApp('about')}><UserIcon size={20} className="mb-1"/><span className="text-[10px] font-bold">Resume</span></div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-5">
              <div className="flex items-center gap-3">
                <Sun size={16} className="text-gray-500 dark:text-gray-400"/>
                <div className="h-1.5 flex-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-blue-500 rounded-full"></div></div>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 size={16} className="text-gray-500 dark:text-gray-400"/>
                <div className="h-1.5 flex-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-blue-500 rounded-full"></div></div>
              </div>
            </div>

            {/* Recruiter Quick Action - HIre Me */}
            <button onClick={() => window.open('https://www.linkedin.com/in/janush-sahni-8b801922b/', '_blank')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <Sparkles size={16}/> Hire Janush Sahni
            </button>
          </div>
        )}

        {/* Main Desktop Workspace Area */}
        <div 
          className="flex-1 relative overflow-hidden z-10" 
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Mac OS Style Desktop Icons Container */}
          <div className="absolute inset-0 p-6 flex flex-col flex-wrap content-start items-start gap-6 z-0 overflow-hidden pointer-events-none">
            {ALL_APPS.map((app) => (
              <div 
                key={app.id} 
                id={`desktop-icon-${app.id}`}
                className="flex flex-col items-center gap-1.5 w-20 cursor-pointer transition-all hover:scale-105 pointer-events-auto group"
                onClick={(e) => { e.stopPropagation(); openApp(app.id); }} 
              >
                <div className={`w-[68px] h-[68px] flex items-center justify-center rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden ${app.bgColor}`}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                  <app.icon size={34} className={`relative z-10 ${app.iconColor} drop-shadow-md`} />
                </div>
                <span className="text-white text-[12px] text-center font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-md group-hover:bg-blue-600/80 transition-colors">{app.title}</span>
              </div>
            ))}
          </div>

          {/* Render Active Windows with Smart Grid Tiling */}
          {windows.map((win) => {
            if (win.minimized) return null;
            const isActive = activeWindow === win.id;
            const visibleIndex = visibleWindows.findIndex(w => w.id === win.id);
            const totalVisible = visibleWindows.length;
            
            // Default center size
            let width = '800px';
            let height = '600px';
            let left = 'calc(50vw - 400px)';
            let top = 'calc(50vh - 320px)';

            // Smart Auto-Tiling Logic
            if (win.customX === undefined && !win.maximized) {
              if (totalVisible === 2) {
                width = 'calc(50vw - 75px)'; height = 'calc(100vh - 100px)'; top = '20px';
                left = visibleIndex === 0 ? '110px' : 'calc(50vw + 55px)';
              } else if (totalVisible === 3) {
                if (visibleIndex === 0) {
                  width = 'calc(50vw - 75px)'; height = 'calc(100vh - 100px)'; top = '20px'; left = '110px';
                } else {
                  width = 'calc(50vw - 75px)'; height = 'calc(50vh - 60px)'; left = 'calc(50vw + 55px)';
                  top = visibleIndex === 1 ? '20px' : 'calc(50vh + 40px)';
                }
              } else if (totalVisible >= 4) {
                width = 'calc(50vw - 75px)'; height = 'calc(50vh - 60px)';
                left = visibleIndex % 2 === 0 ? '110px' : 'calc(50vw + 55px)';
                top = visibleIndex < 2 ? '20px' : 'calc(50vh + 40px)';
              }
            }

            // User override sizes when dragged
            if (win.customX !== undefined && !win.maximized) {
              left = `${win.customX}px`;
              top = `${win.customY}px`;
              width = '800px';
              height = '600px';
            }
            
            // Maximized override
            if (win.maximized) {
              width = '100vw'; height = '100%'; top = '0px'; left = '0px';
            }

            return (
              <div 
                id={`window-${win.id}`}
                key={win.id}
                className={`absolute bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl border border-white/40 dark:border-slate-600/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out animate-in zoom-in-95 fade-in
                  ${win.maximized ? "rounded-none" : "rounded-2xl min-w-[320px] min-h-[250px]"}
                  ${draggingWin?.id === win.id ? '!transition-none opacity-95 scale-[1.01]' : ''}`}
                style={{ zIndex: win.zIndex, width, height, top, left }}
                onClick={(e) => { e.stopPropagation(); focusWindow(win.id); }}
              >
                <div 
                  className={`h-12 flex items-center justify-between px-4 select-none flex-shrink-0 cursor-move rounded-t-2xl border-b border-white/20 dark:border-slate-600/40 ${isActive ? 'bg-white/80 dark:bg-slate-700/80' : 'bg-white/40 dark:bg-slate-800/40'}`}
                  onPointerDown={(e) => handlePointerDown(e, win.id)}
                >
                  <div className="flex items-center gap-4 w-full overflow-hidden">
                    <div className="flex gap-2 items-center flex-shrink-0">
                      <button onPointerDown={e => e.stopPropagation()} onClick={(e) => closeWindow(win.id, e)} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:bg-[#ff5f56]/80 flex justify-center items-center group shadow-sm">
                        <X size={10} className="opacity-0 group-hover:opacity-100 text-black/60" />
                      </button>
                      <button onPointerDown={e => e.stopPropagation()} onClick={(e) => minimizeWindow(win.id, e)} className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:bg-[#ffbd2e]/80 flex justify-center items-center group shadow-sm">
                        <Minus size={10} className="opacity-0 group-hover:opacity-100 text-black/60" />
                      </button>
                      <button onPointerDown={e => e.stopPropagation()} onClick={(e) => toggleMaximize(win.id, e)} className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:bg-[#27c93f]/80 flex justify-center items-center group shadow-sm hidden md:flex">
                        <Square size={8} className="opacity-0 group-hover:opacity-100 text-black/60" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                      <win.icon size={16} className={`flex-shrink-0 ${win.taskbarColor}`} /> 
                      <span className="truncate">{win.title}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative bg-white/90 dark:bg-slate-900/90 overflow-hidden rounded-b-2xl" onClick={e => e.stopPropagation()}>
                  <win.component />
                </div>
              </div>
            );
          })}

          {/* Start Menu Popup */}
          {startOpen && (
            <div 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[90vw] md:w-[600px] h-[500px] max-h-[80vh] bg-white/70 dark:bg-slate-800/70 backdrop-blur-3xl border border-white/40 dark:border-slate-600/40 shadow-2xl rounded-2xl p-6 flex flex-col z-[1000] animate-in slide-in-from-bottom-4 duration-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Type here to search" className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/60 dark:border-slate-600/60 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white transition-all shadow-inner" />
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Pinned</h3>
                <button className="text-xs bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600 px-2 py-1 rounded shadow-sm transition-colors text-gray-600 dark:text-gray-300">All apps {'>'}</button>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-8">
                {ALL_APPS.map(app => (
                  <div key={`start-${app.id}`} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-2 p-2 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg cursor-pointer transition-colors">
                    <div className={`w-12 h-12 flex items-center justify-center shadow-md border rounded-[1rem] ${app.bgColor}`}>
                        <app.icon size={24} className={app.iconColor} />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate w-full text-center">{app.title}</span>
                  </div>
                ))}
                <div onClick={() => window.open('https://github.com/janushsahni', '_blank')} className="flex flex-col items-center gap-2 p-2 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg cursor-pointer transition-colors">
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 border border-gray-600 shadow-md rounded-[1rem] text-white"><Github size={24}/></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">GitHub</span>
                </div>
              </div>

              <div className="mt-auto bg-white/40 dark:bg-slate-700/40 -mx-6 -mb-6 p-4 border-t border-white/40 dark:border-slate-600/40 rounded-b-2xl flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/40 dark:hover:bg-slate-600 p-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden"><ProfilePicture /></div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Janush Sahni</span>
                </div>
                <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/60 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300" title="Restart"><Power size={18} /></button>
              </div>
            </div>
          )}
        </div>
        
        {/* Taskbar (Ultra Glassmorphism update) */}
        <div className="h-16 w-full shrink-0 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-white/30 dark:border-white/10 z-[999] grid grid-cols-3 px-2 md:px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] relative" onClick={e => e.stopPropagation()}>
          
          <div className="flex items-center justify-start"></div>
          
          <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={(e) => { closeMenus(); setStartOpen(!startOpen); }}
              className={`p-2 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 transition-colors ${startOpen ? 'bg-white/60 dark:bg-white/20 shadow-inner' : ''}`}
            >
              <WindowsLogo className="w-7 h-7" />
            </button>
            {windows.map(win => (
              <button
                key={`taskbar-${win.id}`}
                onClick={() => focusWindow(win.id)}
                className={`h-11 w-11 rounded-lg transition-colors relative flex items-center justify-center flex-shrink-0 group ${activeWindow === win.id ? 'bg-white/60 dark:bg-white/20 shadow-inner' : 'hover:bg-white/40 dark:hover:bg-white/10'}`}
              >
                <win.icon size={24} className={win.taskbarColor} />
                <div className={`absolute bottom-0 h-1 rounded-t-sm transition-all ${activeWindow === win.id ? 'w-5 bg-blue-500' : 'w-2 bg-gray-400/80 group-hover:w-4'}`}></div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-3">
            <div 
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-800 dark:text-gray-200 ${showActionCenter ? 'bg-white/60 dark:bg-white/20 shadow-inner' : 'hover:bg-white/40 dark:hover:bg-white/10'}`}
              onClick={(e) => { closeMenus(); setShowActionCenter(!showActionCenter); }}
            >
              <ChevronUp size={16} className="hidden sm:block"/>
              <Wifi size={16} />
              <Volume2 size={16} />
              <Battery size={16} />
            </div>
            <div className="flex flex-col items-end justify-center px-3 py-1 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 cursor-default transition-colors text-xs text-gray-800 dark:text-gray-200 font-medium">
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>{time.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

// =========================================================================
// --- APP BOOTSTRAPPER (RESPONSIVE ROUTING) ---
// =========================================================================
export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [bootState, setBootState] = useState(() => window.innerWidth < 768 ? 'power-off' : 'bios');
  
  // GLOBAL DARK MODE STATE
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden bg-black select-none ${isDarkMode ? 'dark' : ''}`}>
      {/* 0. Mobile specific power button (Desktop skips this completely) */}
      {bootState === 'power-off' && isMobile && (
        <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900 text-white gap-6">
          <div className="text-center max-w-md p-6">
             <h1 className="text-3xl font-bold mb-4 font-sans tracking-tight">System Offline</h1>
             <p className="text-gray-400 mb-8">Click the power button to initialize the boot sequence and load the portfolio OS.</p>
             <button 
                onClick={() => setBootState('face-id')} 
                className="group relative inline-flex items-center justify-center w-24 h-24 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] border border-zinc-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
             >
               <Power size={40} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
             </button>
          </div>
        </div>
      )}
      
      {/* 1. Mobile specific direct Face-ID sequence */}
      {bootState === 'face-id' && isMobile && <FaceIdScreen onComplete={() => setBootState('netflix')} />}

      {/* Desktop PC Boot sequence mapping */}
      {bootState === 'bios' && !isMobile && <BiosScreen onComplete={() => setBootState('booting')} />}
      {bootState === 'booting' && !isMobile && <BootScreen onComplete={() => setBootState('netflix')} />}
      
      {/* 2. Netflix-style Logo animation for BOTH Mobile and Desktop */}
      {bootState === 'netflix' && <NetflixLogoScreen onComplete={() => setBootState('desktop')} />}
      
      {/* 3. Final OS State */}
      {bootState === 'desktop' && (isMobile ? <MobileIOS isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Desktop isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />)}
    </div>
  );
}
