import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Activity, 
  Terminal, 
  Menu, 
  X, 
  FileText, 
  Zap, 
  Sliders, 
  Layers, 
  Cpu, 
  GitBranch, 
  Send,
  Search,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSystemState } from '../context/SystemStateContext';
import { audioSynth } from '../utils/audio';
import './Navigation.css';

interface NavigationProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  reducedMotion, 
  onToggleReducedMotion 
}) => {
  const { 
    systemState, 
    latency, 
    alarmActive,
    setDiagnosticsHudOpen, 
    setCommandPaletteOpen, 
    soundEnabled, 
    toggleSound 
  } = useSystemState();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('sys-hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['sys-hero', 'architecture', 'flagships', 'simulators', 'systems-map', 'timeline', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'sys-hero', label: '01.SYS_INIT', icon: Terminal },
    { id: 'architecture', label: '02.ARCH_MAP', icon: Layers },
    { id: 'flagships', label: '03.FLAGSHIPS', icon: Cpu },
    { id: 'simulators', label: '04.SIMULATORS', icon: Sliders },
    { id: 'systems-map', label: '05.SKILLS_GRAPH', icon: GitBranch },
    { id: 'timeline', label: '06.DEPLOYMENTS', icon: Activity },
    { id: 'contact', label: '07.CONNECT', icon: Send },
  ];

  const getStateBadgeClass = () => {
    switch (systemState) {
      case 'TRAFFIC_SPIKE': return 'badge-amber';
      case 'AUTO_SCALING': return 'badge-cyan';
      case 'DEGRADED_FAULT': return 'badge-alert';
      case 'SELF_HEALING': return 'badge-cyan';
      case 'NOMINAL':
      default: return 'badge-green';
    }
  };

  return (
    <header className={`infra-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Left Telemetry Brand */}
        <a 
          href="#sys-hero" 
          className="nav-brand" 
          aria-label="Adarsh System Control Center"
          onClick={() => audioSynth.playNodeSelect()}
        >
          <div className="brand-icon">
            <Server size={18} className="icon-cyan" />
            <span className={`brand-dot pulse ${alarmActive ? 'amber-dot' : ''}`}></span>
          </div>
          <div className="brand-text">
            <div className="brand-title">ADARSH.INFRA</div>
            <div className="brand-meta mono">AWS // ap-south-1 // PROD</div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link mono ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => audioSynth.playNodeSelect()}
              >
                <Icon size={14} className="nav-link-icon" />
                <span>{item.label}</span>
                {isActive && <span className="active-pill" />}
              </a>
            );
          })}
        </nav>

        {/* Right Status Actions */}
        <div className="nav-actions">
          {/* Command Palette Trigger Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="palette-trigger-btn mono"
            title="Open Command Palette (Ctrl+K or ⌘K)"
            aria-label="Open Command Palette"
          >
            <Search size={13} />
            <span className="key-hint">⌘K</span>
          </button>

          {/* Status Badge -> Opens HUD */}
          <button 
            onClick={() => {
              setDiagnosticsHudOpen(true);
              audioSynth.playNodeSelect();
            }} 
            className={`hud-trigger-btn mono ${getStateBadgeClass()}`}
            title="Open Diagnostic HUD / Recruiter Summary (Shortcut: ~)"
            aria-label="Open System Diagnostics HUD"
          >
            <span className={`status-indicator ${alarmActive ? 'amber' : ''}`}></span>
            <span className="status-label-full">SYS: {systemState} ({latency}ms)</span>
            <span className="status-label-short">{latency}ms</span>
            <span className="hud-key-hint">[~]</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`sound-toggle-btn mono ${soundEnabled ? 'sound-on' : ''}`}
            title={soundEnabled ? 'Mute Telemetry Audio' : 'Enable Web Audio Telemetry'}
            aria-label="Toggle Telemetry Audio"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            className={`motion-toggle-btn mono ${reducedMotion ? 'motion-off' : ''}`}
            title={reducedMotion ? 'Enable Animations' : 'Reduce Motion'}
            aria-label={reducedMotion ? 'Enable Animations' : 'Reduce Motion'}
          >
            <Zap size={13} />
            <span className="motion-label">{reducedMotion ? 'MOTION: OFF' : 'MOTION: ON'}</span>
          </button>

          {/* Resume Quick Link */}
          <a
            href="/ADARSH_CLOUD_DEVOPS_RESUME.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-resume mono"
            title="View Resume PDF"
            onClick={() => audioSynth.playNodeSelect()}
          >
            <FileText size={14} />
            <span>RESUME</span>
          </a>

          {/* Mobile Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <div className="mobile-drawer-header mono">
            <span>SYS_NAV_EXPLORER</span>
            <button 
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)} 
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="mobile-nav-list">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`mobile-nav-link mono ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="mobile-drawer-actions">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCommandPaletteOpen(true);
              }}
              className="btn btn-outline-cyan mono w-full"
            >
              <Search size={14} />
              <span>COMMAND PALETTE (⌘K)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDiagnosticsHudOpen(true);
              }}
              className="btn btn-primary mono w-full"
            >
              <Activity size={14} />
              <span>RECRUITER 10s HUD</span>
            </button>
            <a
              href="/ADARSH_CLOUD_DEVOPS_RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mono w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={14} />
              <span>DOWNLOAD RESUME PDF</span>
            </a>
            <div className="mobile-drawer-toggles">
              <button
                onClick={() => {
                  toggleSound();
                  audioSynth.playNodeSelect();
                }}
                className={`drawer-toggle-btn mono ${soundEnabled ? 'active' : ''}`}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>SOUND: {soundEnabled ? 'ON' : 'MUTED'}</span>
              </button>
              <button
                onClick={onToggleReducedMotion}
                className={`drawer-toggle-btn mono ${reducedMotion ? 'active' : ''}`}
                aria-label="Toggle Motion"
              >
                <Zap size={14} />
                <span>MOTION: {reducedMotion ? 'REDUCED' : 'FULL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
