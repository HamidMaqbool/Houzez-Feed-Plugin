import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { APIStatus, CompanyAPI } from './types';
import { API_CONFIG } from './config';
import AnalyticsPage from './AnalyticsPage';
import LogsPage from './LogsPage';
import QueuePage from './QueuePage';
import SupportPage from './SupportPage';
import { Icon } from './components/Icon';
import { APICard } from './components/APICard';
import { APIListItem } from './components/APIListItem';
import { SettingsModal } from './components/SettingsModal';
import { GeneralSettings } from './components/GeneralSettings';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { LicenseGate } from './components/LicenseGate';

export default function App() {
  const [isLicensed, setIsLicensed] = useState(false);
  const [showLicenseGate, setShowLicenseGate] = useState(false);
  const [apis, setApis] = useState<CompanyAPI[]>(API_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<'marketplace' | 'analytics' | 'logs' | 'queue' | 'support'>('marketplace');
  const [selectedApiForSettings, setSelectedApiForSettings] = useState<CompanyAPI | null>(null);
  const [selectedApiForLogs, setSelectedApiForLogs] = useState<CompanyAPI | null>(null);
  const [selectedApiForQueue, setSelectedApiForQueue] = useState<CompanyAPI | null>(null);
  const [apiToDelete, setApiToDelete] = useState<CompanyAPI | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);

  const handleDownload = (id: string) => {
    if (!isLicensed) {
      setShowLicenseGate(true);
      return;
    }
    setApis(prev => prev.map(api => 
      api.id === id ? { ...api, status: APIStatus.DOWNLOADING } : api
    ));

    setTimeout(() => {
      setApis(prev => prev.map(api => 
        api.id === id ? { ...api, status: APIStatus.DOWNLOADED } : api
      ));
    }, 2000);
  };

  const handleActivate = (id: string) => {
    if (!isLicensed) {
      setShowLicenseGate(true);
      return;
    }
    setApis(prev => prev.map(api => 
      api.id === id ? { ...api, status: APIStatus.ACTIVE } : api
    ));
  };

  const handleUninstall = (id: string, removeAllData: boolean = false) => {
    setApis(prev => prev.map(api => 
      api.id === id ? { ...api, status: APIStatus.IDLE, settings: removeAllData ? undefined : api.settings } : api
    ));
    setApiToDelete(null);
  };

  const handleSaveSettings = (id: string, settings: Record<string, any>, version: string) => {
    setApis(prev => prev.map(api => 
      api.id === id ? { ...api, settings, version } : api
    ));
    setSelectedApiForSettings(null);
  };

  const filteredApis = apis.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="nx-app-root">
      <AnimatePresence>
        {showLicenseGate && !isLicensed && (
          <LicenseGate 
            onValidated={() => {
              setIsLicensed(true);
              setShowLicenseGate(false);
            }} 
            onClose={() => setShowLicenseGate(false)}
          />
        )}
      </AnimatePresence>
      
      <main className="nx-main-content">
        <AnimatePresence mode="wait">
          {currentPage === 'marketplace' ? (
            <motion.div 
              key="marketplace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="nx-content-wrapper"
            >
              <div className="nx-page-header">
                <div className="nx-page-title">
                  <div className="nx-brand-row">
                    <Icon name="zap" size={28} className="nx-brand-logo" />
                    <h1>API Marketplace</h1>
                  </div>
                  <p>Discover and manage your enterprise integrations with ease.</p>
                </div>
                
                <div className="nx-controls-row">
                  <div className="nx-search-container">
                    <Icon name="search" size={18} className="nx-search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search APIs..." 
                      className="nx-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="nx-view-controls">
                    <button 
                      onClick={() => setCurrentPage('analytics')}
                      className="nx-view-button"
                      title="Analytics"
                    >
                      <Icon name="activity" size={18} />
                      Analytics
                    </button>
                    <button 
                      onClick={() => setCurrentPage('support')}
                      className="nx-view-button"
                      title="Support Center"
                    >
                      <Icon name="bell" size={18} />
                      Support
                    </button>
                    <div className="nx-control-divider" />
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`nx-view-button ${viewMode === 'grid' ? 'nx-active' : ''}`}
                    >
                      Grid
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`nx-view-button ${viewMode === 'list' ? 'nx-active' : ''}`}
                    >
                      List
                    </button>
                    <button 
                      onClick={() => setShowGeneralSettings(!showGeneralSettings)}
                      className={`nx-view-button ${showGeneralSettings ? 'nx-active' : ''}`}
                      title="General Settings"
                    >
                      <Icon name="settings" size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="nx-marketplace-body">
                <div className={viewMode === 'grid' ? "nx-grid-layout" : "nx-list-layout"}>
                  <AnimatePresence mode="popLayout">
                    {filteredApis.map((api) => (
                      viewMode === 'grid' ? (
                        <APICard 
                          key={api.id} 
                          api={api} 
                          onDownload={() => handleDownload(api.id)}
                          onActivate={() => handleActivate(api.id)}
                          onUninstall={() => setApiToDelete(api)}
                          onOpenSettings={() => {
                            if (!isLicensed) {
                              setShowLicenseGate(true);
                            } else {
                              setSelectedApiForSettings(api);
                            }
                          }}
                          onOpenAnalytics={() => setCurrentPage('analytics')}
                          onOpenLogs={() => {
                            setSelectedApiForLogs(api);
                            setCurrentPage('logs');
                          }}
                          onOpenQueue={() => {
                            setSelectedApiForQueue(api);
                            setCurrentPage('queue');
                          }}
                          isDropdownOpen={activeDropdown === api.id}
                          onToggleDropdown={() => setActiveDropdown(activeDropdown === api.id ? null : api.id)}
                          onCloseDropdown={() => setActiveDropdown(null)}
                        />
                      ) : (
                        <APIListItem 
                          key={api.id} 
                          api={api} 
                          onDownload={() => handleDownload(api.id)}
                          onActivate={() => handleActivate(api.id)}
                          onUninstall={() => setApiToDelete(api)}
                          onOpenSettings={() => {
                            if (!isLicensed) {
                              setShowLicenseGate(true);
                            } else {
                              setSelectedApiForSettings(api);
                            }
                          }}
                          onOpenAnalytics={() => setCurrentPage('analytics')}
                          onOpenLogs={() => {
                            setSelectedApiForLogs(api);
                            setCurrentPage('logs');
                          }}
                          onOpenQueue={() => {
                            setSelectedApiForQueue(api);
                            setCurrentPage('queue');
                          }}
                          isDropdownOpen={activeDropdown === api.id}
                          onToggleDropdown={() => setActiveDropdown(activeDropdown === api.id ? null : api.id)}
                          onCloseDropdown={() => setActiveDropdown(null)}
                        />
                      )
                    ))}
                  </AnimatePresence>
                </div>
                
                <AnimatePresence>
                  {showGeneralSettings && (
                    <GeneralSettings 
                      isOpen={showGeneralSettings} 
                      onClose={() => setShowGeneralSettings(false)} 
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : currentPage === 'analytics' ? (
            <AnalyticsPage onBack={() => setCurrentPage('marketplace')} />
          ) : currentPage === 'logs' ? (
            selectedApiForLogs && (
              <LogsPage 
                api={selectedApiForLogs} 
                onBack={() => {
                  setCurrentPage('marketplace');
                  setSelectedApiForLogs(null);
                }} 
              />
            )
          ) : currentPage === 'queue' ? (
            selectedApiForQueue && (
              <QueuePage 
                api={selectedApiForQueue} 
                onBack={() => {
                  setCurrentPage('marketplace');
                  setSelectedApiForQueue(null);
                }} 
              />
            )
          ) : (
            <SupportPage onBack={() => setCurrentPage('marketplace')} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedApiForSettings && (
          <SettingsModal 
            api={selectedApiForSettings} 
            onClose={() => setSelectedApiForSettings(null)} 
            onSave={handleSaveSettings}
          />
        )}
        {apiToDelete && (
          <DeleteConfirmationModal 
            api={apiToDelete}
            onClose={() => setApiToDelete(null)}
            onConfirm={(removeAllData) => handleUninstall(apiToDelete.id, removeAllData)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
