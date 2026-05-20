import { useState, useEffect } from "react";

const COOKIE_KEY = "rentopia_cookie_consent";

const CATEGORIES = [
  {
    id: "necessary",
    label: "Necessary",
    count: 4,
    required: true,
    description:
      "Cookie yang diperlukan membantu agar website dapat digunakan dengan mengaktifkan fungsi dasar seperti navigasi halaman dan akses ke area yang aman. Website tidak dapat berfungsi dengan baik tanpa cookie ini.",
  },
  {
    id: "preferences",
    label: "Preferences",
    count: 3,
    required: false,
    description:
      "Cookie preferensi memungkinkan website mengingat informasi yang mengubah cara website berperilaku atau terlihat, seperti bahasa pilihan atau wilayah tempat kamu berada.",
  },
  {
    id: "statistics",
    label: "Statistics",
    count: 5,
    required: false,
    description:
      "Cookie statistik membantu pemilik website memahami bagaimana pengunjung berinteraksi dengan website dengan mengumpulkan dan melaporkan informasi secara anonim.",
  },
  {
    id: "marketing",
    label: "Marketing",
    count: 2,
    required: false,
    description:
      "Cookie marketing digunakan untuk melacak pengunjung di berbagai website dengan tujuan menampilkan iklan yang relevan dan menarik bagi pengguna.",
  },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: checked
          ? "linear-gradient(135deg, #9B87D9, #C9B8FF)"
          : "#D1D5DB",
        position: "relative",
        transition: "background 0.3s",
        flexShrink: 0,
        outline: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 25 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.3s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

export default function CookieConsent({ onAccept }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("consent");
  const [expanded, setExpanded] = useState({});
  const [selections, setSelections] = useState({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function save(consent) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ consent, date: new Date().toISOString() }));
    setVisible(false);
    onAccept?.(consent);
  }

  function handleAllowAll() {
    save({ necessary: true, preferences: true, statistics: true, marketing: true });
  }

  function handleDeny() {
    save({ necessary: true, preferences: false, statistics: false, marketing: false });
  }

  function handleAllowSelection() {
    save(selections);
  }

  function toggleExpand(id) {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  }

  if (!visible) return null;

  const tabs = ["consent", "details", "about"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(61,47,107,0.45)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        width: "100%",
        maxWidth: 640,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(61,47,107,0.25)",
        border: "1px solid #E8DCFF",
      }}>
        {/* Header brand */}
        <div style={{
          padding: "14px 24px 0",
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #E8DCFF, #FFD6EC)",
          }}>
            <span style={{ fontSize: 16 }}>🍪</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#3D2F6B", letterSpacing: 0.5 }}>
              Rentopia Cookie
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #E8DCFF",
          margin: "12px 24px 0",
        }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#9B87D9" : "#7B6AAA",
                borderBottom: tab === t ? "2.5px solid #9B87D9" : "2.5px solid transparent",
                marginBottom: -1,
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* TAB: Consent */}
          {tab === "consent" && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#3D2F6B", marginBottom: 10 }}>
                Website ini menggunakan cookies
              </p>
              <p style={{ fontSize: 13, color: "#7B6AAA", lineHeight: 1.7, margin: 0 }}>
                Kami menggunakan cookie untuk mempersonalisasi konten dan iklan, menyediakan fitur media sosial, dan menganalisis lalu lintas kami. Kami juga berbagi informasi tentang penggunaan situs kami dengan mitra media sosial, periklanan, dan analitik kami yang dapat menggabungkannya dengan informasi lain yang kamu berikan kepada mereka atau yang mereka kumpulkan dari penggunaan layanan mereka.
              </p>
              <div style={{
                marginTop: 16, padding: 14,
                background: "linear-gradient(135deg, #FAF8FF, #F5F0FF)",
                borderRadius: 12,
                border: "1px solid #E8DCFF",
              }}>
                <p style={{ fontSize: 12, color: "#A89CC4", margin: 0, lineHeight: 1.6 }}>
                  🔒 Consent ID kamu akan disimpan secara lokal. Kamu dapat mengubah preferensi kapan saja dengan mengklik ikon cookie di pojok website.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Details */}
          {tab === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <div key={cat.id} style={{
                  border: "1px solid #E8DCFF",
                  borderRadius: 14,
                  overflow: "hidden",
                }}>
                  <div
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "12px 16px", gap: 10,
                      cursor: "pointer",
                      background: expanded[cat.id] ? "#FAF8FF" : "#fff",
                      transition: "background 0.2s",
                    }}
                    onClick={() => toggleExpand(cat.id)}
                  >
                    <span style={{
                      fontSize: 16, color: "#A89CC4",
                      transform: expanded[cat.id] ? "rotate(90deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}>›</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#3D2F6B", flex: 1 }}>
                      {cat.label}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      background: "#E8DCFF", color: "#7B6AAA",
                      borderRadius: 20, padding: "2px 8px",
                    }}>
                      {cat.count}
                    </span>
                    <Toggle
                      checked={selections[cat.id]}
                      disabled={cat.required}
                      onChange={(val) =>
                        setSelections((p) => ({ ...p, [cat.id]: val }))
                      }
                    />
                  </div>
                  {expanded[cat.id] && (
                    <div style={{
                      padding: "0 16px 14px 42px",
                      fontSize: 12, color: "#7B6AAA", lineHeight: 1.7,
                      borderTop: "1px solid #F0EAFF",
                      background: "#FAF8FF",
                    }}>
                      {cat.required && (
                        <span style={{
                          display: "inline-block", marginBottom: 6,
                          fontSize: 10, fontWeight: 700, color: "#9B87D9",
                          background: "#E8DCFF", borderRadius: 6,
                          padding: "2px 7px",
                        }}>
                          Selalu aktif
                        </span>
                      )}
                      <p style={{ margin: cat.required ? "4px 0 0" : 0 }}>{cat.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB: About */}
          {tab === "about" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#3D2F6B", marginBottom: 6 }}>
                  Tentang Cookie
                </p>
                <p style={{ fontSize: 13, color: "#7B6AAA", lineHeight: 1.7, margin: 0 }}>
                  Cookie adalah file teks kecil yang dapat digunakan oleh website untuk membuat pengalaman pengguna menjadi lebih efisien. Hukum menyatakan bahwa kami dapat menyimpan cookie di perangkat kamu jika itu sangat diperlukan untuk pengoperasian situs ini.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#3D2F6B", marginBottom: 6 }}>
                  Dasar Hukum
                </p>
                <p style={{ fontSize: 13, color: "#7B6AAA", lineHeight: 1.7, margin: 0 }}>
                  Cookie yang dikategorikan sebagai Necessary diproses berdasarkan kepentingan yang sah (GDPR Pasal 6(1)(f)). Semua cookie lain diproses berdasarkan persetujuan kamu (GDPR Pasal 6(1)(a)).
                </p>
              </div>
              <div style={{
                padding: 14, borderRadius: 12,
                background: "linear-gradient(135deg, #FAF8FF, #FFF0F8)",
                border: "1px solid #E8DCFF",
              }}>
                <p style={{ fontSize: 12, color: "#A89CC4", margin: 0, lineHeight: 1.6 }}>
                  📧 Untuk informasi lebih lanjut tentang cara kami memproses data pribadi, silakan baca{" "}
                  <span style={{ color: "#9B87D9", fontWeight: 600 }}>Kebijakan Privasi</span> kami.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: "14px 24px 20px",
          borderTop: "1px solid #E8DCFF",
          display: "flex", gap: 10,
          background: "#FAFAFE",
        }}>
          <button
            onClick={handleDeny}
            style={{
              flex: 1, padding: "12px 0",
              border: "1.5px solid #C9B8FF",
              borderRadius: 12,
              background: "#fff",
              color: "#7B6AAA",
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#F5F0FF"}
            onMouseLeave={(e) => e.target.style.background = "#fff"}
          >
            Tolak
          </button>

          <button
            onClick={() => setTab("details")}
            style={{
              flex: 1, padding: "12px 0",
              border: "1.5px solid #C9B8FF",
              borderRadius: 12,
              background: "#fff",
              color: "#9B87D9",
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F5F0FF"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
          >
            {tab === "details" ? (
              <span onClick={(e) => { e.stopPropagation(); handleAllowSelection(); }}>
                Izinkan Pilihan
              </span>
            ) : (
              <>Kustomisasi <span style={{ fontSize: 16 }}>›</span></>
            )}
          </button>

          <button
            onClick={handleAllowAll}
            style={{
              flex: 1, padding: "12px 0",
              border: "none",
              borderRadius: 12,
              background: "linear-gradient(135deg, #9B87D9, #C9B8FF)",
              color: "#fff",
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(155,135,217,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            Izinkan Semua
          </button>
        </div>
      </div>
    </div>
  );
}
