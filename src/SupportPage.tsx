import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportTicket, SupportMessage, SupportAttachment } from './types';
import { Icon } from './components/Icon';
import { API_CONFIG } from './config';

interface SupportPageProps {
  onBack: () => void;
  initialTicketData?: {
    subject: string;
    description: string;
    category: string;
  };
}

export default function SupportPage({ onBack, initialTicketData }: SupportPageProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => [
    {
      id: 'TKT-1024',
      subject: 'Issue with API authentication',
      status: 'Open',
      priority: 'High',
      category: 'Technical',
      apiId: '1',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          text: 'I am getting a 401 Unauthorized error even with a valid API key.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        }
      ]
    },
    {
      id: 'TKT-0982',
      subject: 'Billing question regarding tier 2',
      status: 'Resolved',
      priority: 'Medium',
      category: 'Billing',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        {
          id: 'msg-2',
          sender: 'user',
          text: 'How can I upgrade to the next tier?',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'msg-3',
          sender: 'agent',
          text: 'You can upgrade via the CRM portal. I have marked this as resolved.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        }
      ]
    }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(!!initialTicketData);
  const [replyText, setReplyText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTicket = useMemo(() => 
    tickets.find(t => t.id === selectedTicketId), 
  [tickets, selectedTicketId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if ((!replyText.trim() && selectedFiles.length === 0) || !selectedTicketId) return;

    const attachments: SupportAttachment[] = selectedFiles.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: replyText,
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setTickets(prev => prev.map(t => 
      t.id === selectedTicketId 
        ? { ...t, messages: [...t.messages, newMessage], updatedAt: new Date().toISOString() }
        : t
    ));
    setReplyText('');
    setSelectedFiles([]);
  };

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: formData.get('subject') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as SupportTicket['priority'],
      apiId: formData.get('apiId') as string,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: formData.get('description') as string,
          timestamp: new Date().toISOString(),
        }
      ]
    };
    setTickets([newTicket, ...tickets]);
    setIsNewTicketModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <div className="nx-support-page">
      <div className="nx-page-header nx-support-header">
        <div className="nx-header-left">
          <button onClick={onBack} className="nx-back-button">
            <Icon name="arrow-left" size={18} />
            Back to Marketplace
          </button>
          <h1>Support Center</h1>
        </div>
        <div className="nx-header-right">
          <button onClick={() => setIsNewTicketModalOpen(true)} className="nx-btn nx-btn-primary">
            <Icon name="plus" size={18} />
            New Ticket
          </button>
        </div>
      </div>

      <div className="nx-support-layout">
        <div className="nx-ticket-list-panel">
          <div className="nx-panel-header">
            <h3>Your Tickets</h3>
          </div>
          <div className="nx-ticket-items">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`nx-ticket-item ${selectedTicketId === ticket.id ? 'nx-active' : ''}`}
              >
                <div className="nx-ticket-meta">
                  <span className="nx-ticket-id">{ticket.id}</span>
                  <span className={`nx-status-pill nx-status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                </div>
                <h4 className="nx-ticket-subject">{ticket.subject}</h4>
                <div className="nx-ticket-footer">
                  <span className="nx-ticket-cat">{ticket.category}</span>
                  <span className="nx-ticket-date">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nx-ticket-detail-panel">
          {selectedTicket ? (
            <div className="nx-detail-wrapper">
              <div className="nx-detail-header">
                <div className="nx-detail-title">
                  <h2>{selectedTicket.subject}</h2>
                  <div className="nx-detail-meta">
                    <span className={`nx-priority-tag nx-priority-${selectedTicket.priority.toLowerCase()}`}>
                      {selectedTicket.priority} Priority
                    </span>
                    {selectedTicket.apiId && (
                      <span className="nx-api-tag">
                        API: {API_CONFIG.find(a => a.id === selectedTicket.apiId)?.name || 'Unknown'}
                      </span>
                    )}
                    <span>Created on {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="nx-messages-container">
                {selectedTicket.messages.map(msg => (
                  <div key={msg.id} className={`nx-message-bubble ${msg.sender === 'user' ? 'nx-user' : 'nx-agent'}`}>
                    <div className="nx-message-header">
                      <span className="nx-sender-name">{msg.sender === 'user' ? 'You' : 'Support Agent'}</span>
                      <span className="nx-message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="nx-message-text">{msg.text}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="nx-message-attachments">
                        {msg.attachments.map(att => (
                          <div key={att.id} className="nx-attachment-preview">
                            {att.type.startsWith('image/') ? (
                              <img 
                                src={att.url} 
                                alt={att.name} 
                                className="nx-attachment-image" 
                                onClick={() => setViewingImage(att.url)}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="nx-attachment-file">
                                <Icon name="external" size={16} />
                                <span>{att.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'Closed' && (
                <div className="nx-reply-box">
                  {selectedFiles.length > 0 && (
                    <div className="nx-selected-files">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="nx-selected-file-tag">
                          <span>{file.name}</span>
                          <button onClick={() => removeFile(idx)} className="nx-remove-file">
                            <Icon name="x" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="nx-compact-reply">
                    <textarea 
                      placeholder="Type your reply here... (Press Enter to send)"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="nx-compact-actions">
                      <button onClick={() => fileInputRef.current?.click()} className="nx-action-btn" title="Attach File">
                        <Icon name="external" size={18} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        multiple 
                        onChange={handleFileChange}
                      />
                      <button onClick={handleSendReply} className="nx-send-btn" title="Send Reply">
                        <Icon name="save" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="nx-empty-detail">
              <Icon name="bell" size={48} />
              <h3>Select a ticket to view conversation</h3>
              <p>Or create a new one if you need help.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isNewTicketModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="nx-modal-overlay" 
            onClick={() => setIsNewTicketModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="nx-modal-container nx-new-ticket-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="nx-modal-header">
                <h2>Create New Support Ticket</h2>
                <button onClick={() => setIsNewTicketModalOpen(false)} className="nx-close-btn">
                  <Icon name="x" size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="nx-modal-body">
                <div className="nx-form-group">
                  <label>Subject</label>
                  <input 
                    name="subject" 
                    type="text" 
                    placeholder="Brief summary of the issue" 
                    defaultValue={initialTicketData?.subject}
                    required 
                  />
                </div>
                <div className="nx-form-row">
                  <div className="nx-form-group">
                    <label>Category</label>
                    <select name="category" defaultValue={initialTicketData?.category || 'Technical'}>
                      <option>Technical</option>
                      <option>Billing</option>
                      <option>Account</option>
                      <option>Feature Request</option>
                      <option>Custom Development</option>
                    </select>
                  </div>
                  <div className="nx-form-group">
                    <label>Related API</label>
                    <select name="apiId">
                      <option value="">None / General</option>
                      {API_CONFIG.map(api => (
                        <option key={api.id} value={api.id}>{api.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="nx-form-row">
                  <div className="nx-form-group">
                    <label>Priority</label>
                    <select name="priority">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="nx-form-group">
                  <label>Description</label>
                  <textarea 
                    name="description" 
                    placeholder="Describe your issue in detail..." 
                    defaultValue={initialTicketData?.description}
                    required 
                    rows={5} 
                  />
                </div>
                <div className="nx-modal-footer">
                  <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="nx-btn nx-btn-ghost">Cancel</button>
                  <button type="submit" className="nx-btn nx-btn-primary">Create Ticket</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {viewingImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="nx-modal-overlay nx-lightbox"
            onClick={() => setViewingImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="nx-lightbox-content"
              onClick={e => e.stopPropagation()}
            >
              <img src={viewingImage} alt="Large view" className="nx-full-image" referrerPolicy="no-referrer" />
              <button onClick={() => setViewingImage(null)} className="nx-lightbox-close">
                <Icon name="x" size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
