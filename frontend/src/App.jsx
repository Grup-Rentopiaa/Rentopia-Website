import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import LikedPage from './pages/LikedPage';
import StatsPage from './pages/StatsPage';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  useEffect(() => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <AppLayout>
              <UploadPage />
            </AppLayout>
          }
        />
        <Route
          path="/liked"
          element={
            <AppLayout>
              <LikedPage />
            </AppLayout>
          }
        />
        <Route
          path="/stats"
          element={
            <AppLayout>
              <StatsPage />
            </AppLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
