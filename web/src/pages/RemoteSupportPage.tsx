import React, { useState } from 'react';

const CHROME_REMOTE_DESKTOP_EXTENSION_URL =
  'https://chromewebstore.google.com/detail/chrome-remote-desktop/inomeogfingihgjfjlpeplalcfajhgai';
const CHROME_REMOTE_DESKTOP_SUPPORT_URL = 'https://remotedesktop.google.com/support';
const CHROME_REMOTE_DESKTOP_ACCESS_URL = 'https://remotedesktop.google.com/access';

const RemoteSupportPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!accessCode) return;
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Remote Support</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Use Chrome Remote Desktop to share your screen with a support specialist or connect to a
        remote machine.
      </p>

      <div className="space-y-6 max-w-2xl">
        {/* Step 1 – Install extension */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Step 1 — Install the Extension</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Chrome Remote Desktop requires the browser extension. Click the button below to open the
            Chrome Web Store and install it if you haven't already.
          </p>
          <a
            href={CHROME_REMOTE_DESKTOP_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Install Chrome Remote Desktop
          </a>
        </div>

        {/* Step 2 – Share your screen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Step 2 — Share Your Screen (Get Support)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            To let a support specialist connect to your machine, open the Chrome Remote Desktop
            support page, generate a one-time access code, and share it below.
          </p>
          <a
            href={CHROME_REMOTE_DESKTOP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Open Support Page
          </a>

          <div>
            <label className="block text-sm font-medium mb-1">Your Access Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Paste your access code here"
                className="flex-1 p-2 border rounded text-sm"
                maxLength={12} /* Chrome Remote Desktop one-time codes are exactly 12 digits */
              />
              <button
                onClick={handleCopy}
                disabled={!accessCode}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Share this code with your support specialist so they can connect to your screen.
            </p>
          </div>
        </div>

        {/* Step 3 – Give remote access */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Provide Remote Access (Advanced)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            To set up persistent remote access to a machine (e.g., for connecting to an office
            computer from home), use the Chrome Remote Desktop access page.
          </p>
          <a
            href={CHROME_REMOTE_DESKTOP_ACCESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Set Up Remote Access
          </a>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
          <strong>Privacy note:</strong> Chrome Remote Desktop sessions are end-to-end encrypted.
          Your support specialist can only connect when you actively share the one-time access code.
          You can stop sharing at any time by closing the session.
        </div>
      </div>
    </div>
  );
};

export default RemoteSupportPage;
