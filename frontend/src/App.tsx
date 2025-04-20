import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Habitats from './pages/Habitats';
import Caretakers from './pages/Caretakers';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Toaster position="top-right" />
          <main className="flex-grow-1 app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/animals"
                element={
                  <ProtectedRoute>
                    <Animals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habitats"
                element={
                  <ProtectedRoute>
                    <Habitats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caretakers"
                element={
                  <ProtectedRoute>
                    <Caretakers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
