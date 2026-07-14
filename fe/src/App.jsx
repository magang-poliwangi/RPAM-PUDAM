import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncPreloadProcess } from "./states/isPreload/action";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import KajiUlangPage from "./pages/KajiUlangRisikoPage";
import RencanaPerbaikanPage from "./pages/RencanaPerbaikanPage";
import ManagementUserPage from "./pages/ManagementUserPage";
import PemantauanOperasionalPage from "./pages/PemantauanOperasionalPage";
import IdentifikasiDanKejadianBahayaPage from "./pages/IdentifikasiDanKejadianBahayaPage";
import PenilaianRisikoPage from "./pages/PenilaianRisikoPage";
import LokasiSpamPage from "./pages/LokasiSpamPage";

function App() {
const authUser = useSelector((state) => state.authUser);
const isPreload = useSelector((state) => state.isPreload); 
 const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return <div className="app-shell flex items-center justify-center text-sm text-app-text-muted">Memuat aplikasi...</div>;
  }

  if (!authUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/lokasi-spam" element={<LokasiSpamPage />} />
      <Route path="/identifikasi-dan-kejadian-bahaya" element={<IdentifikasiDanKejadianBahayaPage />} />
      <Route path="/penilaian-risiko" element={<PenilaianRisikoPage />} />
      <Route path="/kaji-ulang" element={<KajiUlangPage />} />
      <Route path="/rencana-perbaikan" element={<RencanaPerbaikanPage />} />
      <Route path="/pemantauan-operasional" element={<PemantauanOperasionalPage />} />
      
      {authUser.role === "ADMIN" && <Route path="/management-user" element={<ManagementUserPage />} />}
      <Route path="/" element={<Navigate to="/identifikasi-dan-kejadian-bahaya" replace />} />
      <Route path="*" element={<Navigate to="/identifikasi-dan-kejadian-bahaya" replace />} />
    </Routes>
  );
}

export default App;
