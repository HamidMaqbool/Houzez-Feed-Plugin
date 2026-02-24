import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const DATA_USAGE = [
  { name: 'Mon', requests: 4000, latency: 240 },
  { name: 'Tue', requests: 3000, latency: 198 },
  { name: 'Wed', requests: 2000, latency: 980 },
  { name: 'Thu', requests: 2780, latency: 390 },
  { name: 'Fri', requests: 1890, latency: 480 },
  { name: 'Sat', requests: 2390, latency: 380 },
  { name: 'Sun', requests: 3490, latency: 430 },
];

const API_DISTRIBUTION = [
  { name: 'Stripe', value: 400 },
  { name: 'Twilio', value: 300 },
  { name: 'AWS S3', value: 300 },
  { name: 'SendGrid', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function Icon({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) {
  return (
    <svg className={`nx-icon ${className}`} style={{ width: size, height: size }}>
      <use href={`#icon-${name}`} />
    </svg>
  );
}

export default function AnalyticsPage({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="nx-analytics-page"
    >
      <div className="nx-analytics-header">
        <button onClick={onBack} className="nx-back-button">
          <Icon name="arrow-left" size={20} />
          Back to Marketplace
        </button>
        <h1>System Analytics</h1>
        <p>Real-time monitoring of your API integrations and performance.</p>
      </div>

      <div className="nx-stats-grid">
        <div className="nx-stat-card">
          <div className="nx-stat-icon" style={{ backgroundColor: 'var(--nx-indigo-50)', color: 'var(--nx-indigo-600)' }}>
            <Icon name="activity" size={24} />
          </div>
          <div className="nx-stat-info">
            <span className="nx-stat-label">Total Requests</span>
            <span className="nx-stat-value">1.2M</span>
            <span className="nx-stat-trend nx-positive">
              <Icon name="trending-up" size={12} />
              +12.5%
            </span>
          </div>
        </div>

        <div className="nx-stat-card">
          <div className="nx-stat-icon" style={{ backgroundColor: 'var(--nx-emerald-50)', color: 'var(--nx-emerald-700)' }}>
            <Icon name="zap" size={24} />
          </div>
          <div className="nx-stat-info">
            <span className="nx-stat-label">Avg. Latency</span>
            <span className="nx-stat-value">124ms</span>
            <span className="nx-stat-trend nx-positive">
              <Icon name="trending-up" size={12} />
              -8.2%
            </span>
          </div>
        </div>

        <div className="nx-stat-card">
          <div className="nx-stat-icon" style={{ backgroundColor: 'var(--nx-red-50)', color: 'var(--nx-red-600)' }}>
            <Icon name="shield" size={24} />
          </div>
          <div className="nx-stat-info">
            <span className="nx-stat-label">Error Rate</span>
            <span className="nx-stat-value">0.04%</span>
            <span className="nx-stat-trend nx-negative">
              <Icon name="trending-up" size={12} />
              +0.01%
            </span>
          </div>
        </div>
      </div>

      <div className="nx-charts-grid">
        <div className="nx-chart-container">
          <div className="nx-chart-header">
            <h3>Request Volume</h3>
            <p>Daily API calls across all services</p>
          </div>
          <div className="nx-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={DATA_USAGE}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="nx-chart-container">
          <div className="nx-chart-header">
            <h3>API Distribution</h3>
            <p>Usage share by service provider</p>
          </div>
          <div className="nx-chart-body" style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={API_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {API_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="nx-chart-legend">
              {API_DISTRIBUTION.map((entry, index) => (
                <div key={entry.name} className="nx-legend-item">
                  <div className="nx-legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nx-chart-container nx-full-width">
          <div className="nx-chart-header">
            <h3>Latency Performance</h3>
            <p>Average response time in milliseconds</p>
          </div>
          <div className="nx-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DATA_USAGE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="latency" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
