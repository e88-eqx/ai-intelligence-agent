import React from 'react';
import { Clock, RefreshCw, Database, Calendar } from 'lucide-react';

const LastUpdated = ({ metadata, onManualUpdate, isUpdating }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (lastUpdated) => {
    const hoursAgo = (new Date() - new Date(lastUpdated)) / (1000 * 60 * 60);
    if (hoursAgo < 24) return 'status-fresh';
    if (hoursAgo < 168) return 'status-current'; // 7 days
    return 'status-stale';
  };

  return (
    <div className="last-updated-container">
      <div className="last-updated-card">
        <div className="last-updated-header">
          <div className="status-indicator">
            <div className={`status-dot ${getStatusColor(metadata.lastUpdated)}`}></div>
            <span className="status-label">Data Status</span>
          </div>
          <span className="version-badge">v{metadata.version}</span>
        </div>
        
        <div className="last-updated-content">
          <div className="update-info">
            <div className="info-item">
              <Clock className="info-icon" />
              <div className="info-text">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatDate(metadata.lastUpdated)}</span>
                <span className="info-subtitle">{getTimeAgo(metadata.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="info-item">
              <Database className="info-icon" />
              <div className="info-text">
                <span className="info-label">Data Source</span>
                <span className="info-value">{metadata.dataSource}</span>
              </div>
            </div>
            
            <div className="info-item">
              <Calendar className="info-icon" />
              <div className="info-text">
                <span className="info-label">Update Method</span>
                <span className="info-value">{metadata.updateMethod || 'Manual updates'}</span>
              </div>
            </div>
          </div>
          
          <div className="update-actions">
            <button 
              className="refresh-button" 
              onClick={onManualUpdate}
              disabled={isUpdating}
            >
              <RefreshCw className={`button-icon ${isUpdating ? 'spinning' : ''}`} />
              <span>{isUpdating ? 'Updating...' : 'Update Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastUpdated;