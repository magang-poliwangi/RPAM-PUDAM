import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncPreloadProcess } from "./states/isPreload/action";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import KajiUlangPage from "./pages/KajiUlangRisikoPage";
import RencanaPerbaikanPage from "./pages/RencanaPerbaikanPage";
import ManagementUserPage from "./pages/ManagementUserPage";

function App() {
  const { authUser, isPreload } = useSelector((state) => state);
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
      <Route path="/kaji-ulang" element={<KajiUlangPage />} />
      <Route path="/rencana-perbaikan" element={<RencanaPerbaikanPage />} />
      {authUser.role === "ADMIN" && <Route path="/management-user" element={<ManagementUserPage />} />}
      <Route path="/" element={<Navigate to="/kaji-ulang" replace />} />
      <Route path="*" element={<Navigate to="/kaji-ulang" replace />} />
    </Routes>
  );
}

export default App;
