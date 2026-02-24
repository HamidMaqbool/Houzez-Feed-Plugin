import React from 'react';
import { motion } from 'motion/react';
import { CompanyAPI } from '../types';
import { Icon } from './Icon';

interface DropdownMenuProps {
  api: CompanyAPI;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
  onOpenLogs: () => void;
  onOpenQueue: () => void;
  onUninstall: () => void;
}

export function DropdownMenu({ isOpen, onClose, onOpenSettings, onOpenAnalytics, onOpenLogs, onOpenQueue, onUninstall }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="nx-dropdown-overlay" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="nx-dropdown-menu"
      >
        <button onClick={() => { onOpenSettings(); onClose(); }} className="nx-dropdown-item">
          <Icon name="settings" size={16} />
          API Settings
        </button>
        <button onClick={() => { onOpenAnalytics(); onClose(); }} className="nx-dropdown-item">
          <Icon name="activity" size={16} />
          Usage Analytics
        </button>
        <button onClick={() => { onOpenLogs(); onClose(); }} className="nx-dropdown-item">
          <Icon name="terminal" size={16} />
          View Logs
        </button>
        <button onClick={() => { onOpenQueue(); onClose(); }} className="nx-dropdown-item">
          <Icon name="layers" size={16} />
          Task Queue
        </button>
        <button onClick={() => { window.open('https://docs.example.com', '_blank'); onClose(); }} className="nx-dropdown-item">
          <Icon name="external" size={16} />
          View Documentation
        </button>
        <div className="nx-dropdown-divider" />
        <button onClick={() => { onUninstall(); onClose(); }} className="nx-dropdown-item nx-dropdown-item-danger">
          <Icon name="trash" size={16} />
          Uninstall API
        </button>
      </motion.div>
    </>
  );
}
