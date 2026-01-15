import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" className="toggle-checkbox" id="dark-mode" />
                <label className="toggle-label" htmlFor="dark-mode"></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications about updates</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" className="toggle-checkbox" id="notifications" defaultChecked />
                <label className="toggle-label" htmlFor="notifications"></label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Language & Region</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select className="w-full p-2 border rounded">
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select className="w-full p-2 border rounded">
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Europe/Moscow">Moscow (MSK)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
