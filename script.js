/**
 * RENTOPIA CORE SCRIPT - Vite Optimized
 * Menghubungkan UI dengan Backend PostgreSQL/Node.js
 */

const API_URL = "http://localhost:3000"; 

const notifContainer = document.getElementById('notifContainer');
const logDataBody = document.getElementById('logData');

/**
 * MODULE 1: NOTIFICATION ENGINE
 */
function createNotification(type, message) {
    if (!notifContainer) return;
    const notification = document.createElement('div');
    notification.classList.add('notification', type.toLowerCase());
    const barColor = type === 'Success' ? '#4caf50' : (type === 'Error' ? '#f44336' : '#ffeb3b');
    
    notification.innerHTML = `
        <img src="https://img.icons8.com/color/48/info.png" alt="icon">
        <p>${message}</p>
        <span style='background-color: ${barColor};'></span>
    `;

    notifContainer.appendChild(notification);
    triggerAnimation(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function triggerAnimation(element) {
    setTimeout(() => {
        element.classList.add('move');
        const span = element.querySelector('span');
        if(span) span.classList.add('move');
    }, 10);
}

/**
 * MODULE 2: API LOGIC
 */
async function saveLog(action, detail) {
    try {
        await axios.post(`${API_URL}/logs`, {
            time: new Date().toLocaleTimeString(),
            action: action,
            detail: detail
        });
        loadLogs(); 
    } catch (error) {
        console.error("Gagal simpan ke server:", error);
        createNotification('Error', 'Gagal menyimpan riwayat ke server');
    }
}

async function loadLogs() {
    if (!logDataBody) return;
    try {
        const res = await axios.get(`${API_URL}/logs`);
        const logs = res.data;
        logDataBody.innerHTML = logs.map(log => `
            <tr>
                <td>${log.time}</td>
                <td>${log.action}</td>
                <td>${log.detail}</td>
            </tr>
        `).join('');
    } catch (error) {
        logDataBody.innerHTML = "<tr><td colspan='3'>Gagal memuat data dari server.</td></tr>";
    }
}

/**
 * MODULE 3: FEATURE HANDLERS
 */
async function handleAdminAction(status) {
    const namaInput = document.getElementById('namaPenyewa');
    const nama = namaInput && namaInput.value ? namaInput.value : "Penyewa";
    
    if(status === 'Success') {
        createNotification('Success', `Data Jaminan ${nama} Disimpan`);
        await saveLog('Admin Input', `Jaminan untuk ${nama} berhasil diunggah.`);
    } else {
        createNotification('Error', 'Gagal Menghubungkan ke Server');
    }
}

async function handleUserAction(status) {
    if(status === 'Success') {
        const ulasanInput = document.getElementById('ulasanText');
        const ulasan = ulasanInput && ulasanInput.value ? ulasanInput.value : "Bintang 4";
        createNotification('Success', 'Rating & Ulasan Terkirim!');
        await saveLog('User Review', `Memberikan ulasan: ${ulasan}`);
    } else {
        createNotification('Invalid', 'Aksi dibatalkan.');
    }
}

async function clearLogs() {
    if(confirm("Hapus semua riwayat di server?")) {
        try {
            await axios.delete(`${API_URL}/logs`);
            loadLogs();
        } catch (e) {
            alert("Fitur hapus gagal diakses.");
        }
    }
}

// Menjalankan fungsi load data saat halaman siap
document.addEventListener('DOMContentLoaded', loadLogs);

// EXPOSE KE WINDOW (Wajib di Vite agar onclick HTML berfungsi)
window.handleAdminAction = handleAdminAction;
window.handleUserAction = handleUserAction;
window.clearLogs = clearLogs;