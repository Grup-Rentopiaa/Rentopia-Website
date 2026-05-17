import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute  from "./components/PublicRoute";

import LandingPage         from "./pages/LandingPage";
import LoginPage           from "./pages/LoginPage";
import SignUpPage          from "./pages/SignUpPage";
import VerifyOtpPage       from "./pages/VerifyOtpPage";
import ForgotPasswordPage  from "./pages/ForgotPasswordPage";
import VerifyOtpForgotPage from "./pages/VerifyOtpForgotPage";
import ResetPasswordPage   from "./pages/ResetPasswordPage";
import HomePage            from "./pages/HomePage";
import ChatPage            from "./pages/ChatPage";
import OfferPage           from "./pages/OfferPage";
import ProfilPage          from "./pages/ProfilPage";
import DashboardPage       from "./pages/DashboardPage";
import UploadPage          from "./pages/UploadPage";
import EditProfilePage     from "./pages/EditProfilePage";
import ProductDetailPage   from "./pages/ProductDetailPage";
import WishlistPage        from "./pages/WishlistPage";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public-only routes (redirect logged-in users to /home) ── */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><SignUpPage /></PublicRoute>} />

        {/* ── Semi-public auth flow ─────────────────────────────────── */}
        <Route path="/verify-otp"       element={<VerifyOtpPage />} />
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/verify-otp-forgot" element={<VerifyOtpForgotPage />} />
        <Route path="/reset-password"   element={<ResetPasswordPage />} />

        {/* ── Protected routes ──────────────────────────────────────── */}
        <Route path="/home"        element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/chat"        element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/offer"       element={<PrivateRoute><OfferPage /></PrivateRoute>} />
        <Route path="/profile"     element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
        <Route path="/dashboard"   element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/wishlist"    element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
        <Route path="/upload"      element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />

        {/* ── Fallback ──────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}