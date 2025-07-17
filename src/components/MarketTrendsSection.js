import React from 'react';
import { TrendingUp, Calendar, BarChart3, Activity } from 'lucide-react';

const MarketTrendsSection = ({ trends, searchTerm }) => {
  const filteredTrends = trends.filter(trend =>
    trend.trend.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trend.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trend.timeframe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGrowthColor = (growth) => {
    const value = parseInt(growth.replace('%', '').replace('+', ''));
    if (value >= 60) return 'growth-high';
    if (value >= 30) return 'growth-medium';
    return 'growth-low';
  };

  const TrendCard = ({ trend }) => (
    <div className="trend-card">
      <div className="trend-header">
        <div className="trend-title">
          <TrendingUp className="trend-icon" />
          <h3>{trend.trend}</h3>
        </div>
        <div className="trend-meta">
          <span className={`growth-badge ${getGrowthColor(trend.growth)}`}>
            {trend.growth}
          </span>
        </div>
      </div>
      
      <p className="trend-description">{trend.description}</p>
      
      <div className="trend-details">
        <div className="detail-item">
          <Calendar className="detail-icon" />
          <span>Timeframe: {trend.timeframe}</span>
        </div>
        
        <div className="detail-item">
          <BarChart3 className="detail-icon" />
          <span>Growth: {trend.growth}</span>
        </div>
        
        <div className="detail-item">
          <Activity className="detail-icon" />
          <span>Status: Active</span>
        </div>
      </div>
      
      <div className="trend-impact">
        <div className="impact-indicator">
          <div className="impact-bar">
            <div 
              className="impact-fill" 
              style={{ width: trend.growth }}
            ></div>
          </div>
          <span className="impact-label">Growth Rate</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="trends-section">
      <div className="section-header">
        <h2>Market Trends</h2>
        <p>Current trends and growth patterns in the AI market</p>
      </div>
      
      <div className="trends-stats">
        <div className="stat">
          <span className="stat-value">{filteredTrends.length}</span>
          <span className="stat-label">Trends Found</span>
        </div>
        <div className="stat">
          <span className="stat-value">{trends.length}</span>
          <span className="stat-label">Total Trends</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {(trends.reduce((sum, t) => sum + parseInt(t.growth.replace('%', '').replace('+', '')), 0) / trends.length).toFixed(0)}%
          </span>
          <span className="stat-label">Average Growth</span>
        </div>
        <div className="stat">
          <span className="stat-value">Q2 2024</span>
          <span className="stat-label">Current Period</span>
        </div>
      </div>
      
      {filteredTrends.length === 0 ? (
        <div className="no-results">
          <p>No trends found matching your search.</p>
          <p>Try different keywords or check back later.</p>
        </div>
      ) : (
        <div className="trends-grid">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketTrendsSection;