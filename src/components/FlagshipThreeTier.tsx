import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Activity, 
  Bell, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Cpu, 
  Lock, 
  Workflow 
} from 'lucide-react';
import { FLAGSHIP_THREE_TIER } from '../data/portfolioData';
import './FlagshipThreeTier.css';

export const FlagshipThreeTier: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tiers = [
    {
      id: 'web',
      name: 'Tier 1: Presentation (Web)',
      tech: 'React / Amazon S3 / ALB',
      icon: Globe,
      color: 'cyan',
      description: 'Public-facing ingress handling client traffic, TLS handshake termination, and intelligent reverse proxy routing.',
      points: [
        'React frontend client assets hosted efficiently on Amazon S3 with controlled bucket policies.',
        'Application Load Balancer (ALB) deployed in multi-AZ public subnets acting as single DNS ingress.',
        'Enforces HTTPS termination and forwards requests to private app tier target groups on Port 3000.',
      ],
      security: 'Subnets: Public (10.0.1.0/24). Security Group ingress open on 80/443; egress strictly points to App SG.',
      metrics: 'Health check ping /health every 30s; 2 consecutive healthy checks before traffic assignment.',
    },
    {
      id: 'app',
      name: 'Tier 2: Logic (Application)',
      tech: 'Node.js / Express on EC2 in ASG',
      icon: Server,
      color: 'green',
      description: 'Stateless compute instances processing RESTful APIs and business logic with dynamic horizontal scaling.',
      points: [
        'Node.js Express application running across multiple EC2 instances inside private subnets.',
        'Auto Scaling Group (ASG) dynamically spins up/down instances using Launch Templates and User Data bootstrapping.',
        'Zero public IP allocation: outbound Internet access managed safely via AWS NAT Gateway.',
      ],
      security: 'Subnets: Private (10.0.2.0/24, 10.0.3.0/24). Accepts inbound traffic only from ALB Security Group.',
      metrics: 'Dynamic target tracking scaling policy triggered when average CPU utilization breaches 70%.',
    },
    {
      id: 'data',
      name: 'Tier 3: Persistence (Database)',
      tech: 'Amazon RDS (MySQL Relational Engine)',
      icon: Database,
      color: 'violet',
      description: 'Fully managed relational database layer with Multi-AZ redundancy, automated backups, and storage encryption.',
      points: [
        'Amazon RDS MySQL instance isolated in dedicated private DB subnet with no public routing path.',
        'Strict Security Group rules allowing SQL connection requests (Port 3306) only from Tier 2 App Security Group.',
        'Automated snapshots and Multi-AZ standby failover configured to ensure high data durability.',
      ],
      security: 'Subnets: DB Private (10.0.4.0/24). Ingress restricted exclusively to App Tier Security Group on Port 3306.',
      metrics: 'Automated daily snapshots with point-in-time recovery and transactional integrity.',
    },
    {
      id: 'mgmt',
      name: 'Tier 4: Observability & Management',
      tech: 'Amazon CloudWatch + SNS + IAM',
      icon: Activity,
      color: 'amber',
      description: 'Continuous operational monitoring, automated alarm triggers, and least-privilege identity management.',
      points: [
        'Amazon CloudWatch dashboards actively track EC2 CPU utilization, network I/O, and ALB 5XX error rates.',
        'Integrated Amazon SNS topic dispatches real-time email notifications on alarm state breaches.',
        'IAM Roles attached to EC2 instances allow secure metric publishing without stored credentials.',
      ],
      security: 'IAM Least Privilege: instance profile scoped to CloudWatch Agent logs and S3 read-only access.',
      metrics: 'Real-time alert threshold: CPU > 70% for 2 consecutive 1-minute evaluation periods.',
    },
  ];

  const faqs = [
    {
      q: 'Why architect a 3-Tier architecture instead of a monolith on a single EC2?',
      a: 'Separation of concerns ensures fault tolerance, scalability, and security isolation. The database is shielded inside an isolated private subnet with zero internet exposure. If traffic surges, only the stateless Node.js application instances in the Auto Scaling Group scale out horizontally, optimizing cloud cost and computing resources without restarting the database.',
    },
    {
      q: 'How did you handle security group chaining between tiers?',
      a: 'Rather than using CIDR IP ranges between tiers, AWS Security Groups are chained directly: the Application Tier Security Group explicitly allows ingress only from the ALB Security Group on Port 3000. Similarly, the RDS Database Security Group allows Port 3306 ingress only from the App Security Group. This prevents unauthorized direct access even within the VPC.',
    },
    {
      q: 'How does automated instance bootstrapping work during scale-out?',
      a: 'EC2 Launch Templates are configured with User Data shell scripts that execute automatically on instance launch. The script updates package repositories, installs Node.js runtime, clones application code, configures environment variables, and launches the Express server with process supervision before reporting healthy to the ALB Target Group.',
    },
  ];

  const currentTier = tiers[activeTier];

  return (
    <div className="flagship-container">
      {/* Flagship Header */}
      <div className="flagship-top-header">
        <div className="flagship-badge mono">
          <Layers size={14} className="text-cyan" />
          <span>FLAGSHIP ARCHITECTURE 01</span>
        </div>
        <h3 className="flagship-main-title">{FLAGSHIP_THREE_TIER.title}</h3>
        <p className="flagship-lead">{FLAGSHIP_THREE_TIER.description}</p>

        {/* Tech Stack Pills */}
        <div className="flagship-tags">
          {FLAGSHIP_THREE_TIER.tags.map((tag) => (
            <span key={tag} className="badge badge-cyan">{tag}</span>
          ))}
        </div>
      </div>

      {/* Layer Selector Navigation */}
      <div className="tier-tabs-bar" role="tablist" aria-label="Architecture Tiers">
        {tiers.map((tier, idx) => {
          const Icon = tier.icon;
          const isSelected = activeTier === idx;
          return (
            <button
              key={tier.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTier(idx)}
              className={`tier-tab mono ${isSelected ? 'active ' + tier.color : ''}`}
            >
              <Icon size={16} />
              <span>{tier.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Layer Deep Dive Card */}
      <div className="tier-display-card infra-card">
        <div className="tier-display-grid">
          {/* Left: Layer Specs */}
          <div className="tier-content-col">
            <div className="tier-header-row">
              <span className={`badge badge-${currentTier.color} mono`}>{currentTier.tech}</span>
              <span className="tier-status-text mono text-green">● CONFIGURED &amp; VERIFIED</span>
            </div>
            <h4 className="tier-col-title">{currentTier.name}</h4>
            <p className="tier-col-desc">{currentTier.description}</p>

            <div className="tier-bullets">
              <div className="bullet-title mono">ARCHITECTURAL IMPLEMENTATION:</div>
              {currentTier.points.map((pt, i) => (
                <div key={i} className="tier-bullet-item">
                  <CheckCircle2 size={16} className={`bullet-icon text-${currentTier.color}`} />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Security & Operational Box */}
          <div className="tier-sidebar-col">
            <div className="tier-meta-card">
              <div className="meta-card-title mono">
                <Shield size={14} className="text-cyan" />
                <span>SECURITY &amp; NETWORK BOUNDARY</span>
              </div>
              <p className="meta-card-body">{currentTier.security}</p>
            </div>

            <div className="tier-meta-card">
              <div className="meta-card-title mono">
                <Activity size={14} className="text-amber" />
                <span>OPERATIONAL METRICS &amp; TELEMETRY</span>
              </div>
              <p className="meta-card-body">{currentTier.metrics}</p>
            </div>

            <div className="tier-diagram-preview mono">
              <div className="diag-line">VPC: 10.0.0.0/16</div>
              <div className="diag-line">&gt; {currentTier.name}</div>
              <div className="diag-line">&gt; Security Group: Active</div>
              <div className="diag-status text-green">STATUS: HEALTHY (200 OK)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Interviewer Q&A Accordion */}
      <div className="interviewer-qa-section">
        <div className="qa-section-header mono">
          <Workflow size={15} className="text-cyan" />
          <span>ENGINEERING INTERVIEWER DEEP DIVE</span>
        </div>
        <div className="qa-list">
          {faqs.map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div key={i} className={`qa-item ${isOpen ? 'open' : ''}`}>
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  className="qa-question mono"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronRight size={16} className={`chevron ${isOpen ? 'rotated' : ''}`} />
                </button>
                {isOpen && (
                  <div className="qa-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
