import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  VolumeX,
  ChevronRight
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

  // Track active section and navbar blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['sys-hero', 'architecture', 'flagships', 'simulators', 'systems-map', 'timeline', 'contact'];
      const scrollPos = window.scrollY + 220;

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

  // Strict Body Scroll Locking when mobile navigation is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Prevent layout shift from scrollbar disappearing
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [mobileMenuOpen]);

  // Global keyboard shortcuts (Escape to close mobile drawer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        audioSynth.playNodeSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { 
      id: 'sys-hero', 
      label: '01.SYS_INIT', 
      subLabel: 'System initialization, profile & live topology', 
      icon: Terminal 
    },
    { 
      id: 'architecture', 
      label: '02.ARCH_MAP', 
      subLabel: 'Interactive AWS multi-topology architecture & packet tracer', 
      icon: Layers 
    },
    { 
      id: 'flagships', 
      label: '03.FLAGSHIPS', 
      subLabel: '3-Tier scalable Node.js architecture & MNIST AI platform', 
      icon: Cpu 
    },
    { 
      id: 'simulators', 
      label: '04.SIMULATORS', 
      subLabel: 'Auto Scaling fleet, ALB fault injection & CloudWatch SNS', 
      icon: Sliders 
    },
    { 
      id: 'systems-map', 
      label: '05.SKILLS_GRAPH', 
      subLabel: '8-category filterable systems, DevOps & cloud matrix', 
      icon: GitBranch 
    },
    { 
      id: 'timeline', 
      label: '06.DEPLOYMENTS', 
      subLabel: 'Career timeline, education & AWS credential badges', 
      icon: Activity 
    },
    { 
      id: 'contact', 
      label: '07.CONNECT', 
      subLabel: 'Encrypted transmission terminal & verified channels', 
      icon: Send 
    },
  ];

  const handleNavSelect = (id: string) => {
    audioSynth.playNodeSelect();
    setMobileMenuOpen(false);
    
    // Smooth scroll with element alignment
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <>
      <header className={`infra-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Left Telemetry Brand Identity */}
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

          {/* Desktop Nav Links (01 to 07) */}
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

          {/* Right Status Actions & Progressive Control Suite */}
          <div className="nav-actions">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                setCommandPaletteOpen(true);
                audioSynth.playNodeSelect();
              }}
              className="palette-trigger-btn mono"
              title="Open Command Palette (Ctrl+K or ⌘K)"
              aria-label="Open Command Palette"
            >
              <Search size={14} />
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

            {/* Web Audio Telemetry Toggle */}
            <button
              onClick={() => {
                toggleSound();
                audioSynth.playNodeSelect();
              }}
              className={`sound-toggle-btn mono ${soundEnabled ? 'sound-on' : ''}`}
              title={soundEnabled ? 'Mute Web Audio Telemetry' : 'Enable Web Audio Telemetry'}
              aria-label="Toggle Telemetry Audio"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Reduced Motion Toggle - Responsive with icon and label */}
            <button
              onClick={() => {
                onToggleReducedMotion();
                audioSynth.playNodeSelect();
              }}
              className={`motion-toggle-btn mono ${reducedMotion ? 'motion-off' : ''}`}
              title={reducedMotion ? 'Enable Animations (Motion: OFF)' : 'Reduce Animations (Motion: ON)'}
              aria-label={reducedMotion ? 'Enable Animations' : 'Reduce Motion'}
            >
              <Zap size={14} />
              <span className="motion-label-full">{reducedMotion ? 'MOTION: OFF' : 'MOTION: ON'}</span>
              <span className="motion-label-short">{reducedMotion ? 'OFF' : 'ON'}</span>
            </button>

            {/* Resume Quick Link */}
            <a
              href="/ADARSH_CLOUD_DEVOPS_RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume mono"
              title="View Resume PDF (opens in new tab)"
              onClick={() => audioSynth.playNodeSelect()}
            >
              <FileText size={14} />
              <span>RESUME</span>
            </a>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              className={`mobile-toggle ${mobileMenuOpen ? 'menu-open' : ''}`}
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                audioSynth.playNodeSelect();
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Portal-Mounted First-Class Mobile Navigation Explorer */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="mobile-nav-drawer"
          className="sys-drawer-portal"
          role="dialog"
          aria-modal="true"
          aria-label="System Navigation Explorer"
        >
          {/* Backdrop Scrim */}
          <div 
            className="drawer-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true" 
          />

          {/* Drawer Surface */}
          <aside className="drawer-surface">
            {/* Drawer Top Header */}
            <div className="drawer-header mono">
              <div className="drawer-title-wrap">
                <Terminal size={16} className="icon-cyan" />
                <span className="drawer-title">ADARSH.INFRA // SYS_NAV</span>
                <span className="pulse-dot-mini"></span>
              </div>
              <button 
                className="drawer-close-btn mono"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation explorer"
              >
                <span className="close-text">[ESC]</span>
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Explorer Body */}
            <div className="drawer-body">
              {/* Live Telemetry Status Chip */}
              <div className="drawer-telemetry-chip mono">
                <div className="telemetry-chip-item">
                  <span className="t-label">REGION:</span>
                  <span className="t-val text-cyan">AWS ap-south-1</span>
                </div>
                <div className="telemetry-chip-item">
                  <span className="t-label">TELEMETRY:</span>
                  <span className={`t-val text-${systemState === 'NOMINAL' ? 'green' : 'amber'}`}>
                    {systemState} ({latency}ms)
                  </span>
                </div>
              </div>

              {/* Navigation Routes List */}
              <div className="drawer-section-label mono">
                <span>SYSTEM DESTINATIONS [01 - 07]</span>
              </div>

              <nav className="drawer-routes-list" aria-label="Mobile Site Navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`drawer-route-card ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavSelect(item.id);
                      }}
                    >
                      <div className="route-card-left">
                        <div className="route-icon-wrap">
                          <Icon size={18} />
                        </div>
                        <div className="route-info">
                          <div className="route-title-row mono">
                            <span className="route-code">{item.label}</span>
                            {isActive && <span className="active-tag">● ACTIVE LOCATION</span>}
                          </div>
                          <div className="route-sub">{item.subLabel}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="route-card-arrow" />
                    </a>
                  );
                })}
              </nav>

              {/* System Utilities & Preferences */}
              <div className="drawer-section-label mono">
                <span>OPERATIONAL UTILITIES &amp; PREFERENCES</span>
              </div>

              <div className="drawer-utilities-grid">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCommandPaletteOpen(true);
                  }}
                  className="drawer-util-btn btn-outline-cyan mono"
                >
                  <Search size={16} />
                  <div className="util-text">
                    <span className="util-title">COMMAND PALETTE</span>
                    <span className="util-meta">Hotkey: ⌘K or Ctrl+K</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDiagnosticsHudOpen(true);
                  }}
                  className="drawer-util-btn btn-primary mono"
                >
                  <Activity size={16} />
                  <div className="util-text">
                    <span className="util-title">RECRUITER 10s HUD</span>
                    <span className="util-meta">Hotkey: Press [~]</span>
                  </div>
                </button>

                <a
                  href="/ADARSH_CLOUD_DEVOPS_RESUME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-util-btn btn-secondary mono"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText size={16} />
                  <div className="util-text">
                    <span className="util-title">DOWNLOAD RESUME PDF</span>
                    <span className="util-meta">Verified ATS Cloud Profile</span>
                  </div>
                </a>
              </div>

              {/* Quick Toggles */}
              <div className="drawer-toggles-row">
                <button
                  onClick={() => {
                    toggleSound();
                    audioSynth.playNodeSelect();
                  }}
                  className={`drawer-toggle-chip mono ${soundEnabled ? 'active-toggle' : ''}`}
                  aria-label="Toggle Web Audio Telemetry"
                >
                  {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  <span>SOUND: {soundEnabled ? 'ENABLED' : 'MUTED'}</span>
                </button>

                <button
                  onClick={() => {
                    onToggleReducedMotion();
                    audioSynth.playNodeSelect();
                  }}
                  className={`drawer-toggle-chip mono ${reducedMotion ? 'active-toggle' : ''}`}
                  aria-label="Toggle Motion Animations"
                >
                  <Zap size={15} />
                  <span>MOTION: {reducedMotion ? 'REDUCED' : 'FULL'}</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Footer */}
            <div className="drawer-footer mono">
              <span>AWS INFRASTRUCTURE // THEKKINKATIL ADARSH</span>
              <span className="footer-close-hint">PRESS [ESC] TO CLOSE</span>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
};
