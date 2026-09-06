import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  ExternalLink, 
  Terminal, 
  CheckCircle2, 
  ArrowUp, 
  ShieldCheck, 
  Server 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { CANDIDATE_INFO } from '../data/portfolioData';
import './Contact.css';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setTransmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setTransmitted(false), 5000);
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="contact-footer-section">
      <div className="container">
        {/* Philosophy Banner */}
        <div className="philosophy-banner infra-card">
          <div className="philosophy-label mono">
            <span className="dot"></span>
            <span>ENGINEERING PHILOSOPHY</span>
          </div>
          <h2 className="philosophy-title mono">
            BUILD. DEPLOY. SCALE. OBSERVE. IMPROVE.
          </h2>
          <p className="philosophy-body">
            Reliable cloud systems aren&apos;t built by accident. They are engineered through careful network isolation, 
            resilient multi-AZ redundancy, automated horizontal scaling, and proactive observability that catches anomalies 
            before users do.
          </p>
        </div>

        {/* Transmission & Contact Grid */}
        <div className="contact-grid">
          {/* Left: Transmission Terminal / Form */}
          <div className="transmission-terminal infra-card">
            <div className="terminal-top mono">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="text-cyan">INCOMING_TRANSMISSION_STREAM.sh</span>
            </div>

            <h3 className="terminal-heading">Initiate System Transmission</h3>
            <p className="terminal-sub">
              Open a direct communication channel with Adarsh regarding cloud engineering roles, 
              distributed architectures, or infrastructure collaboration.
            </p>

            {transmitted ? (
              <div className="transmitted-success mono">
                <CheckCircle2 size={24} className="text-green" />
                <div className="success-title">TRANSMISSION DISPATCHED // 200 OK</div>
                <p className="success-text">
                  Your message has been formatted and queued into the notification channel. 
                  Adarsh will respond shortly via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="transmission-form">
                <div className="form-group">
                  <label className="mono form-label">01 // SENDER IDENTIFIER / NAME:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins (Engineering Recruiter)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="infra-input mono"
                  />
                </div>

                <div className="form-group">
                  <label className="mono form-label">02 // RETURN EMAIL ADDRESS:</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. s.jenkins@enterprise-cloud.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="infra-input mono"
                  />
                </div>

                <div className="form-group">
                  <label className="mono form-label">03 // SUBJECT / SYSTEM PURPOSE:</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud Engineer Opportunity // AWS Infrastructure"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="infra-input mono"
                  />
                </div>

                <div className="form-group">
                  <label className="mono form-label">04 // TRANSMISSION PAYLOAD (MESSAGE):</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline your team, technology stack, and engineering requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="infra-textarea mono"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={transmitting}
                  className="btn btn-primary mono w-full"
                >
                  <Send size={15} />
                  <span>{transmitting ? 'DISPATCHING PACKET TO ENDPOINT...' : 'DISPATCH TRANSMISSION'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Connection Channels & Telemetry Details */}
          <div className="direct-channels-col">
            <div className="infra-card direct-box">
              <div className="direct-header mono">
                <Server size={16} className="text-cyan" />
                <span>DIRECT ENDPOINTS</span>
              </div>
              <h4 className="direct-title">Verified Communication Channels</h4>

              <div className="channels-list mono">
                <a href={`mailto:${CANDIDATE_INFO.email}`} className="channel-link">
                  <div className="channel-left">
                    <Mail size={16} className="text-cyan" />
                    <div>
                      <div className="channel-label">ELECTRONIC MAIL</div>
                      <div className="channel-value">{CANDIDATE_INFO.email}</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="channel-arrow" />
                </a>

                <a href={`tel:${CANDIDATE_INFO.phone}`} className="channel-link">
                  <div className="channel-left">
                    <Phone size={16} className="text-green" />
                    <div>
                      <div className="channel-label">TELEPHONE CALL / WHATSAPP</div>
                      <div className="channel-value">+91 {CANDIDATE_INFO.phone}</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="channel-arrow" />
                </a>

                <a
                  href={CANDIDATE_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-link"
                >
                  <div className="channel-left">
                    <LinkedinIcon size={16} className="text-cyan" />
                    <div>
                      <div className="channel-label">LINKEDIN NETWORK</div>
                      <div className="channel-value">linkedin.com/in/adarsh-sadanandan</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="channel-arrow" />
                </a>

                <a
                  href={CANDIDATE_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-link"
                >
                  <div className="channel-left">
                    <GithubIcon size={16} className="text-violet" />
                    <div>
                      <div className="channel-label">GITHUB REPOSITORIES</div>
                      <div className="channel-value">github.com/GithubforAdarsh</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="channel-arrow" />
                </a>
              </div>
            </div>

            {/* System Status Summary Card */}
            <div className="infra-card status-summary-card mono">
              <div className="status-top">
                <span className="dot green"></span>
                <span>CANDIDATE AVAILABILITY STATUS</span>
              </div>
              <div className="status-text">
                OPEN TO CLOUD &amp; BACKEND ENGINEERING OPPORTUNITIES (FULL-TIME &amp; INTERNSHIPS)
              </div>
              <div className="status-location text-muted">
                Location: Ahmedabad / Kherva, Gujarat, India (Open to Relocation / Remote)
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Sub-Bar */}
        <div className="global-footer-bar mono">
          <div className="footer-left">
            <span>SYS.ID: THEKKINKATIL ADARSH // AWS INFRASTRUCTURE ARCHITECT</span>
            <span className="footer-pledge">ZERO-FABRICATION GUARANTEE: STRICT RESUME COMPLIANCE</span>
          </div>

          <button onClick={scrollToTop} className="btn-back-to-top" aria-label="Back to top">
            <span>RETURN TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
