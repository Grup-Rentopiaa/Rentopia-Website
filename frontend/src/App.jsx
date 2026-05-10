import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import OfferPage from "./pages/OfferPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}