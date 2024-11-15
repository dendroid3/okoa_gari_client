// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import MechanicDashboard from './components/MechanicDashboard';
import SuperAdminDashboard from './components/SuperAdmin'; // Correct import here
import ErrorBoundary from './components/ErrorBoundary'; // Error Boundary
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import './index.css'; // Tailwind CSS

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Sign up page */}
            <Route path="/signup" element={<SignUpPage />} />

            {/* Login page */}
            <Route path="/login" element={<LoginPage />} /> {/* Fixed the prop to element */}

            {/* User Dashboard Route */}
            <Route path="/user-dashboard" element={<UserDashboard />} />

            {/* Admin Dashboard Route */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Mechanic Dashboard Route */}
            <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />

            {/* Super Admin Dashboard Route */}
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} /> {/* Super Admin Route */}

            {/* Optional: Catch-all for 404 errors */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
