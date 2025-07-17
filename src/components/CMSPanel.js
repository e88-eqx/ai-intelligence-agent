import React, { useState } from 'react';
import { Plus, Edit3, Save, X, Upload, Download, Database, Settings } from 'lucide-react';

const CMSPanel = ({ data, onDataUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tools');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);

  const tabs = [
    { id: 'tools', label: 'AI Tools', icon: Database },
    { id: 'updates', label: 'Updates', icon: Edit3 },
    { id: 'breakthroughs', label: 'Breakthroughs', icon: Upload },
    { id: 'concerns', label: 'Concerns', icon: Settings }
  ];

  const getEmptyTool = () => ({
    id: Date.now(),
    name: '',
    category: 'Developer',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    company: '',
    features: [],
    audience: ['Developer'],
    rating: 4.0,
    pricing: 'Free',
    link: ''
  });

  const getEmptyUpdate = () => ({
    id: Date.now(),
    tool: '',
    company: '',
    update: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    impact: 'Medium',
    category: 'Platform'
  });

  const getEmptyBreakthrough = () => ({
    id: Date.now(),
    title: '',
    organization: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    significance: 'High',
    applications: [],
    impact: ''
  });

  const getEmptyConcern = () => ({
    id: Date.now(),
    title: '',
    severity: 'Medium',
    description: '',
    affectedAreas: [],
    mitigationStrategies: [],
    status: 'Active monitoring'
  });

  const handleSave = () => {
    if (editingItem) {
      const updatedData = { ...data };
      const section = getSectionKey(activeTab);
      const index = updatedData[section].findIndex(item => item.id === editingItem.id);
      if (index !== -1) {
        updatedData[section][index] = editingItem;
      }
      onDataUpdate(updatedData);
      setEditingItem(null);
    }

    if (newItem) {
      const updatedData = { ...data };
      const section = getSectionKey(activeTab);
      updatedData[section] = [newItem, ...updatedData[section]];
      onDataUpdate(updatedData);
      setNewItem(null);
    }
  };

  const handleDelete = (id) => {
    const updatedData = { ...data };
    const section = getSectionKey(activeTab);
    updatedData[section] = updatedData[section].filter(item => item.id !== id);
    onDataUpdate(updatedData);
  };

  const getSectionKey = (tab) => {
    switch (tab) {
      case 'tools': return 'newTools';
      case 'updates': return 'majorUpdates';
      case 'breakthroughs': return 'breakthroughs';
      case 'concerns': return 'concerns';
      default: return 'newTools';
    }
  };

  const getCurrentItems = () => {
    const section = getSectionKey(activeTab);
    return data[section] || [];
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ai-intelligence-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          onDataUpdate(importedData);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderToolForm = (item, setter) => (
    <div className="cms-form">
      <div className="form-row">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => setter({...item, name: e.target.value})}
            placeholder="AI Tool Name"
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            value={item.company}
            onChange={(e) => setter({...item, company: e.target.value})}
            placeholder="Company Name"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={item.description}
          onChange={(e) => setter({...item, description: e.target.value})}
          placeholder="Tool description..."
          rows="3"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            value={item.category}
            onChange={(e) => setter({...item, category: e.target.value})}
          >
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div className="form-group">
          <label>Rating</label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={item.rating}
            onChange={(e) => setter({...item, rating: parseFloat(e.target.value)})}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Pricing</label>
          <input
            type="text"
            value={item.pricing}
            onChange={(e) => setter({...item, pricing: e.target.value})}
            placeholder="Free, Pro, Enterprise, etc."
          />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input
            type="url"
            value={item.link}
            onChange={(e) => setter({...item, link: e.target.value})}
            placeholder="https://..."
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Features (comma-separated)</label>
        <input
          type="text"
          value={item.features?.join(', ') || ''}
          onChange={(e) => setter({...item, features: e.target.value.split(', ').filter(f => f.trim())})}
          placeholder="Feature 1, Feature 2, Feature 3"
        />
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="cms-toggle">
        <button 
          className="cms-toggle-button"
          onClick={() => setIsOpen(true)}
          title="Open Content Management"
        >
          <Edit3 className="cms-icon" />
          <span>Manage Content</span>
        </button>
      </div>
    );
  }

  return (
    <div className="cms-panel">
      <div className="cms-header">
        <h3>Content Management System</h3>
        <div className="cms-actions">
          <button className="cms-action-btn" onClick={exportData}>
            <Download className="btn-icon" />
            Export
          </button>
          <label className="cms-action-btn">
            <Upload className="btn-icon" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
          <button className="cms-close-btn" onClick={() => setIsOpen(false)}>
            <X className="btn-icon" />
          </button>
        </div>
      </div>
      
      <div className="cms-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`cms-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="tab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      <div className="cms-content">
        <div className="cms-toolbar">
          <button
            className="cms-add-btn"
            onClick={() => {
              const empty = activeTab === 'tools' ? getEmptyTool() :
                           activeTab === 'updates' ? getEmptyUpdate() :
                           activeTab === 'breakthroughs' ? getEmptyBreakthrough() :
                           getEmptyConcern();
              setNewItem(empty);
            }}
          >
            <Plus className="btn-icon" />
            Add New {tabs.find(t => t.id === activeTab)?.label}
          </button>
        </div>
        
        {newItem && (
          <div className="cms-edit-panel">
            <div className="cms-edit-header">
              <h4>Add New {tabs.find(t => t.id === activeTab)?.label}</h4>
              <div className="cms-edit-actions">
                <button className="cms-save-btn" onClick={handleSave}>
                  <Save className="btn-icon" />
                  Save
                </button>
                <button className="cms-cancel-btn" onClick={() => setNewItem(null)}>
                  <X className="btn-icon" />
                  Cancel
                </button>
              </div>
            </div>
            {activeTab === 'tools' && renderToolForm(newItem, setNewItem)}
          </div>
        )}
        
        <div className="cms-items">
          {getCurrentItems().map(item => (
            <div key={item.id} className="cms-item">
              {editingItem?.id === item.id ? (
                <div className="cms-edit-panel">
                  <div className="cms-edit-header">
                    <h4>Edit {item.name || item.title}</h4>
                    <div className="cms-edit-actions">
                      <button className="cms-save-btn" onClick={handleSave}>
                        <Save className="btn-icon" />
                        Save
                      </button>
                      <button className="cms-cancel-btn" onClick={() => setEditingItem(null)}>
                        <X className="btn-icon" />
                        Cancel
                      </button>
                    </div>
                  </div>
                  {activeTab === 'tools' && renderToolForm(editingItem, setEditingItem)}
                </div>
              ) : (
                <div className="cms-item-content">
                  <div className="cms-item-header">
                    <h4>{item.name || item.title}</h4>
                    <div className="cms-item-actions">
                      <button
                        className="cms-edit-btn"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit3 className="btn-icon" />
                      </button>
                      <button
                        className="cms-delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <X className="btn-icon" />
                      </button>
                    </div>
                  </div>
                  <p className="cms-item-description">
                    {item.description?.substring(0, 100)}...
                  </p>
                  <div className="cms-item-meta">
                    <span>{item.company || item.organization}</span>
                    <span>{item.category || item.significance}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSPanel;