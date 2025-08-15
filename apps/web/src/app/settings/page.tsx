'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'advanced', name: 'Advanced', icon: '⚡' }
  ]

  return (
    <div className="flex-1 space-y-8 p-8 bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-400 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div>
                        <h4 className="text-lg font-medium text-white">Dark Mode</h4>
                        <p className="text-slate-400">Use dark theme for the application</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div>
                        <h4 className="text-lg font-medium text-white">Auto Save</h4>
                        <p className="text-slate-400">Automatically save changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSave}
                          onChange={(e) => setAutoSave(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
                      </label>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Language</h4>
                      <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Profile Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6 p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div className="w-20 h-20 bg-gradient-to-br bg-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-white">Profile Picture</h4>
                        <p className="text-slate-400 mb-3">Upload a new profile picture</p>
                        <button className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all">
                          Upload Image
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                        <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Admin User"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                        <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="admin@nagent.com"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <label className="block text-sm font-medium text-slate-200 mb-2">Bio</label>
                      <textarea
                        rows={4}
                        defaultValue="AI Assistant Administrator"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h4>
                      <p className="text-slate-400 mb-4">Add an extra layer of security to your account</p>
                      <button className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">API Integrations</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">OpenAI API Key</h4>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="sk-..."
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all">
                          Save API Key
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Supabase Configuration</h4>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Supabase URL"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="Supabase Service Role Key"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div>
                        <h4 className="text-lg font-medium text-white">Email Notifications</h4>
                        <p className="text-slate-400">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
                      </label>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Notification Types</h4>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00ade8] bg-slate-700/50 border-slate-600 rounded focus:ring-blue-400" />
                          <span className="text-white">Document uploads</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00ade8] bg-slate-700/50 border-slate-600 rounded focus:ring-blue-400" />
                          <span className="text-white">Chat messages</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="w-4 h-4 text-[#00ade8] bg-slate-700/50 border-slate-600 rounded focus:ring-blue-400" />
                          <span className="text-white">System updates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Advanced Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">Data Management</h4>
                      <div className="space-y-4">
                        <button className="w-full px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all">
                          Export All Data
                        </button>
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all">
                          Clear All Data
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
                      <h4 className="text-lg font-medium text-white mb-4">System Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Version:</span>
                          <span className="text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Updated:</span>
                          <span className="text-white">2024-01-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Database Status:</span>
                          <span className="text-green-400">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
