import React, { useState, useEffect } from 'react';
import { SystemStateProvider, useSystemState } from './context/SystemStateContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ArchitectureMap } from './components/ArchitectureMap';
import { FlagshipThreeTier } from './components/FlagshipThreeTier';
import { FlagshipMNIST } from './components/FlagshipMNIST';
import { CloudSimulators } from './components/CloudSimulators';
import { OtherProjects } from './components/OtherProjects';
import { SkillsConstellation } from './components/SkillsConstellation';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';
import { DiagnosticsHUD } from './components/DiagnosticsHUD';
import { CommandPalette } from './components/CommandPalette';
import { SystemStateController } from './components/SystemStateController';

const PortfolioContent: React.FC = () => {
  const { diagnosticsHudOpen, setDiagnosticsHudOpen } = useSystemState();
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Global Keyboard Shortcuts (Press ~ or Escape to toggle HUD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setDiagnosticsHudOpen(!diagnosticsHudOpen);
      } else if (e.key === 'Escape' && diagnosticsHudOpen) {
        setDiagnosticsHudOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diagnosticsHudOpen, setDiagnosticsHudOpen]);

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  return (
    <div className={`app-root ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Persistent Navigation & Status Header */}
      <Navigation
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        {/* 01. Cinematic Boot Initialization & Hero */}
        <Hero
          onOpenHUD={() => setDiagnosticsHudOpen(true)}
          reducedMotion={reducedMotion}
        />

        {/* 02. Interactive AWS System Architecture Topology Map */}
        <ArchitectureMap />

        {/* 03. Flagship Architectures Section */}
        <section id="flagships" className="flagships-wrapper-section">
          <div className="container">
            <div className="section-header">
              <div className="section-label">
                <span className="dot"></span>
                <span>FLAGSHIP ARCHITECTURAL CASE STUDIES</span>
              </div>
              <h2 className="section-title">Core Systems Engineering</h2>
              <p className="section-description">
                In-depth interactive explorations of two primary cloud applications: an enterprise 
                three-tier AWS infrastructure and a cloud-native handwritten digit classification platform.
              </p>
            </div>

            {/* Flagship 1: Three-Tier Scalable Node.js App on AWS */}
            <FlagshipThreeTier />

            {/* Flagship 2: Cloud-Based MNIST AI & Analytics Platform */}
            <div style={{ marginTop: '70px' }}>
              <FlagshipMNIST />
            </div>

            {/* Other Verified Projects */}
            <OtherProjects />
          </div>
        </section>

        {/* 04. Interactive Cloud Infrastructure Simulators */}
        <CloudSimulators />

        {/* 05. Technical Systems Skills Constellation */}
        <SkillsConstellation />

        {/* 06. Deployments, Education & AWS Certifications Timeline */}
        <Timeline />

        {/* 07. Contact Channel, Transmission Form & Philosophy */}
        <Contact />
      </main>

      {/* Recruiter & Hiring Manager Quick HUD Modal */}
      <DiagnosticsHUD
        isOpen={diagnosticsHudOpen}
        onClose={() => setDiagnosticsHudOpen(false)}
      />

      {/* Interactive Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Floating System State & Chaos Controller */}
      <SystemStateController />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SystemStateProvider>
      <PortfolioContent />
    </SystemStateProvider>
  );
};
