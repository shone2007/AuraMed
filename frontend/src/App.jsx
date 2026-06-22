import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Bills from './pages/Bills';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // or to a Not Authorized page
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['Admin']}><Doctors /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={['Admin']}><Patients /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['Admin']}><Appointments /></ProtectedRoute>} />
            <Route path="/admin/bills" element={<ProtectedRoute allowedRoles={['Admin']}><Bills /></ProtectedRoute>} />
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
