import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router';
import { CiLogin } from "react-icons/ci";
import { asyncUnsetAuthUser } from '../../states/authUser/action';

const navItems = [
  {
    group: 'Modul RPAM',
    items: [
      {
        to: '/bahaya-kontaminasi', label: 'Bahaya Kontaminasi', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      {
        to: '/lokasi-spam', label: 'Lokasi Spam', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      {
        to: '/identifikasi-dan-kejadian-bahaya', label: 'Identifikasi Bahaya', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      },
      {
        to: '/penilaian-risiko', label: 'Penilaian Risiko', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      {
        to: '/kaji-ulang', label: 'Kaji Ulang Risiko', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
      },
      {
        to: '/rencana-perbaikan', label: 'Rencana Perbaikan', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      },
      {
        to: '/pemantauan-operasional', label: 'Pemantauan Operasional', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      },
    ],
  },
  {
    group: 'Data',
    items: [
      {
        to: '/excel', label: 'Export & Import Excel', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        )
      },
    ],
  },
  {
    group: 'Admin',
    adminOnly: true,
    items: [
      {
        to: '/management-user', label: 'Manajemen User', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      },
      {
        to: '/audit-log', label: 'Audit Log', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
    ],
  },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const enabledRoutes = new Set([
    '/bahaya-kontaminasi',
    '/lokasi-spam',
    '/identifikasi-dan-kejadian-bahaya',
    '/penilaian-risiko',
    '/kaji-ulang',
    '/rencana-perbaikan',
    '/pemantauan-operasional',
    '/excel',
    '/management-user',
    '/audit-log'
  ]);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <>
      {/* Overlay hitam transparan untuk tampilan Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-100 shadow-sm transition-transform duration-200 ease-in-out
          md:static md:translate-x-0
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-64'}
          min-h-screen flex-shrink-0
        `}
      >
        {/* Logo & Toggle Collapse/Close */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {(!collapsed || isMobileOpen) && (
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">RPAM</p>
              <p className="text-xs text-gray-400 mt-0.5">PUDAM</p>
            </div>
          )}

          {/* Tombol Collapse (Tampilan Desktop) */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden md:block ml-auto p-1 rounded-md cursor-pointer z-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
          </button>

          {/* Tombol Close (Tampilan Mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden ml-auto p-1 rounded-md cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
          {navItems.map((group) => {
            if (group.adminOnly && authUser?.role !== 'ADMIN') return null;
            return (
              <div key={group.group} className="mb-4">
                {(!collapsed || isMobileOpen) && (
                  <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.group}</p>
                )}
                {group.items.filter((item) => enabledRoutes.has(item.to)).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileOpen(false)} // Tutup sidebar mobile saat opsi diklik
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                      isActive(item.to)
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`flex-shrink-0 ${isActive(item.to) ? 'text-teal-700' : 'text-gray-400'}`}>{item.icon}</span>
                    {(!collapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-100 p-3">
          <div className={`flex flex-wrap items-center gap-3 px-2 py-2 rounded-lg ${collapsed && !isMobileOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{authUser?.username?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            {(!collapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{authUser?.username}</p>
                <p className="text-xs text-gray-400">{authUser?.role === 'ADMIN' ? 'Admin' : 'User'}</p>
              </div>
            )}
            <button
              onClick={() => {
                dispatch(asyncUnsetAuthUser());
              }}
              className="cursor-pointer hover:bg-red-200 active:bg-red-200 p-1 hover:ring-1 active:ring-1 hover:ring-red-500 active:ring-red-500 transition ease-in rounded-md"
            >
              <CiLogin className="text-2xl text-red-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}