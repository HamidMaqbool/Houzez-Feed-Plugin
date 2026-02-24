import React from 'react';
import { motion } from 'motion/react';
import { CompanyAPI } from '../types';
import { Icon } from './Icon';

interface DeleteConfirmationModalProps {
  api: CompanyAPI;
  onClose: () => void;
  onConfirm: (removeAllData: boolean) => void;
}

export function DeleteConfirmationModal({ api, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <div className="nx-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="nx-modal-container nx-delete-modal"
      >
        <div className="nx-delete-content">
          <div className="nx-delete-icon-wrapper">
            <Icon name="trash" size={32} />
          </div>
          <h2>Uninstall API?</h2>
          <p>
            You are about to uninstall <strong>{api.name}</strong>. This action will stop all active integrations.
          </p>

          <div className="nx-delete-actions">
            <button onClick={() => onConfirm(true)} className="nx-btn-delete-full">
              Remove with all data
            </button>
            <button onClick={() => onConfirm(false)} className="nx-btn-delete-simple">
              Just remove
            </button>
            <button onClick={onClose} className="nx-btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
