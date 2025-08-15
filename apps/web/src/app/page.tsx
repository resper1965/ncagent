import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Metric Card - Total Documents */}
        <div className="metric-card metric-tickets">
          <div className="metric-card-header">
            <div className="metric-card-title">Total Documents</div>
            <div className="metric-card-icon-container">
              <svg className="metric-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="metric-card-value">1,234</div>
          <div className="metric-card-details">
            <span className="metric-badge high">+12%</span>
            <span className="metric-badge medium">This month</span>
          </div>
        </div>

        {/* Metric Card - Active Agents */}
        <div className="metric-card metric-controls">
          <div className="metric-card-header">
            <div className="metric-card-title">Active Agents</div>
            <div className="metric-card-icon-container">
              <svg className="metric-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="metric-card-value">12</div>
          <div className="metric-card-details">
            <span className="metric-badge high">+3</span>
            <span className="metric-badge medium">This week</span>
          </div>
        </div>

        {/* Metric Card - Chat Sessions */}
        <div className="metric-card metric-risks">
          <div className="metric-card-header">
            <div className="metric-card-title">Chat Sessions</div>
            <div className="metric-card-icon-container">
              <svg className="metric-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="metric-card-value">573</div>
          <div className="metric-card-details">
            <span className="metric-badge high">+45</span>
            <span className="metric-badge medium">Today</span>
          </div>
        </div>

        {/* Metric Card - System Uptime */}
        <div className="metric-card metric-incidents">
          <div className="metric-card-header">
            <div className="metric-card-title">System Uptime</div>
            <div className="metric-card-icon-container">
              <svg className="metric-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="metric-card-value">99.9%</div>
          <div className="metric-card-details">
            <span className="metric-badge high">+0.1%</span>
            <span className="metric-badge medium">This month</span>
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="activity-grid">
        {/* Services Column */}
        <div className="activity-item">
          <div className="activity-icon-container" style={{backgroundColor: 'rgba(96, 165, 250, 0.2)'}}>
            <svg className="activity-icon" style={{color: 'var(--blue-400)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="activity-content">
            <div className="activity-title">Chat Service</div>
            <div className="activity-description">AI-powered conversation system</div>
            <div className="activity-meta">
              <span>Active</span>
              <div className="activity-timestamp">
                <span>2 min ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Column */}
        <div className="activity-item">
          <div className="activity-icon-container" style={{backgroundColor: 'rgba(34, 197, 94, 0.2)'}}>
            <svg className="activity-icon" style={{color: 'var(--green-400)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="activity-content">
            <div className="activity-title">Document Upload</div>
            <div className="activity-description">New technical documentation added</div>
            <div className="activity-meta">
              <span>Processing</span>
              <div className="activity-timestamp">
                <span>5 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
