import React from 'react';
import { 
  HardDrive, 
  Activity, 
  Image as ImageIcon, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  ShieldCheck 
} from 'lucide-react';
import { CLOUD_INFRA_PROJECTS } from '../data/portfolioData';
import './OtherProjects.css';

export const OtherProjects: React.FC = () => {
  const otherProjects = CLOUD_INFRA_PROJECTS.filter(
    (p) => p.id === 's3-static-hosting' || p.id === 'fitness-tracker' || p.id === 'image-colorization-deoldify'
  );

  const getProjectIcon = (id: string) => {
    switch (id) {
      case 's3-static-hosting':
        return HardDrive;
      case 'fitness-tracker':
        return Activity;
      case 'image-colorization-deoldify':
        return ImageIcon;
      default:
        return Layers;
    }
  };

  return (
    <div className="other-projects-wrapper">
      <div className="section-label mono">
        <span className="dot"></span>
        <span>PRODUCTION DEPLOYMENTS // SPECIALIZED CASE STUDIES</span>
      </div>
      <h3 className="sub-section-title">Additional Engineering Implementations</h3>
      <p className="sub-section-desc">
        Rigorous engineering projects covering cloud object storage, full-stack microservices, 
        and computer vision neural pipelines.
      </p>

      <div className="other-projects-grid">
        {otherProjects.map((proj) => {
          const Icon = getProjectIcon(proj.id);
          return (
            <div key={proj.id} className="other-card infra-card">
              <div className="other-card-top">
                <div className="other-icon-wrap">
                  <Icon size={20} className="text-cyan" />
                </div>
                <div className="other-meta-top mono">
                  <span className="badge badge-cyan">{proj.category}</span>
                  <span className="proj-period">{proj.period}</span>
                </div>
              </div>

              <h4 className="other-title">{proj.title}</h4>
              <p className="other-desc">{proj.description}</p>

              <div className="other-bullets">
                {proj.bulletPoints.map((bp, i) => (
                  <div key={i} className="other-bullet-item">
                    <CheckCircle2 size={14} className="text-green bp-icon" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>

              <div className="other-tags mono">
                {proj.tags.map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
