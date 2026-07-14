import { useEffect, useState } from 'react';
import AppLayout from '../components/common/AppLayout';
import { dashboardApi } from '../api/kaji-ulang-risiko';
import { useSelector } from 'react-redux';
import { selectUser } from '../states/auth/authSlice';
import RiskLevelBadge from '../components/common/RiskLevelBadge';

const RISK_ORDER = ['RENDAH', 'MEDIUM', 'TINGGI', 'SANGAT_TINGGI', 'EKSTREM'];
const RISK_LABELS = { RENDAH: 'Rendah', MEDIUM: 'Medium', TINGGI: 'Tinggi', SANGAT_TINGGI: 'Sangat Tinggi', EKSTREM: 'Ekstrem' };
const RISK_COLORS = { RENDAH: '#22c55e', MEDIUM: '#3b82f6', TINGGI: '#6b7280', SANGAT_TINGGI: '#eab308', EKSTREM: '#ef4444' };

function StatCard({ label, value, icon, color = 'teal' }) {
  const colorMap = { teal: 'bg-teal-50 text-teal-700', blue: 'bg-blue-50 text-blue-700', purple: 'bg-purple-50 text-purple-700', amber: 'bg-amber-50 text-amber-700' };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '-'}</p>
    </div>
  );
}

export default function DashboardPage() {
   const { users = [] } = useSelector((states) => states);
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang, <span className="font-medium text-teal-700">{user?.username}</span></p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Memuat data...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className={`grid gap-4 mb-6 ${user?.role === 'ADMIN' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3'}`}>
            {user?.role === 'ADMIN' && (
              <StatCard
                label="User Aktif"
                value={data?.jumlahUserAktif}
                color="teal"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              />
            )}
            <StatCard
              label="Total Data RPAM"
              value={totalRpam}
              color="blue"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>}
            />
            <StatCard
              label="Identifikasi Bahaya"
              value={data?.totalDataRpam?.identifikasiBahaya}
              color="purple"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
            <StatCard
              label="Penilaian Risiko"
              value={data?.totalDataRpam?.penilaianRisiko}
              color="amber"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribusi Risiko */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Distribusi Tingkat Risiko</h2>
              <div className="flex flex-col gap-3">
                {RISK_ORDER.map((key) => {
                  const total = Object.values(data?.distribusiTingkatRisiko || {}).reduce((a, b) => a + b, 0);
                  const val = data?.distribusiTingkatRisiko?.[key] || 0;
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <div className="flex items-center gap-2">
                          <RiskLevelBadge level={key} />
                        </div>
                        <span className="font-medium text-gray-700">{val} <span className="text-gray-400">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: RISK_COLORS[key] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
              <div className="flex flex-col gap-2">
                {(data?.aktivitasTerbaru || []).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada aktivitas</p>
                )}
                {(data?.aktivitasTerbaru || []).slice(0, 8).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-700 text-xs font-bold">{item.user?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{item.user}</span> {' '}
                        <span className="text-gray-500">{item.aksi?.toLowerCase()}</span> {' '}
                        <span className="text-gray-500">{item.module}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module counts */}
          <div className="mt-6 grid grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'M1 Bahaya', key: 'identifikasiBahaya' },
              { label: 'M2 Risiko', key: 'penilaianRisiko' },
              { label: 'M4 Kaji Ulang', key: 'kajiUlang' },
              { label: 'M5 Perbaikan', key: 'rencanaPerbaikan' },
              { label: 'M6 Pantau', key: 'pemantauan' },
            ].map(({ label, key }) => (
              <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-xl font-bold text-teal-700">{data?.totalDataRpam?.[key] ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
