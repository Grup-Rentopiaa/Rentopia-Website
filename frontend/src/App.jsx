import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute  from "./components/PublicRoute";
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import { UserProvider } from "./context/UserContext";

import LandingPage         from "./pages/LandingPage";
import LoginPage           from "./pages/LoginPage";
import SignUpPage          from "./pages/SignUpPage";
import VerifyOtpPage       from "./pages/VerifyOtpPage";
import ForgotPasswordPage  from "./pages/ForgotPasswordPage";
import VerifyOtpForgotPage from "./pages/VerifyOtpForgotPage";
import ResetPasswordPage   from "./pages/ResetPasswordPage";
import HomePage            from "./pages/HomePage";
import SearchPage          from "./pages/SearchPage";
import ChatPage            from "./pages/ChatPage";
import OfferPage           from "./pages/OfferPage";
import ProfilPage          from "./pages/ProfilPage";
import DashboardPage       from "./pages/DashboardPage";
import UploadPage          from "./pages/UploadPage";
import ProductDetailPage   from "./pages/ProductDetailPage";
import WishlistPage        from "./pages/WishlistPage";
import NotificationsPage   from "./pages/NotificationsPage";
import ProductsPage        from "./pages/ProductsPage";
import AdminGuaranteesPage from "./pages/AdminGuaranteesPage";
import FollowersPage       from "./pages/FollowersPage";
import FollowingPage       from "./pages/FollowingPage";
import AdminVisitorPage    from "./pages/AdminVisitorPage";
import NotFoundPage        from "./pages/NotFoundPage";
import ServerErrorPage     from "./pages/ServerErrorPage";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/admin/visitors" element={<PrivateRoute><AdminVisitorPage /></PrivateRoute>} />
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
                <CookieConsent />
              </PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><SignUpPage /></PublicRoute>} />

            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp-forgot" element={<VerifyOtpForgotPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/home"        element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/search"      element={<PrivateRoute><SearchPage /></PrivateRoute>} />
            <Route path="/products"    element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
            <Route path="/chat"        element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            <Route path="/offer"       element={<PrivateRoute><OfferPage /></PrivateRoute>} />
            <Route path="/profile"     element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
            <Route path="/profile/:userId/followers" element={<PrivateRoute><FollowersPage /></PrivateRoute>} />
            <Route path="/profile/:userId/following" element={<PrivateRoute><FollowingPage /></PrivateRoute>} />
            <Route path="/dashboard"   element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/wishlist"    element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="/upload"      element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/product/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
            <Route path="/admin/guarantees" element={<PrivateRoute><AdminGuaranteesPage /></PrivateRoute>} />

            <Route path="/error-500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </UserProvider>
    </BrowserRouter>
  );
}