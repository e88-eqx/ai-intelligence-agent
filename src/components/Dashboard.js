import React from 'react';
import { TrendingUp, AlertTriangle, Zap, Brain, Users, Activity } from 'lucide-react';
import LastUpdated from './LastUpdated';

const Dashboard = ({ data }) => {
  const { metadata, summary, newTools, majorUpdates, breakthroughs, concerns, marketTrends } = data;

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="metric-card">
      <div className="metric-header">
        <Icon className={`metric-icon ${color}`} />
        <h3>{title}</h3>
      </div>
      <div className="metric-value">{value}</div>
      {trend && (
        <div className="metric-trend">
          <TrendingUp className="trend-icon" />
          <span>{trend}% this week</span>
        </div>
      )}
    </div>
  );

  const QuickItem = ({ item, type }) => (
    <div className="quick-item">
      <div className="quick-item-header">
        <h4>{item.name || item.title || item.tool}</h4>
        <span className="quick-item-date">
          {item.releaseDate || item.date}
        </span>
      </div>
      <p className="quick-item-description">
        {item.description || item.update}
      </p>
      {type === 'tool' && (
        <div className="quick-item-meta">
          <span className="audience-tag">{item.audience?.[0]}</span>
          <span className="rating">★ {item.rating}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>AI Intelligence Dashboard</h2>
        <p>Weekly overview of AI developments and trends</p>
      </div>

      <LastUpdated metadata={metadata} />

      <div className="metrics-grid">
        <MetricCard
          title="Total Tools"
          value={summary.totalTools}
          icon={Zap}
          color="blue"
        />
        <MetricCard
          title="New Tools"
          value={summary.newTools}
          icon={Activity}
          color="green"
          trend={summary.weeklyGrowth}
        />
        <MetricCard
          title="Major Updates"
          value={summary.majorUpdates}
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Breakthroughs"
          value={summary.breakthroughs}
          icon={Brain}
          color="orange"
        />
        <MetricCard
          title="Concerns"
          value={summary.concerns}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Market Trends"
          value={marketTrends.length}
          icon={Users}
          color="teal"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Latest New Tools</h3>
            <a href="#tools" className="view-all">View All</a>
          </div>
          <div className="quick-items">
            {newTools.slice(0, 3).map(tool => (
              <QuickItem key={tool.id} item={tool} type="tool" />
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Major Updates</h3>
            <a href="#updates" className="view-all">View All</a>
          </div>
          <div className="quick-items">
            {majorUpdates.slice(0, 3).map(update => (
              <QuickItem key={update.id} item={update} type="update" />
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Key Breakthroughs</h3>
            <a href="#breakthroughs" className="view-all">View All</a>
          </div>
          <div className="quick-items">
            {breakthroughs.slice(0, 2).map(breakthrough => (
              <QuickItem key={breakthrough.id} item={breakthrough} type="breakthrough" />
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Current Concerns</h3>
            <a href="#concerns" className="view-all">View All</a>
          </div>
          <div className="quick-items">
            {concerns.slice(0, 2).map(concern => (
              <div key={concern.id} className="concern-item">
                <div className="concern-header">
                  <h4>{concern.title}</h4>
                  <span className={`severity-badge ${concern.severity.toLowerCase()}`}>
                    {concern.severity}
                  </span>
                </div>
                <p>{concern.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="market-trends-summary">
        <h3>Market Trends Summary</h3>
        <div className="trends-grid">
          {marketTrends.map(trend => (
            <div key={trend.id} className="trend-summary">
              <div className="trend-header">
                <span className="trend-title">{trend.trend}</span>
                <span className="trend-growth">{trend.growth}</span>
              </div>
              <p className="trend-description">{trend.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;