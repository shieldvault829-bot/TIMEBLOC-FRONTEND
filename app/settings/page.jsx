'use client';

import { useState } from 'react';
import { 
  Settings, User, Lock, Bell, Eye, 
  Globe, Shield, CreditCard, Database,
  Smartphone, Palette, Moon, Sun,
  Save, RefreshCw, Download, Upload,
  LogOut, Key, EyeOff, Users
} from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    badges: true,
    mentions: true
  });
  const [privacy, setPrivacy] = useState({
    profile: 'public',
    posts: 'public',
    stories: 'followers',
    gallery: 'private'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              Settings
            </h1>
            <p className="text-gray-400">Manage your account preferences</p>
          </div>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg"
          >
            <Save className="w-4 h-4" />
            Save All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account */}
            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="w-5 h-5 mr-3" />
                Account
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Email</label>
                  <input type="email" className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Password</label>
                  <input type="password" className="w-full p-3 bg-dark-900 border border-dark-700 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-3" />
                Privacy
              </h2>
              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{key}</div>
                      <div className="text-sm text-gray-400">Who can see your {key}</div>
                    </div>
                    <select
                      value={value}
                      onChange={(e) => setPrivacy({...privacy, [key]: e.target.value})}
                      className="px-3 py-1 bg-dark-900 border border-dark-700 rounded"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </h2>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="capitalize">{key} notifications</div>
                    <button
                      onClick={() => setNotifications({...notifications, [key]: !value})}
                      className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Display */}
            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-3" />
                Display
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>Dark Mode</div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`flex items-center w-12 h-6 rounded-full ${darkMode ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'} p-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>Language</div>
                  <select className="px-3 py-1 bg-dark-900 border border-dark-700 rounded">
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Danger Zone */}
          <div className="space-y-6">
            <div className="bg-red-900/20 border border-red-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
              
              <div className="space-y-4">
                <button className="w-full py-3 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30">
                  <div className="font-bold">Deactivate Account</div>
                  <div className="text-sm">Temporarily disable your account</div>
                </button>
                
                <button className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-600">
                  <div className="font-bold">Delete Account</div>
                  <div className="text-sm">Permanent deletion - cannot be undone</div>
                </button>
              </div>
            </div>

            {/* Advanced */}
            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Advanced</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border border-dark-700 rounded-lg hover:bg-dark-700">
                  <Download className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Export Data</div>
                </button>
                <button className="p-4 border border-dark-700 rounded-lg hover:bg-dark-700">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Clear Cache</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}