import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import UploadPage from '../pages/UploadPage';
import '../index.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <UploadPage />
  </React.StrictMode>
);
