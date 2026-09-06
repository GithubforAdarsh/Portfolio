import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Server, 
  Activity, 
  Terminal, 
  Zap 
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import './SkillsConstellation.css';

export const SkillsConstellation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'ALL',
    'Cloud Computing (AWS)',
    'Backend Technologies',
    'Databases & Storage',
    'DevOps & Containers',
    'Networking & Security',
    'AI / Machine Learning',
    'Programming Languages',
  ];

  // Flatten all skills with category context
  const allSkills = SKILL_CATEGORIES.flatMap((cat) =>
    cat.skills.map((s) => ({
      ...s,
      category: cat.category,
    }))
  );

  const filteredSkills = allSkills.filter((skill) => {
    const matchesCategory = activeCategory === 'ALL' || skill.category === activeCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (category: string) => {
    if (category.includes('Cloud')) return 'badge-cyan';
    if (category.includes('Backend')) return 'badge-green';
    if (category.includes('Databases')) return 'badge-violet';
    if (category.includes('DevOps')) return 'badge-amber';
    return 'badge-cyan';
  };

  return (
    <section id="systems-map" className="skills-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <span className="dot"></span>
            <span>SYSTEM COMPETENCIES // LIVING INFRASTRUCTURE GRAPH</span>
          </div>
          <h2 className="section-title">Technical Systems Matrix</h2>
          <p className="section-description">
            A functional systems map connecting cloud platforms, backend runtimes, networking perimeters, 
            and data stores based strictly on Adarsh&apos;s verified engineering toolkit.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="skills-filter-toolbar">
          {/* Categories */}
          <div className="category-scroll-strip" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-pill mono ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat === 'ALL' ? '00. ALL CAPABILITIES' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="search-box">
            <Search size={14} className="search-icon text-cyan" />
            <input
              type="text"
              placeholder="Search skill (e.g. EC2, VPC, Docker, FastAPI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input mono"
              aria-label="Filter skills"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="clear-search-btn mono"
                aria-label="Clear search"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Skills Constellation Grid */}
        <div className="skills-matrix-grid">
          {filteredSkills.map((skill, i) => (
            <div key={`${skill.name}-${i}`} className="skill-node infra-card">
              <div className="skill-node-header">
                <div className="skill-name-wrap">
                  <span className="node-indicator"></span>
                  <h4 className="skill-name">{skill.name}</h4>
                </div>
                <span className={`badge ${getCategoryBadgeClass(skill.category)} mono`}>
                  {skill.level}
                </span>
              </div>

              <div className="skill-category-tag mono">{skill.category}</div>
              <p className="skill-role-text">{skill.role}</p>

              <div className="skill-footer mono">
                <span className="telemetry-tag">SYS.STATUS: VERIFIED</span>
              </div>
            </div>
          ))}

          {filteredSkills.length === 0 && (
            <div className="no-skills-found mono infra-card">
              <Terminal size={24} className="text-amber" />
              <p>NO DIRECT SYSTEM MATCH FOR &ldquo;{searchQuery}&rdquo;</p>
              <button onClick={() => setSearchQuery('')} className="btn btn-outline-cyan btn-sm">
                RESET FILTER
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
