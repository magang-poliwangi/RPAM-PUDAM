import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Provider } from 'react-redux';
import store from './states/index';

import { GuestRoute, ProtectedRoute } from './components/common/RouteGuards';
import DashboardPage from './pages/DashboardPage';
import IdentifikasiBahayaPage from './pages/IdentifikasiBahayaPage';
import PenilaianRisikoPage from './pages/PenilaianRisikoPage';
import KajiUlangPage from './pages/KajiUlangPage';
import RencanaPerbaikanPage from './pages/RencanaPerbaikanPage';
import PemantauanPage from './pages/PemantauanPage';
import UsersPage from './pages/UsersPage';
import AuditLogPage from './pages/AuditLogPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/identifikasi-bahaya" element={<ProtectedRoute><IdentifikasiBahayaPage /></ProtectedRoute>} />
          <Route path="/penilaian-risiko" element={<ProtectedRoute><PenilaianRisikoPage /></ProtectedRoute>} />
          <Route path="/kaji-ulang" element={<ProtectedRoute><KajiUlangPage /></ProtectedRoute>} />
          <Route path="/rencana-perbaikan" element={<ProtectedRoute><RencanaPerbaikanPage /></ProtectedRoute>} />
          <Route path="/pemantauan" element={<ProtectedRoute><PemantauanPage /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/users" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
          <Route path="/audit-log" element={<ProtectedRoute adminOnly><AuditLogPage /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
