import React from 'react';
import { ExternalLink, Calendar, Star, Users, DollarSign } from 'lucide-react';

const NewToolsSection = ({ tools, searchTerm, selectedCategory, selectedAudience }) => {
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesAudience = selectedAudience === 'all' || tool.audience.includes(selectedAudience);
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const ToolCard = ({ tool }) => (
    <div className="tool-card">
      <div className="tool-header">
        <div className="tool-title">
          <h3>{tool.name}</h3>
          <span className="company">{tool.company}</span>
        </div>
        <div className="tool-meta">
          <div className="rating">
            <Star className="star-icon" />
            <span>{tool.rating}</span>
          </div>
          <span className="category-badge">{tool.category}</span>
        </div>
      </div>
      
      <p className="tool-description">{tool.description}</p>
      
      <div className="tool-features">
        <h4>Key Features:</h4>
        <ul>
          {tool.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="tool-details">
        <div className="detail-item">
          <Calendar className="detail-icon" />
          <span>Released: {new Date(tool.releaseDate).toLocaleDateString()}</span>
        </div>
        
        <div className="detail-item">
          <Users className="detail-icon" />
          <span>Audience: {tool.audience.join(', ')}</span>
        </div>
        
        <div className="detail-item">
          <DollarSign className="detail-icon" />
          <span>Pricing: {tool.pricing}</span>
        </div>
      </div>
      
      <div className="tool-actions">
        <a 
          href={tool.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="tool-link"
        >
          <ExternalLink className="link-icon" />
          Visit Tool
        </a>
      </div>
    </div>
  );

  return (
    <div className="tools-section">
      <div className="section-header">
        <h2>New AI Tools</h2>
        <p>Latest AI tools and platforms released this week</p>
      </div>
      
      <div className="tools-stats">
        <div className="stat">
          <span className="stat-value">{filteredTools.length}</span>
          <span className="stat-label">Tools Found</span>
        </div>
        <div className="stat">
          <span className="stat-value">{tools.length}</span>
          <span className="stat-label">Total New Tools</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {(filteredTools.reduce((sum, tool) => sum + tool.rating, 0) / filteredTools.length).toFixed(1)}
          </span>
          <span className="stat-label">Average Rating</span>
        </div>
      </div>
      
      {filteredTools.length === 0 ? (
        <div className="no-results">
          <p>No tools found matching your criteria.</p>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="tools-grid">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewToolsSection;