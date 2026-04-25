import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="content-wrapper">
          <Home />
        </main>
        <footer className="main-footer">
          <p>&copy; 2026 RENTOPIA - Project Web Apps.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;