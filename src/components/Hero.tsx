import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Layers, 
  Sliders, 
  ArrowDown, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Activity, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { CANDIDATE_INFO } from '../data/portfolioData';
import { useSystemState } from '../context/SystemStateContext';
import { audioSynth } from '../utils/audio';
import './Hero.css';

interface HeroProps {
  onOpenHUD: () => void;
  reducedMotion: boolean;
}

interface BootStep {
  text: string;
  status: 'pending' | 'active' | 'done';
}

export const Hero: React.FC<HeroProps> = ({ onOpenHUD, reducedMotion }) => {
  const { systemState, latency, alarmActive } = useSystemState();
  const [bootCompleted, setBootCompleted] = useState(reducedMotion);
  const [bootIndex, setBootIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const bootLogs: string[] = [
    'SYSTEM INITIALIZING...',
    'CLOUD ENVIRONMENT: ONLINE',
    'COMPUTE [EC2/ASG]: ONLINE',
    'NETWORK [VPC/ALB]: ONLINE',
    'DATABASE [RDS/S3]: ONLINE',
    'OBSERVABILITY [CLOUDWATCH/SNS]: ONLINE',
    'READY: THEKKINKATIL ADARSH PROD ENVIRONMENT LOADED.',
  ];

  // Boot sequence logic
  useEffect(() => {
    if (reducedMotion) {
      setBootCompleted(true);
      return;
    }

    if (bootIndex < bootLogs.length) {
      const timer = setTimeout(() => {
        setBootIndex((prev) => prev + 1);
      }, 260); // fast and snappy
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setBootCompleted(true);
      }, 400);
      return () => clearTimeout(finishTimer);
    }
  }, [bootIndex, reducedMotion, bootLogs.length]);

  // Canvas infrastructure node-link interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Node representation: compute nodes & network paths
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 42);
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      type: 'compute' | 'routing' | 'database';
      pulse: number;
    }[] = [];

    const types: ('compute' | 'routing' | 'database')[] = ['compute', 'routing', 'database'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 2,
        type: types[i % types.length],
        pulse: Math.random() * Math.PI,
      });
    }

    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connection lines between adjacent nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes & cursor interaction
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!reducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          node.pulse += 0.03;

          // Gentle mouse pull
          if (mouse.active) {
            const mdx = mouse.x - node.x;
            const mdy = mouse.y - node.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 180) {
              const force = (1 - mdist / 180) * 0.6;
              node.x += (mdx / mdist) * force;
              node.y += (mdy / mdist) * force;

              // Draw mouse connection
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - mdist / 180) * 0.35})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        ctx.beginPath();
        const pulseSize = node.radius + Math.sin(node.pulse) * 0.8;
        ctx.arc(node.x, node.y, Math.max(1.5, pulseSize), 0, Math.PI * 2);

        if (node.type === 'compute') {
          ctx.fillStyle = '#00f0ff';
        } else if (node.type === 'routing') {
          ctx.fillStyle = '#10b981';
        } else {
          ctx.fillStyle = '#a855f7';
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  return (
    <section id="sys-hero" className="hero-section">
      {/* Background Interactive Mesh */}
      <div className="hero-canvas-container" aria-hidden="true">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>

      <div className="container hero-content">
        {/* Terminal Boot Sequence (Fast Cinematic reveal) */}
        {!bootCompleted ? (
          <div className="boot-terminal infra-card" role="status" aria-live="polite">
            <div className="terminal-header mono">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="terminal-title">AWS_CLOUD_INIT // BOOT_SEQUENCE.sh</span>
              <button
                onClick={() => setBootCompleted(true)}
                className="skip-boot-btn mono"
                title="Skip sequence"
              >
                [ SKIP SEQUENCE ]
              </button>
            </div>

            <div className="terminal-body mono">
              {bootLogs.slice(0, bootIndex + 1).map((log, idx) => (
                <div key={idx} className="terminal-line">
                  <span className="line-prefix">&gt;</span>
                  <span className={idx === bootIndex ? 'line-active' : 'line-done'}>
                    {log}
                  </span>
                  {idx === bootIndex && <span className="cursor-blink">_</span>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Revealed Main Architecture Hero */
          <div className="hero-revealed">
            {/* System Status Banner */}
            <div className={`hero-status-pill mono ${alarmActive ? 'amber-alert' : ''}`}>
              <span className={`pulse-dot ${alarmActive ? 'amber' : ''}`}></span>
              <span>STATE: {systemState} // AWS ap-south-1</span>
              <span className="pill-divider">|</span>
              <span className="pill-metric">LATENCY: {latency}ms</span>
              <span className="pill-divider">|</span>
              <span className="pill-metric">VPC CIDR: 10.0.0.0/16</span>
            </div>

            {/* Candidate Identity */}
            <div className="hero-title-group">
              <div className="hero-eyebrow mono">
                <span>SYSTEM ARCHITECT &amp; ENGINEER</span>
              </div>
              <h1 className="hero-name">
                <span className="name-highlight">THEKKINKATIL</span> ADARSH
              </h1>
              <div className="hero-role-badge mono">
                <Cpu size={16} className="text-cyan" />
                <span>CLOUD / BACKEND / INFRASTRUCTURE ENGINEER</span>
              </div>
            </div>

            {/* Primary & Secondary Positioning */}
            <p className="hero-primary-statement">
              &ldquo;{CANDIDATE_INFO.primaryPositioning}&rdquo;
            </p>
            <p className="hero-secondary-description">
              {CANDIDATE_INFO.secondaryText}
            </p>

            {/* Architectural Highlights Pill Grid */}
            <div className="hero-spec-grid">
              <div className="spec-item mono">
                <Server size={15} className="spec-icon text-cyan" />
                <div>
                  <div className="spec-label">CORE CLOUD</div>
                  <div className="spec-value">AWS EC2, VPC, ALB, ASG</div>
                </div>
              </div>

              <div className="spec-item mono">
                <Layers size={15} className="spec-icon text-green" />
                <div>
                  <div className="spec-label">ARCHITECTURE</div>
                  <div className="spec-value">3-Tier Multi-AZ Isolated</div>
                </div>
              </div>

              <div className="spec-item mono">
                <Activity size={15} className="spec-icon text-amber" />
                <div>
                  <div className="spec-label">OBSERVABILITY</div>
                  <div className="spec-value">CloudWatch Alarms + SNS</div>
                </div>
              </div>

              <div className="spec-item mono">
                <ShieldCheck size={15} className="spec-icon text-violet" />
                <div>
                  <div className="spec-label">BACKEND &amp; AI</div>
                  <div className="spec-value">Node.js, FastAPI, TensorFlow</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hero-actions">
              <a href="#architecture" className="btn btn-primary">
                <Layers size={16} />
                <span>EXPLORE ARCHITECTURE</span>
              </a>

              <a href="#simulators" className="btn btn-outline-cyan">
                <Sliders size={16} />
                <span>LAUNCH CLOUD LABS</span>
              </a>

              <button onClick={onOpenHUD} className="btn btn-secondary">
                <Terminal size={16} />
                <span>RECRUITER 10s BRIEF</span>
              </button>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator mono">
          <a href="#architecture" aria-label="Scroll to System Architecture">
            <span>SCROLL TO SYSTEM TOPOLOGY</span>
            <ArrowDown size={14} className="bounce-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
};
