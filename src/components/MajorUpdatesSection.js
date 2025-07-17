import React from 'react';
import { Calendar, TrendingUp, Building, Tag } from 'lucide-react';

const MajorUpdatesSection = ({ updates, searchTerm }) => {
  const filteredUpdates = updates.filter(update =>
    update.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.update.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'impact-high';
      case 'medium': return 'impact-medium';
      case 'low': return 'impact-low';
      default: return 'impact-medium';
    }
  };

  const UpdateCard = ({ update }) => (
    <div className="update-card">
      <div className="update-header">
        <div className="update-title">
          <h3>{update.tool}</h3>
          <span className="company">{update.company}</span>
        </div>
        <div className="update-meta">
          <span className={`impact-badge ${getImpactColor(update.impact)}`}>
            {update.impact} Impact
          </span>
          <span className="category-badge">{update.category}</span>
        </div>
      </div>
      
      <div className="update-summary">
        <h4>{update.update}</h4>
        <p>{update.description}</p>
      </div>
      
      <div className="update-details">
        <div className="detail-item">
          <Calendar className="detail-icon" />
          <span>Released: {new Date(update.date).toLocaleDateString()}</span>
        </div>
        
        <div className="detail-item">
          <Building className="detail-icon" />
          <span>Company: {update.company}</span>
        </div>
        
        <div className="detail-item">
          <Tag className="detail-icon" />
          <span>Category: {update.category}</span>
        </div>
        
        <div className="detail-item">
          <TrendingUp className="detail-icon" />
          <span>Impact Level: {update.impact}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="updates-section">
      <div className="section-header">
        <h2>Major Updates</h2>
        <p>Significant updates to existing AI tools and platforms</p>
      </div>
      
      <div className="updates-stats">
        <div className="stat">
          <span className="stat-value">{filteredUpdates.length}</span>
          <span className="stat-label">Updates Found</span>
        </div>
        <div className="stat">
          <span className="stat-value">{updates.length}</span>
          <span className="stat-label">Total Updates</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {updates.filter(u => u.impact === 'High').length}
          </span>
          <span className="stat-label">High Impact</span>
        </div>
      </div>
      
      {filteredUpdates.length === 0 ? (
        <div className="no-results">
          <p>No updates found matching your search.</p>
          <p>Try different keywords or check back later.</p>
        </div>
      ) : (
        <div className="updates-grid">
          {filteredUpdates.map(update => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MajorUpdatesSection;