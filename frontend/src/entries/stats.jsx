import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatsPage from '../pages/StatsPage';
import '../index.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <StatsPage />
  </React.StrictMode>
);
