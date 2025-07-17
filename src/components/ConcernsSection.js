import React from 'react';
import { AlertTriangle, Shield, Activity, Target } from 'lucide-react';

const ConcernsSection = ({ concerns, searchTerm }) => {
  const filteredConcerns = concerns.filter(concern =>
    concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concern.affectedAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())) ||
    concern.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active monitoring': return 'status-active';
      case 'industry response needed': return 'status-urgent';
      case 'ongoing research': return 'status-research';
      default: return 'status-active';
    }
  };

  const ConcernCard = ({ concern }) => (
    <div className="concern-card">
      <div className="concern-header">
        <div className="concern-title">
          <AlertTriangle className="concern-icon" />
          <h3>{concern.title}</h3>
        </div>
        <div className="concern-meta">
          <span className={`severity-badge ${getSeverityColor(concern.severity)}`}>
            {concern.severity} Severity
          </span>
          <span className={`status-badge ${getStatusColor(concern.status)}`}>
            {concern.status}
          </span>
        </div>
      </div>
      
      <p className="concern-description">{concern.description}</p>
      
      <div className="concern-affected">
        <h4>Affected Areas:</h4>
        <div className="affected-areas">
          {concern.affectedAreas.map((area, index) => (
            <span key={index} className="affected-tag">{area}</span>
          ))}
        </div>
      </div>
      
      <div className="concern-mitigation">
        <h4>Mitigation Strategies:</h4>
        <ul>
          {concern.mitigationStrategies.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </div>
      
      <div className="concern-details">
        <div className="detail-item">
          <Shield className="detail-icon" />
          <span>Severity: {concern.severity}</span>
        </div>
        
        <div className="detail-item">
          <Activity className="detail-icon" />
          <span>Status: {concern.status}</span>
        </div>
        
        <div className="detail-item">
          <Target className="detail-icon" />
          <span>Areas: {concern.affectedAreas.length}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="concerns-section">
      <div className="section-header">
        <h2>AI Concerns & Challenges</h2>
        <p>Current challenges and concerns in AI development and deployment</p>
      </div>
      
      <div className="concerns-stats">
        <div className="stat">
          <span className="stat-value">{filteredConcerns.length}</span>
          <span className="stat-label">Concerns Found</span>
        </div>
        <div className="stat">
          <span className="stat-value">{concerns.length}</span>
          <span className="stat-label">Total Concerns</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {concerns.filter(c => c.severity === 'High').length}
          </span>
          <span className="stat-label">High Severity</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {concerns.filter(c => c.status === 'Active monitoring').length}
          </span>
          <span className="stat-label">Active Monitoring</span>
        </div>
      </div>
      
      {filteredConcerns.length === 0 ? (
        <div className="no-results">
          <p>No concerns found matching your search.</p>
          <p>Try different keywords or check back later.</p>
        </div>
      ) : (
        <div className="concerns-grid">
          {filteredConcerns.map(concern => (
            <ConcernCard key={concern.id} concern={concern} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConcernsSection;