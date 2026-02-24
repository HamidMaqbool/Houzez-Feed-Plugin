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
  const [hasNewSupportResponse, setHasNewSupportResponse] = useState(true); // Mocking a new response
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'warning' | 'info'}[]>([
    { id: '1', message: 'System maintenance scheduled for Sunday at 02:00 AM UTC.', type: 'info' },
    { id: '2', message: 'Your Stripe Connect API key is expiring in 3 days.', type: 'warning' }
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
        <AnimatePresence>
          {notifications.length > 0 && currentPage === 'marketplace' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="nx-notifications-container"
            >
              {notifications.map(n => (
                <div key={n.id} className={`nx-notification-banner nx-notification-${n.type}`}>
                  <div className="nx-notification-content">
                    <Icon name={n.type === 'warning' ? 'shield' : 'bell'} size={16} />
                    <span>{n.message}</span>
                  </div>
                  <button onClick={() => dismissNotification(n.id)} className="nx-notification-close">
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
                    <div className="nx-brand-left">
                      <Icon name="zap" size={28} className="nx-brand-logo" />
                      <h1>API Marketplace</h1>
                    </div>
                    <div className="nx-brand-actions">
                      <div className="nx-master-key-badge">
                        <Icon name="key" size={14} />
                        <span className="nx-key-label">Master Key:</span>
                        <code className="nx-key-value">MK-8829-XPL-001</code>
                      </div>
                      <button 
                        onClick={() => {
                          setCurrentPage('support');
                          setHasNewSupportResponse(false);
                        }}
                        className="nx-action-btn-top nx-support-btn"
                        title="Support Center"
                      >
                        <div className="nx-icon-wrapper">
                          <motion.div
                            animate={hasNewSupportResponse ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            } : {}}
                            transition={hasNewSupportResponse ? {
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2
                            } : {}}
                          >
                            <Icon name="bell" size={18} />
                          </motion.div>
                          {hasNewSupportResponse && <span className="nx-unread-dot" />}
                        </div>
                        <span>Support</span>
                      </button>
                      <button 
                        onClick={() => setShowGeneralSettings(!showGeneralSettings)}
                        className={`nx-action-btn-top ${showGeneralSettings ? 'nx-active' : ''}`}
                        title="General Settings"
                      >
                        <Icon name="settings" size={18} />
                        <span>Settings</span>
                      </button>
                    </div>
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
                      onClick={() => setViewMode('grid')}
                      className={`nx-view-button ${viewMode === 'grid' ? 'nx-active' : ''}`}
                    >
                      <Icon name="grid" size={18} />
                      Grid
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`nx-view-button ${viewMode === 'list' ? 'nx-active' : ''}`}
                    >
                      <Icon name="list" size={18} />
                      List
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
