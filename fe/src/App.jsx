import {  Route, Routes  } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useDispatch, useSelector } from 'react-redux';
import DashboardPage from './pages/admin/DashboardPage';
import ManagementUserPage from './pages/admin/ManagementUserPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { useEffect } from 'react';

function App() {
  const {
    authUser = null,
    isPreload = false,
  } = useSelector((states) => states);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch((asyncPreloadProcess()));
  }, [dispatch]);

  if (isPreload) {
    return null;
  }
  return (
    <Routes>
      {authUser === null && (
        <Route path='*' element={<LoginPage />} />
      )}

      {/* ADMIN */}
      {authUser?.role === "ADMIN" && (
        <>
          <Route path='/management-user' element={<ManagementUserPage />} />
          <Route path='*' element={<DashboardPage />} />
        </>
      )}

      {/* USER */}
      {authUser?.role === "USER" && (
        <>
          {/* route user spesifik di sini */}
          {/* <Route path='*' element={<UserHomePage />} /> */}
        </>
      )}
    </Routes>
  )
}

export default App;
