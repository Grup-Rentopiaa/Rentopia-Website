// src/components/ActivityLog.jsx
const ActivityLog = ({ logs }) => {
  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Aksi</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.waktu}</td>
                  <td>{log.aksi}</td>
                  <td>{log.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Belum ada riwayat aktivitas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="btn-clear" onClick={() => console.log('Log Reset')}>
        Reset Riwayat
      </button>
    </>
  );
};

export default ActivityLog;