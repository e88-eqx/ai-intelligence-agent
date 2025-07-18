import React, { useState } from 'react';
import { Search, Filter, TrendingUp, AlertTriangle, Zap, Brain, Users, BarChart3 } from 'lucide-react';
import { sampleData } from './data/sampleData';
import dataFetcher from './services/dataFetcher';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import NewToolsSection from './components/NewToolsSection';
import MajorUpdatesSection from './components/MajorUpdatesSection';
import BreakthroughsSection from './components/BreakthroughsSection';
import ConcernsSection from './components/ConcernsSection';
import MarketTrendsSection from './components/MarketTrendsSection';
import CMSPanel from './components/CMSPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [data, setData] = useState(sampleData);
  const [isUpdating, setIsUpdating] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tools', label: 'New Tools', icon: Zap },
    { id: 'updates', label: 'Major Updates', icon: TrendingUp },
    { id: 'breakthroughs', label: 'Breakthroughs', icon: Brain },
    { id: 'concerns', label: 'Concerns', icon: AlertTriangle },
    { id: 'trends', label: 'Market Trends', icon: Users }
  ];

  const categories = ['all', 'Developer', 'Designer', 'Product Manager', 'Business'];
  const audiences = ['all', 'Developer', 'Designer', 'Product Manager', 'Business'];

  // Handle manual data refresh
  const handleManualUpdate = async () => {
    setIsUpdating(true);
    try {
      const realTimeData = await dataFetcher.fetchAllData();
      setData(realTimeData);
      console.log('Manual update completed successfully');
    } catch (error) {
      console.error('Error during manual update:', error);
      // Keep existing data if update fails
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle CMS data updates
  const handleDataUpdate = (newData) => {
    setData({
      ...newData,
      metadata: {
        ...newData.metadata,
        lastUpdated: new Date().toISOString(),
        dataSource: 'Manual CMS update + API integration'
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          data={data} 
          onManualUpdate={handleManualUpdate}
          isUpdating={isUpdating}
        />;
      case 'tools':
        return (
          <NewToolsSection 
            tools={data.newTools}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedAudience={selectedAudience}
          />
        );
      case 'updates':
        return (
          <MajorUpdatesSection 
            updates={data.majorUpdates}
            searchTerm={searchTerm}
          />
        );
      case 'breakthroughs':
        return (
          <BreakthroughsSection 
            breakthroughs={data.breakthroughs}
            searchTerm={searchTerm}
          />
        );
      case 'concerns':
        return (
          <ConcernsSection 
            concerns={data.concerns}
            searchTerm={searchTerm}
          />
        );
      case 'trends':
        return (
          <MarketTrendsSection 
            trends={data.marketTrends}
            searchTerm={searchTerm}
          />
        );
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Brain className="logo-icon" />
              <h1>AINow</h1>
            </div>
            <div className="header-subtitle">
              <p>Real-time AI intelligence for teams</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="nav-tab-icon" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {activeTab !== 'dashboard' && (
        <div className="search-filters">
          <div className="container">
            <div className="search-filters-content">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === 'tools' && (
                <div className="filters">
                  <div className="filter-group">
                    <Filter className="filter-icon" />
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <Users className="filter-icon" />
                    <select 
                      value={selectedAudience} 
                      onChange={(e) => setSelectedAudience(e.target.value)}
                    >
                      {audiences.map(aud => (
                        <option key={aud} value={aud}>
                          {aud === 'all' ? 'All Audiences' : aud}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 AINow. Real-time AI intelligence for teams.</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
      
      <CMSPanel data={data} onDataUpdate={handleDataUpdate} />
    </div>
  );
}

export default App;