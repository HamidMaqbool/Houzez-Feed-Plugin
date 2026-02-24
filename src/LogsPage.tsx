import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyAPI, LogEntry } from './types';
import { Icon } from './components/Icon';
import { Pagination } from './components/Pagination';

interface LogsPageProps {
  api: CompanyAPI;
  onBack: () => void;
}

export default function LogsPage({ api, onBack }: LogsPageProps) {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const mockLogs = useMemo(() => {
    const methods: LogEntry['method'][] = ['GET', 'POST', 'PUT', 'DELETE'];
    const endpoints = ['/v1/auth', '/v2/data', '/v1/users', '/v1/sync', '/v2/query'];
    const statuses = [200, 201, 400, 401, 403, 404, 500];
    
    return Array.from({ length: 125 }).map((_, i) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - i * 5);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      
      return {
        id: `log-${i}`,
        timestamp: date.toISOString(),
        method,
        endpoint: `${api.id}${endpoint}`,
        status,
        duration: Math.floor(Math.random() * 500) + 50,
        message: status < 400 ? 'Request processed successfully' : 'Error processing request',
        payload: method === 'POST' || method === 'PUT' ? { data: '...' } : undefined
      } as LogEntry;
    });
  }, [api]);

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => 
      log.endpoint.toLowerCase().includes(filter.toLowerCase()) ||
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.status.toString().includes(filter)
    );
  }, [mockLogs, filter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="nx-logs-page">
      <div className="nx-logs-header">
        <button onClick={onBack} className="nx-back-button">
          <Icon name="arrow-left" size={18} />
          Back to Marketplace
        </button>
        <div className="nx-header-content">
          <div className="nx-api-info">
            <img src={api.logo} alt={api.name} className="nx-api-logo-small" referrerPolicy="no-referrer" />
            <div>
              <h1>{api.name} Logs</h1>
              <p>Real-time request and error tracking for {api.name}</p>
            </div>
          </div>
          <div className="nx-logs-actions">
            <div className="nx-search-container">
              <Icon name="search" size={16} className="nx-search-icon" />
              <input 
                type="text" 
                placeholder="Filter logs..." 
                className="nx-search-input"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nx-logs-container">
        <div className="nx-logs-table-header">
          <div className="nx-col-time">Timestamp</div>
          <div className="nx-col-method">Method</div>
          <div className="nx-col-endpoint">Endpoint</div>
          <div className="nx-col-status">Status</div>
          <div className="nx-col-duration">Duration</div>
          <div className="nx-col-message">Message</div>
        </div>
        <div className="nx-logs-list">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {paginatedLogs.map((log) => (
                <div 
                  key={log.id}
                  className="nx-log-row"
                >
                  <div className="nx-col-time nx-mono">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="nx-col-method">
                    <span className={`nx-method-tag nx-method-${log.method.toLowerCase()}`}>
                      {log.method}
                    </span>
                  </div>
                  <div className="nx-col-endpoint nx-mono">{log.endpoint}</div>
                  <div className="nx-col-status">
                    <span className={`nx-status-dot ${log.status < 400 ? 'nx-status-success' : 'nx-status-error'}`} />
                    <span className={log.status < 400 ? 'text-emerald-600' : 'text-red-600'}>
                      {log.status}
                    </span>
                  </div>
                  <div className="nx-col-duration nx-mono">{log.duration}ms</div>
                  <div className="nx-col-message">{log.message}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          {filteredLogs.length === 0 && (
            <div className="nx-no-logs">
              <Icon name="search" size={48} />
              <p>No logs found matching your filter.</p>
            </div>
          )}
        </div>
        
        {filteredLogs.length > 0 && (
          <div className="nx-logs-footer">
            <div className="nx-logs-summary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
