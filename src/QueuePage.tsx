import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyAPI, QueueItem } from './types';
import { Icon } from './components/Icon';
import { Pagination } from './components/Pagination';

interface QueuePageProps {
  api: CompanyAPI;
  onBack: () => void;
}

export default function QueuePage({ api, onBack }: QueuePageProps) {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [queueItems, setQueueItems] = useState<QueueItem[]>(() => {
    const tasks = ['Data Sync', 'Webhook Delivery', 'Report Generation', 'Image Processing', 'Email Notification'];
    const priorities: QueueItem['priority'][] = ['Low', 'Medium', 'High'];
    const statuses: QueueItem['status'][] = ['Pending', 'Processing', 'Failed', 'Retrying'];
    
    return Array.from({ length: 25 }).map((_, i) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - i * 15);
      
      return {
        id: `q-${i}`,
        timestamp: date.toISOString(),
        taskName: tasks[Math.floor(Math.random() * tasks.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        attempts: Math.floor(Math.random() * 3),
        payload: { ref: `REF-${Math.random().toString(36).substring(7).toUpperCase()}` }
      };
    });
  });

  const filteredItems = useMemo(() => {
    return queueItems.filter(item => 
      item.taskName.toLowerCase().includes(filter.toLowerCase()) ||
      item.status.toLowerCase().includes(filter.toLowerCase()) ||
      item.priority.toLowerCase().includes(filter.toLowerCase())
    );
  }, [queueItems, filter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleDelete = (id: string) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRetry = (id: string) => {
    setQueueItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Retrying', attempts: item.attempts + 1 } : item
    ));
    
    // Simulate processing
    setTimeout(() => {
      setQueueItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'Processing' } : item
      ));
    }, 1500);
  };

  const handleView = (item: QueueItem) => {
    alert(`Task: ${item.taskName}\nID: ${item.id}\nPayload: ${JSON.stringify(item.payload)}`);
  };

  return (
    <div className="nx-queue-page">
      <div className="nx-logs-header">
        <button onClick={onBack} className="nx-back-button">
          <Icon name="arrow-left" size={18} />
          Back to Marketplace
        </button>
        <div className="nx-header-content">
          <div className="nx-api-info">
            <div className="nx-queue-icon-wrapper">
              <Icon name="layers" size={32} />
            </div>
            <div>
              <h1>{api.name} Task Queue</h1>
              <p>Manage pending and background tasks for {api.name}</p>
            </div>
          </div>
          <div className="nx-logs-actions">
            <div className="nx-search-container">
              <Icon name="search" size={16} className="nx-search-icon" />
              <input 
                type="text" 
                placeholder="Filter tasks..." 
                className="nx-search-input"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nx-logs-container">
        <div className="nx-queue-table-header">
          <div className="nx-col-time">Created</div>
          <div className="nx-col-task">Task Name</div>
          <div className="nx-col-priority">Priority</div>
          <div className="nx-col-status">Status</div>
          <div className="nx-col-attempts">Attempts</div>
          <div className="nx-col-actions">Actions</div>
        </div>
        <div className="nx-logs-list">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + filter + queueItems.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {paginatedItems.map((item) => (
                <div key={item.id} className="nx-log-row nx-queue-row">
                  <div className="nx-col-time nx-mono">{new Date(item.timestamp).toLocaleTimeString()}</div>
                  <div className="nx-col-task font-semibold">{item.taskName}</div>
                  <div className="nx-col-priority">
                    <span className={`nx-priority-tag nx-priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="nx-col-status">
                    <span className={`nx-status-dot nx-status-${item.status.toLowerCase()}`} />
                    <span className="capitalize">{item.status}</span>
                  </div>
                  <div className="nx-col-attempts nx-mono">{item.attempts}</div>
                  <div className="nx-col-actions">
                    <div className="nx-queue-actions">
                      <button onClick={() => handleView(item)} className="nx-action-btn-icon" title="View Details">
                        <Icon name="external" size={14} />
                      </button>
                      <button 
                        onClick={() => handleRetry(item.id)} 
                        className="nx-action-btn-icon" 
                        title="Retry Task"
                        disabled={item.status === 'Processing' || item.status === 'Retrying'}
                      >
                        <Icon name="history" size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="nx-action-btn-icon nx-text-danger" title="Delete Task">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="nx-no-logs">
              <div className="nx-empty-queue-icon">
                <Icon name="check" size={48} />
              </div>
              <h3>Queue is Empty</h3>
              <p>There are no tasks currently waiting in the queue.</p>
            </div>
          )}
        </div>
        
        {filteredItems.length > 0 && (
          <div className="nx-logs-footer">
            <div className="nx-logs-summary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} tasks
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
