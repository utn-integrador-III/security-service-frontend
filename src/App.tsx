import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import Home from './pages/Home';
import AdminSignIn from './pages/AdminSignIn';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CodeVerification from './pages/CodeVerification';
import Roles from './pages/Roles';
import Screens from './pages/screensPost';
import Permissions from './pages/Permissions';
import RoleRequests from './pages/RoleRequests';
import UserRegistration from './pages/UserRegistration';
import UserManagement from './pages/UserManagement';

import Apps from './pages/Apps';
import './index.css';


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas Públicas - Con navegación */}
          <Route path="/admin-signin" element={
            <AuthRedirect>
              <div>
                <Navigation />
                <AdminSignIn />
              </div>
            </AuthRedirect>
          } />
          <Route path="/signup" element={
            <AuthRedirect>
              <div>
                <Navigation />
                <SignUp />
              </div>
            </AuthRedirect>
          } />
          <Route path="/verify-code" element={<CodeVerification />} />
          <Route path="/" element={
            <AuthRedirect>
              <div>
                <Navigation />
                <Home />
              </div>
            </AuthRedirect>
          } />

          {/* Rutas Protegidas - Con navegación */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <Dashboard />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminProtectedRoute>
                <div>
                  <Navigation />
                  <AdminDashboard />
                </div>
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/roles" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <Roles />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/screens" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <Screens />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-registration" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <UserRegistration />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <UserManagement />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/permissions" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <Permissions />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/role-requests" 
            element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <RoleRequests />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/apps" 
            element={
              <AdminProtectedRoute>
                <div>
                  <Navigation />
                  <Apps />
                </div>
              </AdminProtectedRoute>
            } 
          />


        </Routes>
      </div>
    </Router>
  );
};

export default App;