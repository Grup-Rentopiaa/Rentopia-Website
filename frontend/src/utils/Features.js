// IndexedDB Module
const RENTOPIA_DB_NAME = 'rentopia_catalog_db';
const RENTOPIA_STORE_NAME = 'items_store';
let dbInstance = null;

export async function initIndexedDB() {
  if (dbInstance) return dbInstance;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(RENTOPIA_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(RENTOPIA_STORE_NAME)) {
        db.createObjectStore(RENTOPIA_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function saveCatalogToIndexedDB(items) {
  const db = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RENTOPIA_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(RENTOPIA_STORE_NAME);
    store.clear();
    items.forEach(item => store.put(item));
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (err) => reject(err);
  });
}

export async function getCatalogFromIndexedDB() {
  const db = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RENTOPIA_STORE_NAME], 'readonly');
    const store = transaction.objectStore(RENTOPIA_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (err) => reject(err);
  });
}

// Data Export/Import Module
function _downloadFile(content, contentType, filename) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data, filename = 'rentopia-data.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  _downloadFile(jsonStr, 'application/json', filename);
}

export function exportToCSV(data, filename = 'rentopia-data.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  _downloadFile(csvRows.join('\n'), 'text/csv', filename);
}

export async function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(JSON.parse(e.target.result));
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// Cookie Module
export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax; Secure";
}

export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// History API Module
export function pushHistoryState(stateObj, title, url) {
  window.history.pushState(stateObj, title, url);
}

// Events Module
export function triggerDataChanged(eventType = 'rentopia:data_update', detailData = {}) {
  const event = new CustomEvent(eventType, { detail: detailData });
  window.dispatchEvent(event);
}

export function listenToEvent(eventType, callback) {
  window.addEventListener(eventType, callback);
  return () => window.removeEventListener(eventType, callback);
}

// Toast UI Module
export function setupToastContainer() {
  let container = document.getElementById('rentopia-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'rentopia-toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
    listenToEvent('rentopia:toast', (e) => {
      renderToastKasar(e.detail.message, e.detail.type);
    });
  }
}

export function renderToastKasar(message, type = 'info') {
  const container = document.getElementById('rentopia-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? '#ef4444' : (type === 'success' ? '#10b981' : '#3b82f6');
  toast.style.cssText = `
    background-color: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-family: inherit;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Auto-initialize required subsystems
if (typeof window !== 'undefined') {
  initIndexedDB();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToastContainer);
  } else {
    setupToastContainer();
  }
}
