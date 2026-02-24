import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportTicket, SupportMessage, SupportAttachment } from './types';
import { Icon } from './components/Icon';

interface SupportPageProps {
  onBack: () => void;
}

export default function SupportPage({ onBack }: SupportPageProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => [
    {
      id: 'TKT-1024',
      subject: 'Issue with API authentication',
      status: 'Open',
      priority: 'High',
      category: 'Technical',
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
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const selectedTicket = useMemo(() => 
    tickets.find(t => t.id === selectedTicketId), 
  [tickets, selectedTicketId]);

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: replyText,
      timestamp: new Date().toISOString(),
    };

    setTickets(prev => prev.map(t => 
      t.id === selectedTicketId 
        ? { ...t, messages: [...t.messages, newMessage], updatedAt: new Date().toISOString() }
        : t
    ));
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: formData.get('subject') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as SupportTicket['priority'],
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

  return (
    <div className="nx-support-page">
      <div className="nx-page-header nx-support-header">
        <button onClick={onBack} className="nx-back-button">
          <Icon name="arrow-left" size={18} />
          Back to Marketplace
        </button>
        <div className="nx-header-row">
          <h1>Support Center</h1>
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
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'Closed' && (
                <div className="nx-reply-box">
                  <textarea 
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="nx-reply-actions">
                    <button className="nx-btn-ghost">
                      <Icon name="external" size={16} />
                      Attach File
                    </button>
                    <button onClick={handleSendReply} className="nx-btn nx-btn-primary">
                      Send Reply
                    </button>
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
                  <input name="subject" type="text" placeholder="Brief summary of the issue" required />
                </div>
                <div className="nx-form-row">
                  <div className="nx-form-group">
                    <label>Category</label>
                    <select name="category">
                      <option>Technical</option>
                      <option>Billing</option>
                      <option>Account</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
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
                  <textarea name="description" placeholder="Describe your issue in detail..." required rows={5} />
                </div>
                <div className="nx-modal-footer">
                  <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="nx-btn nx-btn-ghost">Cancel</button>
                  <button type="submit" className="nx-btn nx-btn-primary">Create Ticket</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
