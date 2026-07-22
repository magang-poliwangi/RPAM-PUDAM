import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className="app-shell flex flex-col md:flex-row min-h-screen">

      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:hidden sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">RPAM</p>
            <p className="text-xs text-gray-400 mt-0.5">PUDAM</p>
          </div>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Buka Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <main className="app-main flex-1">
        <div className="app-content p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
