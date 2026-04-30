const RENTOPIA_DB_NAME = 'rentopia_catalog_db';
const RENTOPIA_STORE_NAME = 'items_store';

class RentopiaAdvancedFeatures {
  constructor() {
    this.dbVersion = 1;
    this.db = null;
    this.initIndexedDB();
    this.setupToastContainer();
  }

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(RENTOPIA_DB_NAME, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(RENTOPIA_STORE_NAME)) {
          db.createObjectStore(RENTOPIA_STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async saveCatalogToIndexedDB(items) {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RENTOPIA_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(RENTOPIA_STORE_NAME);
      
      store.clear();

      items.forEach(item => {
        store.put(item);
      });

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = (err) => reject(err);
    });
  }

  async getCatalogFromIndexedDB() {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RENTOPIA_STORE_NAME], 'readonly');
      const store = transaction.objectStore(RENTOPIA_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => reject(err);
    });
  }

  exportToJSON(data, filename = 'rentopia-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    this._downloadFile(jsonStr, 'application/json', filename);
  }

  exportToCSV(data, filename = 'rentopia-data.csv') {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    this._downloadFile(csvRows.join('\n'), 'text/csv', filename);
  }

  async parseJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(JSON.parse(e.target.result));
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  _downloadFile(content, contentType, filename) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax; Secure";
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  pushHistoryState(stateObj, title, url) {
    window.history.pushState(stateObj, title, url);
  }

  triggerDataChanged(eventType = 'rentopia:data_update', detailData = {}) {
    const event = new CustomEvent(eventType, { detail: detailData });
    window.dispatchEvent(event);
  }

  listenToEvent(eventType, callback) {
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
  }

  setupToastContainer() {
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

      this.listenToEvent('rentopia:toast', (e) => {
        this.renderToastKasar(e.detail.message, e.detail.type);
      });
    }
  }

  renderToastKasar(message, type = 'info') {
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
}

const advancedFeatures = new RentopiaAdvancedFeatures();
export default advancedFeatures;
