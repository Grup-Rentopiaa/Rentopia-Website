import React, { useState } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import JaminanForm from '../components/JaminanForm';
import ReviewForm from '../components/ReviewForm';
import ActivityLog from '../components/ActivityLog';

const Home = () => {
  const [logs, setLogs] = useState([]); // Data riwayat dari DB nanti di sini

  return (
    <>
      <Hero />
      <Card title="Admin: Pengelolaan Jaminan">
        <JaminanForm />
      </Card>

      <Card title="User: Berikan Ulasan">
        <ReviewForm />
      </Card>

      <Card title="Log Aktivitas (Real-time dari Server)">
        <ActivityLog logs={logs} />
      </Card>
    </>
  );
};

export default Home;