import { useCookieConsent } from "../hooks/useCookieConsent";
import { TRUST_STATS, HOW_IT_WORKS_STEPS, ADVANTAGES } from "../constants/landingData";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Trust from "../components/Trust";
import Steps from "../components/Steps";
import Products from "../components/Products";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Cookies from "../components/Cookies";

export default function LandingPage() {
  const { showCookie, acceptCookie, closeCookie } = useCookieConsent();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-200">
      <Navbar />
      <Hero />
      <Trust stats={TRUST_STATS} />
      <Steps steps={HOW_IT_WORKS_STEPS} />
      <Products />
      <Features advantages={ADVANTAGES} />
      <CTA />
      <Footer />
      {showCookie && (
        <Cookies onAccept={acceptCookie} onClose={closeCookie} />
      )}
    </div>
  );
}