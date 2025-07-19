// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import './index.css'; 
import SignUp from './pages/SignUp/SignUp';
import CodeVerification from './pages/CodeVerification';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import RoleRequests from './pages/RoleRequests';

import Layout from './components/Layout';


const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-code" element={<CodeVerification />} />
          <Route path="/inicio" element={<Home />} />

          {/* For now, just direct routes if ProtectedRoute isn't fully set up yet */}
          <Route path="/roles" element={<Roles />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/role-requests" element={<RoleRequests />} />


          {/* Ruta por defecto */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;







        {/* Rutas Protegidas (Example - you'll likely want to use ProtectedRoute here) */}
          {/* Example with ProtectedRoute:
          <Route element={<ProtectedRoute />}>
            <Route path="/roles" element={<Roles />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/role-requests" element={<RoleRequests />} />
          </Route>
          */}