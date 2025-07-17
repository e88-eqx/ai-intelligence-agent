import React from 'react';
import { Calendar, Building, Zap, Target } from 'lucide-react';

const BreakthroughsSection = ({ breakthroughs, searchTerm }) => {
  const filteredBreakthroughs = breakthroughs.filter(breakthrough =>
    breakthrough.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breakthrough.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breakthrough.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breakthrough.impact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSignificanceColor = (significance) => {
    switch (significance.toLowerCase()) {
      case 'revolutionary': return 'significance-revolutionary';
      case 'high': return 'significance-high';
      case 'medium': return 'significance-medium';
      case 'low': return 'significance-low';
      default: return 'significance-medium';
    }
  };

  const BreakthroughCard = ({ breakthrough }) => (
    <div className="breakthrough-card">
      <div className="breakthrough-header">
        <div className="breakthrough-title">
          <h3>{breakthrough.title}</h3>
          <span className="organization">{breakthrough.organization}</span>
        </div>
        <span className={`significance-badge ${getSignificanceColor(breakthrough.significance)}`}>
          {breakthrough.significance}
        </span>
      </div>
      
      <p className="breakthrough-description">{breakthrough.description}</p>
      
      <div className="breakthrough-applications">
        <h4>Applications:</h4>
        <div className="applications-list">
          {breakthrough.applications.map((app, index) => (
            <span key={index} className="application-tag">{app}</span>
          ))}
        </div>
      </div>
      
      <div className="breakthrough-impact">
        <h4>Impact:</h4>
        <p>{breakthrough.impact}</p>
      </div>
      
      <div className="breakthrough-details">
        <div className="detail-item">
          <Calendar className="detail-icon" />
          <span>Announced: {new Date(breakthrough.date).toLocaleDateString()}</span>
        </div>
        
        <div className="detail-item">
          <Building className="detail-icon" />
          <span>Organization: {breakthrough.organization}</span>
        </div>
        
        <div className="detail-item">
          <Zap className="detail-icon" />
          <span>Significance: {breakthrough.significance}</span>
        </div>
        
        <div className="detail-item">
          <Target className="detail-icon" />
          <span>Applications: {breakthrough.applications.length}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="breakthroughs-section">
      <div className="section-header">
        <h2>AI Breakthroughs</h2>
        <p>Latest research breakthroughs and technological advances in AI</p>
      </div>
      
      <div className="breakthroughs-stats">
        <div className="stat">
          <span className="stat-value">{filteredBreakthroughs.length}</span>
          <span className="stat-label">Breakthroughs Found</span>
        </div>
        <div className="stat">
          <span className="stat-value">{breakthroughs.length}</span>
          <span className="stat-label">Total Breakthroughs</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {breakthroughs.filter(b => b.significance === 'Revolutionary').length}
          </span>
          <span className="stat-label">Revolutionary</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {breakthroughs.reduce((sum, b) => sum + b.applications.length, 0)}
          </span>
          <span className="stat-label">Total Applications</span>
        </div>
      </div>
      
      {filteredBreakthroughs.length === 0 ? (
        <div className="no-results">
          <p>No breakthroughs found matching your search.</p>
          <p>Try different keywords or check back later.</p>
        </div>
      ) : (
        <div className="breakthroughs-grid">
          {filteredBreakthroughs.map(breakthrough => (
            <BreakthroughCard key={breakthrough.id} breakthrough={breakthrough} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BreakthroughsSection;