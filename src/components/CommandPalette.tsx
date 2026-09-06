import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  X, 
  Layers, 
  Sliders, 
  Cpu, 
  FileText, 
  Mail, 
  Phone, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  Server 
} from 'lucide-react';
import { useSystemState } from '../context/SystemStateContext';
import { CANDIDATE_INFO } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon } from './Icons';
import { audioSynth } from '../utils/audio';
import './CommandPalette.css';

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'SIMULATIONS' | 'RECRUITER ACTIONS' | 'SETTINGS';
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    simulateSpike, 
    simulateFailure, 
    recoverSystem, 
    soundEnabled, 
    toggleSound,
    setDiagnosticsHudOpen 
  } = useSystemState();

  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      audioSynth.playNodeSelect();
    }
  }, [commandPaletteOpen]);

  const copyInfo = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedText(label);
    audioSynth.playSuccessChord();
    setTimeout(() => {
      setCopiedText(null);
      setCommandPaletteOpen(false);
    }, 1200);
  };

  const navigateTo = (anchorId: string) => {
    setCommandPaletteOpen(false);
    audioSynth.playNodeSelect();
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-hero',
      category: 'NAVIGATION',
      title: '01. System Initialization & Hero',
      subtitle: 'Jump to cloud environment boot sequence and candidate identity',
      icon: Terminal,
      action: () => navigateTo('sys-hero'),
    },
    {
      id: 'nav-arch',
      category: 'NAVIGATION',
      title: '02. AWS Three-Tier Architecture Map',
      subtitle: 'Jump to interactive VPC topology, subnets, and node inspector',
      icon: Layers,
      action: () => navigateTo('architecture'),
    },
    {
      id: 'nav-3tier',
      category: 'NAVIGATION',
      title: '03. Flagship: Three-Tier Scalable Node.js App',
      subtitle: 'Inspect React, Node.js ASG, RDS MySQL, and Interviewer Q&A',
      icon: Server,
      action: () => navigateTo('flagships'),
    },
    {
      id: 'nav-mnist',
      category: 'NAVIGATION',
      title: '04. Flagship: Cloud MNIST AI & Analytics Platform',
      subtitle: 'Open live digit drawing canvas and OpenCV preprocessing lab',
      icon: Cpu,
      action: () => navigateTo('flagships-mnist'),
    },
    {
      id: 'nav-sims',
      category: 'NAVIGATION',
      title: '05. Interactive Cloud Simulators',
      subtitle: 'Launch ASG scaling, ALB failover, and CloudWatch SNS alerts',
      icon: Sliders,
      action: () => navigateTo('simulators'),
    },
    {
      id: 'nav-skills',
      category: 'NAVIGATION',
      title: '06. Technical Systems Matrix',
      subtitle: 'Filter AWS, Backend, DevOps, Security, and ML skills',
      icon: Layers,
      action: () => navigateTo('systems-map'),
    },
    {
      id: 'nav-timeline',
      category: 'NAVIGATION',
      title: '07. Deployments & AWS Credentials',
      subtitle: 'View Grras IT Solution, IBhavan internships, and certifications',
      icon: Terminal,
      action: () => navigateTo('timeline'),
    },
    {
      id: 'nav-contact',
      category: 'NAVIGATION',
      title: '08. System Transmission & Contact',
      subtitle: 'Send direct transmission and view verified contact endpoints',
      icon: Mail,
      action: () => navigateTo('contact'),
    },

    // Simulations
    {
      id: 'sim-spike',
      category: 'SIMULATIONS',
      title: 'Simulate Traffic Surge (ASG Dynamic Scale-Out)',
      subtitle: 'Breaches 70% CPU threshold and triggers automated instance provisioning',
      icon: Zap,
      action: () => {
        setCommandPaletteOpen(false);
        simulateSpike();
      },
    },
    {
      id: 'sim-fault',
      category: 'SIMULATIONS',
      title: 'Inject ALB Target Fault (HTTP 500 Failure)',
      subtitle: 'Forces ALB health check failure to demonstrate zero-downtime draining',
      icon: AlertTriangle,
      action: () => {
        setCommandPaletteOpen(false);
        simulateFailure();
      },
    },
    {
      id: 'sim-reset',
      category: 'SIMULATIONS',
      title: 'Reset Infrastructure to Nominal (200 OK)',
      subtitle: 'Restores baseline 2 EC2 instances, healthy health checks, and low latency',
      icon: RefreshCw,
      action: () => {
        setCommandPaletteOpen(false);
        recoverSystem();
      },
    },

    // Recruiter Actions
    {
      id: 'rec-resume',
      category: 'RECRUITER ACTIONS',
      title: 'Download Resume PDF (Verified Document)',
      subtitle: 'Opens ADARSH_CLOUD_DEVOPS_RESUME.pdf in new tab',
      icon: FileText,
      action: () => {
        setCommandPaletteOpen(false);
        window.open('/ADARSH_CLOUD_DEVOPS_RESUME.pdf', '_blank');
      },
    },
    {
      id: 'rec-hud',
      category: 'RECRUITER ACTIONS',
      title: 'Open 10-Second Recruiter Diagnostic HUD',
      subtitle: 'Executive candidate summary and key AWS infrastructure highlights',
      icon: Terminal,
      action: () => {
        setCommandPaletteOpen(false);
        setDiagnosticsHudOpen(true);
      },
    },
    {
      id: 'rec-email',
      category: 'RECRUITER ACTIONS',
      title: `Copy Email: ${CANDIDATE_INFO.email}`,
      subtitle: 'Click to copy verified email address to clipboard',
      icon: Mail,
      action: () => copyInfo(CANDIDATE_INFO.email, 'Email copied to clipboard!'),
    },
    {
      id: 'rec-phone',
      category: 'RECRUITER ACTIONS',
      title: `Copy Phone: +91 ${CANDIDATE_INFO.phone}`,
      subtitle: 'Click to copy verified telephone number to clipboard',
      icon: Phone,
      action: () => copyInfo(CANDIDATE_INFO.phone, 'Phone number copied to clipboard!'),
    },
    {
      id: 'rec-linkedin',
      category: 'RECRUITER ACTIONS',
      title: 'Open LinkedIn Profile',
      subtitle: 'linkedin.com/in/adarsh-sadanandan',
      icon: LinkedinIcon,
      action: () => {
        setCommandPaletteOpen(false);
        window.open(CANDIDATE_INFO.linkedin, '_blank');
      },
    },
    {
      id: 'rec-github',
      category: 'RECRUITER ACTIONS',
      title: 'Open GitHub Repositories',
      subtitle: 'github.com/GithubforAdarsh',
      icon: GithubIcon,
      action: () => {
        setCommandPaletteOpen(false);
        window.open(CANDIDATE_INFO.github, '_blank');
      },
    },

    // Settings
    {
      id: 'set-sound',
      category: 'SETTINGS',
      title: soundEnabled ? 'Mute Synthesized Audio Telemetry' : 'Enable Synthesized Audio Telemetry',
      subtitle: 'Zero-bandwidth Web Audio API sound effects for interactions',
      icon: soundEnabled ? VolumeX : Volume2,
      action: () => toggleSound(),
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="palette-overlay" onClick={() => setCommandPaletteOpen(false)} role="dialog" aria-modal="true">
      <div className="palette-box infra-card" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="palette-search-bar">
          <Search size={18} className="search-icon text-cyan" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, cloud service, simulation, or recruiter shortcut..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="palette-input mono"
            aria-label="Command search"
          />
          {copiedText && <span className="copied-pill mono">{copiedText}</span>}
          <button 
            onClick={() => setCommandPaletteOpen(false)} 
            className="close-palette-btn mono"
            aria-label="Close command palette"
          >
            [ESC]
          </button>
        </div>

        {/* Commands List */}
        <div className="palette-list" role="listbox">
          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={cmd.id}
                role="option"
                aria-selected={isSelected}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`palette-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="palette-item-icon">
                  <Icon size={16} />
                </div>
                <div className="palette-item-content">
                  <div className="palette-item-title-row">
                    <span className="palette-item-title">{cmd.title}</span>
                    <span className="palette-item-cat mono">{cmd.category}</span>
                  </div>
                  {cmd.subtitle && (
                    <div className="palette-item-sub mono">{cmd.subtitle}</div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredCommands.length === 0 && (
            <div className="palette-no-results mono">
              <span>NO INFRASTRUCTURE COMMAND MATCHING &ldquo;{query}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="palette-footer mono">
          <span>NAVIGATION: [↑] [↓] TO SELECT // [ENTER] TO EXECUTE</span>
          <span className="text-cyan">ADARSH.INFRA COMMAND PROMPT</span>
        </div>
      </div>
    </div>
  );
};
