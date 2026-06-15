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

async function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "id" } }
          );
          const data = await res.json();
          resolve({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || null,
            country: data.address?.country || null,
          });
        } catch {
          resolve({ latitude, longitude, city: null, country: null });
        }
      },
      () => resolve(null)
    );
  });
}

async function trackVisitor() {
  const consentStatus = localStorage.getItem("cookieConsent");
  if (consentStatus !== "accepted") return;

  const preferences = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
  const location = preferences.location ? await getLocation() : null;

  let visitorId = localStorage.getItem("landingVisitorId") || getCookie("landingVisitorId");

  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  localStorage.setItem("landingVisitorId", visitorId);
  setCookie("landingVisitorId", visitorId, 180);

  const visitorData = {
    visitorId,
    page: "Landing Page Rentopia",
    path: window.location.pathname,
    browser: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    visitedAt: new Date().toISOString(),
    consent: preferences,
    location,
  };

  localStorage.setItem("landingLastVisit", JSON.stringify(visitorData));
  sessionStorage.setItem("landingSessionVisit", JSON.stringify(visitorData));
  setCookie("landingLastVisit", JSON.stringify(visitorData), 180);

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
    const consent = getCookie("cookieConsent") || localStorage.getItem("cookieConsent");

    if (consent !== "accepted") {
      setShowCookie(true);
      return;
    }

    trackVisitor();
  }, []);

  function acceptCookie(preferences) {
    const finalPrefs = preferences || { necessary: true, prefs: true, stats: true, marketing: true };

    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(finalPrefs));
    setCookie("cookieConsent", "accepted", 180);
    setShowCookie(false);
    trackVisitor();
  }

  function closeCookie() {
    setShowCookie(false);
  }

  return { showCookie, acceptCookie, closeCookie };
}