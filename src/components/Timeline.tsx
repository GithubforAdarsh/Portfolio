import React, { useState } from 'react';
import { 
  Activity, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';
import { 
  EXPERIENCE_TIMELINE, 
  EDUCATION_TIMELINE, 
  CERTIFICATIONS 
} from '../data/portfolioData';
import './Timeline.css';

export const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'certifications'>('experience');

  return (
    <section id="timeline" className="timeline-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <span className="dot"></span>
            <span>DEPLOYMENT LOG // CAREER &amp; CREDENTIAL RECORD</span>
          </div>
          <h2 className="section-title">Engineering Deployments &amp; Background</h2>
          <p className="section-description">
            A chronological deployment log of practical cloud internships, specialized academic foundations, 
            and official AWS credentials.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="timeline-tabs mono" role="tablist">
          <button
            onClick={() => setActiveTab('experience')}
            role="tab"
            aria-selected={activeTab === 'experience'}
            className={`t-tab ${activeTab === 'experience' ? 'active' : ''}`}
          >
            <Briefcase size={16} />
            <span>01. INDUSTRY INTERNSHIPS</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            role="tab"
            aria-selected={activeTab === 'education'}
            className={`t-tab ${activeTab === 'education' ? 'active' : ''}`}
          >
            <GraduationCap size={16} />
            <span>02. ACADEMIC FOUNDATION</span>
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            role="tab"
            aria-selected={activeTab === 'certifications'}
            className={`t-tab ${activeTab === 'certifications' ? 'active' : ''}`}
          >
            <Award size={16} />
            <span>03. AWS CREDENTIALS ({CERTIFICATIONS.length})</span>
          </button>
        </div>

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="timeline-container">
            <div className="timeline-track">
              {EXPERIENCE_TIMELINE.map((exp, idx) => (
                <div key={idx} className="timeline-entry">
                  <div className="entry-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-line"></div>
                  </div>

                  <div className="entry-content infra-card">
                    <div className="entry-header">
                      <div>
                        <span className="badge badge-cyan mono">CLOUD INTERNSHIP</span>
                        <h3 className="entry-role">{exp.role}</h3>
                        <div className="entry-company">{exp.company}</div>
                      </div>

                      <div className="entry-meta mono">
                        <div className="meta-item">
                          <Calendar size={13} className="text-cyan" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="meta-item">
                          <MapPin size={13} className="text-muted" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="entry-bullets">
                      <div className="bullets-heading mono">TECHNICAL RESPONSIBILITIES &amp; DELIVERABLES:</div>
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="bullet-row">
                          <CheckCircle2 size={15} className="bullet-check text-green" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="timeline-container">
            <div className="timeline-track">
              {EDUCATION_TIMELINE.map((edu, idx) => (
                <div key={idx} className="timeline-entry">
                  <div className="entry-marker">
                    <div className="marker-dot green"></div>
                    <div className="marker-line"></div>
                  </div>

                  <div className="entry-content infra-card">
                    <div className="entry-header">
                      <div>
                        <span className="badge badge-green mono">ACADEMIC DEGREE</span>
                        <h3 className="entry-role">{edu.role}</h3>
                        <div className="entry-company">{edu.company}</div>
                      </div>

                      <div className="entry-meta mono">
                        <div className="meta-item">
                          <Calendar size={13} className="text-green" />
                          <span>{edu.period}</span>
                        </div>
                        <div className="meta-item">
                          <MapPin size={13} className="text-muted" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="entry-bullets">
                      {edu.highlights.map((h, i) => (
                        <div key={i} className="bullet-row">
                          <CheckCircle2 size={15} className="bullet-check text-green" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="certifications-grid">
            {CERTIFICATIONS.map((cert, idx) => (
              <div key={idx} className="cert-card infra-card">
                <div className="cert-top">
                  <div className="cert-badge-wrap">
                    <Award size={24} className="text-amber" />
                  </div>
                  <span className="badge badge-amber mono">AWS SKILL BUILDER</span>
                </div>

                <h3 className="cert-title">{cert.title}</h3>
                <div className="cert-issuer mono">Issuer: {cert.issuer}</div>
                <div className="cert-type mono">Credential Domain: {cert.type}</div>

                <div className="cert-footer mono">
                  <span className="cert-status text-green">● OFFICIAL AWS CREDENTIAL</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
