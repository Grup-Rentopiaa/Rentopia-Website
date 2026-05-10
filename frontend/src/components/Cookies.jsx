import { useState } from "react";

export default function Cookies({ onAccept, onClose }) {
  const [activeTab, setActiveTab] = useState("consent");
  const [preferences, setPreferences] = useState({
    necessary: true,
    prefs: false,
    stats: false,
    marketing: false,
  });

  const tabs = [
    { id: "consent", label: "Consent" },
    { id: "details", label: "Details" },
    { id: "about", label: "About" },
  ];

  const togglePref = (key) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center p-4 sm:p-8 pointer-events-none font-sans">
      <div className="w-full max-w-5xl rounded-lg bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col overflow-hidden animate-[popup_0.4s_ease-out]">
        
        {/* Header Section */}
        <div className="px-8 pt-6 pb-0 border-b border-slate-100 flex items-center justify-between">
           <div className="flex gap-10">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`text-sm font-semibold pb-4 transition-all relative ${
                   activeTab === tab.id ? "text-[#00A3FF]" : "text-slate-500 hover:text-slate-800"
                 }`}
               >
                 {tab.label}
                 {activeTab === tab.id && (
                   <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00A3FF]" />
                 )}
               </button>
             ))}
           </div>
           <div className="text-right pb-4">
             <div className="flex flex-col items-end">
               <span className="text-base font-bold text-slate-800 leading-none">Cookiebot</span>
               <span className="text-[10px] text-slate-400 font-medium">by Usercentrics</span>
             </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="p-8 min-h-[220px]">
          {activeTab === "consent" && (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              <h3 className="text-base font-bold text-slate-900 mb-3">This website uses cookies</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed max-w-4xl">
                Kami menggunakan cookie untuk mempersonalisasi konten dan iklan, menyediakan fitur media sosial, dan menganalisis lalu lintas kami. Kami juga berbagi informasi tentang penggunaan Anda terhadap situs kami dengan mitra media sosial, iklan, dan analitik kami yang mungkin menggabungkannya dengan informasi lain yang telah Anda berikan kepada mereka atau yang telah mereka kumpulkan dari penggunaan Anda terhadap layanan mereka.
              </p>
            </div>
          )}
          
          {activeTab === "details" && (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 space-y-4">
              <h3 className="text-base font-bold text-slate-900 mb-1">Cookie Declaration</h3>
              <p className="text-[12px] text-slate-500 mb-4">Pilih kategori cookie yang Anda izinkan:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'necessary', label: 'Necessary', desc: 'Diperlukan agar situs web dapat berfungsi dengan benar.', required: true },
                  { id: 'prefs', label: 'Preferences', desc: 'Mengingat pilihan Anda seperti bahasa atau wilayah.' },
                  { id: 'stats', label: 'Statistics', desc: 'Membantu kami memahami cara pengunjung berinteraksi dengan situs.' },
                  { id: 'marketing', label: 'Marketing', desc: 'Digunakan untuk melacak pengunjung di seluruh situs web.' }
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => togglePref(item.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      preferences[item.id] ? 'border-[#00A3FF] bg-blue-50/30' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                    }`}
                  >
                    <div className={`mt-1 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                      preferences[item.id] ? 'bg-[#00A3FF] border-[#00A3FF]' : 'bg-white border-slate-300'
                    }`}>
                      {preferences[item.id] && <div className="h-2 w-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{item.label}</span>
                        {item.required && <span className="text-[10px] font-bold text-[#00A3FF] bg-blue-100 px-1.5 py-0.5 rounded uppercase">Required</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              <h3 className="text-base font-bold text-slate-900 mb-3">Tentang Cookie</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed max-w-4xl">
                Pelajari lebih lanjut tentang siapa kami, bagaimana Anda dapat menghubungi kami, dan bagaimana kami memproses data pribadi dalam Kebijakan Privasi kami. Harap sebutkan ID persetujuan dan tanggal saat Anda menghubungi kami mengenai persetujuan Anda.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 px-8 pb-8 pt-0">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-[#00A3FF] py-3 text-[13px] font-bold text-white transition hover:brightness-105 active:scale-[0.99]"
          >
            Deny
          </button>
          
          {activeTab === 'details' ? (
            <button
              onClick={() => onAccept(preferences)}
              className="flex-1 rounded-md bg-[#00A3FF] py-3 text-[13px] font-bold text-white transition hover:brightness-105 active:scale-[0.99]"
            >
              Save Selection
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('details')}
              className="flex-1 rounded-md bg-[#00A3FF] py-3 text-[13px] font-bold text-white transition hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              Customize <span className="text-base font-normal">›</span>
            </button>
          )}

          <button
            onClick={() => onAccept()}
            className="flex-1 rounded-md bg-[#00A3FF] py-3 text-[13px] font-bold text-white transition hover:brightness-105 active:scale-[0.99]"
          >
            Allow all
          </button>
        </div>

      </div>
    </div>
  );
}

