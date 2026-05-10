import { useEffect, useState } from "react";
import { TRACKING_SERVER } from "../constants/landingData";

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
}

async function trackVisitor() {
  const consentStatus = localStorage.getItem("cookieConsent");
  if (consentStatus !== "accepted") return;

  const preferences = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
  let visitorId = localStorage.getItem("landingVisitorId") || getCookie("landingVisitorId");

  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  localStorage.setItem("landingVisitorId", visitorId);
  setCookie("landingVisitorId", visitorId, 7);

  const visitorData = {
    visitorId,
    page: "Landing Page Rentopia",
    path: window.location.pathname,
    browser: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    visitedAt: new Date().toISOString(),
    consent: preferences
  };

  localStorage.setItem("landingLastVisit", JSON.stringify(visitorData));
  sessionStorage.setItem("landingSessionVisit", JSON.stringify(visitorData));
  setCookie("landingLastVisit", JSON.stringify(visitorData), 7);

  try {
    await fetch(TRACKING_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorData),
    });
  } catch (error) {
    console.error("Gagal mengirim tracking:", error);
  }
}

export function useCookieConsent() {
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent") || getCookie("cookieConsent");

    if (consent !== "accepted") {
      setShowCookie(true);
      return;
    }

    trackVisitor();
  }, []);

  function acceptCookie(preferences) {
    // Default to all allowed if no preferences provided (Allow All button)
    const finalPrefs = preferences || { necessary: true, prefs: true, stats: true, marketing: true };
    
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(finalPrefs));
    setCookie("cookieConsent", "accepted", 7);
    setShowCookie(false);
    trackVisitor();
  }

  function closeCookie() {
    setShowCookie(false);
  }

  return { showCookie, acceptCookie, closeCookie };
}