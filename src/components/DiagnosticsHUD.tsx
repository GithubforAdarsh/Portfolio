import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink, 
  Mail, 
  Phone, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Server 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { CANDIDATE_INFO } from '../data/portfolioData';
import './DiagnosticsHUD.css';

interface DiagnosticsHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsHUD: React.FC<DiagnosticsHUDProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="hud-overlay" role="dialog" aria-modal="true" aria-labelledby="hud-title">
      <div className="hud-window infra-card">
        {/* Top Telemetry Header */}
        <div className="hud-header mono">
          <div className="hud-header-left">
            <Terminal size={18} className="text-cyan" />
            <span id="hud-title" className="hud-title">
              SYSTEM DIAGNOSTICS &amp; RECRUITER BRIEFING // HUD v2.4
            </span>
          </div>
          <button onClick={onClose} className="hud-close-btn" aria-label="Close Diagnostics HUD">
            <X size={20} />
          </button>
        </div>

        {/* HUD Content Grid */}
        <div className="hud-body">
          {/* Left Column: 10-Second Executive Summary */}
          <div className="hud-summary-col">
            <div className="hud-section-tag mono">
              <span className="dot cyan"></span>
              <span>10-SECOND EXECUTIVE BRIEF (RECRUITER MODE)</span>
            </div>

            <div className="candidate-brief-card">
              <h3 className="brief-name">{CANDIDATE_INFO.name}</h3>
              <div className="brief-role mono text-cyan">{CANDIDATE_INFO.role}</div>
              <p className="brief-text">{CANDIDATE_INFO.summary}</p>
            </div>

            {/* Core Competency Matrix */}
            <div className="brief-specs-grid mono">
              <div className="brief-spec-item">
                <span className="spec-title">PRIMARY AWS SERVICES:</span>
                <span className="spec-data">EC2, VPC, ALB, ASG, RDS, CloudWatch, SNS, S3, IAM</span>
              </div>
              <div className="brief-spec-item">
                <span className="spec-title">BACKEND &amp; LANGUAGES:</span>
                <span className="spec-data">Node.js, Express, FastAPI, Python, SQL, JavaScript</span>
              </div>
              <div className="brief-spec-item">
                <span className="spec-title">EDUCATION &amp; DEGREE:</span>
                <span className="spec-data">B.Tech CSE (Cloud-Based Apps) - Ganpat University (2023-2026)</span>
              </div>
              <div className="brief-spec-item">
                <span className="spec-title">INTERNSHIP EXPERIENCE:</span>
                <span className="spec-data">Grras IT Solution (Cloud) &amp; IBhavan (Cloud Workflows)</span>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="hud-actions-row">
              <a
                href="/ADARSH_CLOUD_DEVOPS_RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mono btn-sm"
              >
                <FileText size={14} />
                <span>DOWNLOAD RESUME PDF</span>
              </a>

              <button
                onClick={() => copyToClipboard(CANDIDATE_INFO.email, 'email')}
                className="btn btn-secondary mono btn-sm"
              >
                {copiedEmail ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copiedEmail ? 'COPIED!' : 'COPY EMAIL'}</span>
              </button>

              <button
                onClick={() => copyToClipboard(CANDIDATE_INFO.phone, 'phone')}
                className="btn btn-secondary mono btn-sm"
              >
                {copiedPhone ? <Check size={14} className="text-green" /> : <Phone size={14} />}
                <span>{copiedPhone ? 'COPIED!' : 'COPY PHONE'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Infrastructure Telemetry State */}
          <div className="hud-telemetry-col">
            <div className="hud-section-tag mono">
              <span className="dot green"></span>
              <span>LIVE INFRASTRUCTURE TELEMETRY STATE</span>
            </div>

            <div className="telemetry-table mono">
              <div className="telemetry-row">
                <span className="t-key">TARGET ENVIRONMENT:</span>
                <span className="t-val text-green">AWS Production (Verified)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">PRIMARY AWS REGION:</span>
                <span className="t-val">ap-south-1 (Mumbai)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">AVAILABILITY ZONES:</span>
                <span className="t-val">ap-south-1a, ap-south-1b (Multi-AZ)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">VPC NETWORK ISOLATION:</span>
                <span className="t-val text-cyan">10.0.0.0/16 (Public + Private Subnets)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">LOAD BALANCING:</span>
                <span className="t-val">ALB Layer 7 (Round Robin, SSL)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">AUTO SCALING CONFIG:</span>
                <span className="t-val">Dynamic Target Tracking (CPU &gt; 70%)</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">DATABASE PERSISTENCE:</span>
                <span className="t-val">Amazon RDS MySQL + Multi-AZ</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">PROACTIVE OBSERVABILITY:</span>
                <span className="t-val text-amber">CloudWatch Alarms + SNS Real-Time</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">AI PIPELINE ENGINE:</span>
                <span className="t-val text-violet">FastAPI + OpenCV + TensorFlow CNN</span>
              </div>
              <div className="telemetry-row">
                <span className="t-key">AWS CREDENTIALS:</span>
                <span className="t-val text-green">3 Verified Skill Builder Badges</span>
              </div>
            </div>

            {/* External Links */}
            <div className="hud-social-links mono">
              <a
                href={CANDIDATE_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <LinkedinIcon size={15} />
                <span>LINKEDIN</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={CANDIDATE_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <GithubIcon size={15} />
                <span>GITHUB</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={`mailto:${CANDIDATE_INFO.email}`}
                className="social-btn"
              >
                <Mail size={15} />
                <span>EMAIL DIRECT</span>
              </a>
            </div>
          </div>
        </div>

        {/* HUD Footer */}
        <div className="hud-footer mono">
          <span className="text-muted">HOTKEY SHORTCUT: PRESS [~] OR [ESC] TO TOGGLE THIS PANEL AT ANY TIME</span>
          <span className="text-green">VERIFIED RESUME ALIGNED</span>
        </div>
      </div>
    </div>
  );
};
