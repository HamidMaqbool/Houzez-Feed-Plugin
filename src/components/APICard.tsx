import React from 'react';
import { motion } from 'motion/react';
import { CompanyAPI, APIStatus } from '../types';
import { Icon } from './Icon';
import { DropdownMenu } from './DropdownMenu';

interface APICardProps {
  key?: string | number;
  api: CompanyAPI;
  onDownload: () => void;
  onActivate: () => void;
  onUninstall: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
  onOpenLogs: () => void;
  onOpenQueue: () => void;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
}

export function APICard({ 
  api, 
  onDownload, 
  onActivate, 
  onUninstall, 
  onOpenSettings, 
  onOpenAnalytics,
  onOpenLogs,
  onOpenQueue,
  isDropdownOpen, 
  onToggleDropdown, 
  onCloseDropdown 
}: APICardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="nx-api-card"
    >
      <div className="nx-card-header">
        <div className="nx-logo-wrapper">
          <img 
            src={api.logo} 
            alt={api.name} 
            className="nx-api-logo"
            referrerPolicy="no-referrer"
          />
          {api.status === APIStatus.ACTIVE && (
            <div className="nx-status-badge">
              <Icon name="check" size={12} />
            </div>
          )}
        </div>
        <div className="nx-card-meta">
          <span className="nx-category-tag">{api.category}</span>
          <button onClick={onToggleDropdown} className="nx-more-button">
            <Icon name="more" size={18} />
          </button>
          <DropdownMenu 
            api={api} 
            isOpen={isDropdownOpen} 
            onClose={onCloseDropdown} 
            onOpenSettings={onOpenSettings}
            onOpenAnalytics={onOpenAnalytics}
            onOpenLogs={onOpenLogs}
            onOpenQueue={onOpenQueue}
            onUninstall={onUninstall}
          />
        </div>
      </div>

      <div className="nx-card-body">
        <h3>{api.name}</h3>
        <p>{api.description}</p>
      </div>

      <div className="nx-card-footer">
        <div className="nx-version-info">
          <span className="nx-version-label">Version</span>
          <span className="nx-version-value">{api.version}</span>
        </div>
        
        <div className="nx-action-buttons">
          {api.status === APIStatus.IDLE && (
            <button onClick={onDownload} className="nx-btn nx-btn-dark">
              <Icon name="download" size={16} />
              Download
            </button>
          )}

          {api.status === APIStatus.DOWNLOADING && (
            <button disabled className="nx-btn nx-btn-loading">
              <Icon name="loader" size={16} className="nx-animate-spin" />
              Downloading...
            </button>
          )}

          {(api.status === APIStatus.DOWNLOADED || api.status === APIStatus.ACTIVE) && (
            <>
              {api.status === APIStatus.DOWNLOADED ? (
                <button onClick={onActivate} className="nx-btn nx-btn-primary">
                  <Icon name="play" size={16} />
                  Activate
                </button>
              ) : (
                <div className="nx-active-badge">
                  <Icon name="check" size={14} />
                  Active
                </div>
              )}
              
              <button onClick={onOpenSettings} className="nx-btn-ghost" title="Settings">
                <Icon name="settings" size={18} />
              </button>

              <button onClick={onUninstall} className="nx-btn-ghost nx-btn-ghost-danger" title="Uninstall">
                <Icon name="trash" size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
