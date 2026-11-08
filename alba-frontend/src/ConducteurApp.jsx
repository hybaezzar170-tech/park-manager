import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConducteurLogin from './components/ConducteurLogin';
import ConducteurDashboard from './components/ConducteurDashboard';

function ConducteurApp() {
  return (
    <Router>
      <Routes>
        <Route path="/conducteur/login" element={<ConducteurLogin />} />
        <Route path="/conducteur/dashboard" element={<ConducteurDashboard />} />
        <Route path="/conducteur" element={<Navigate to="/conducteur/login" replace />} />
        <Route path="/conducteur/*" element={<Navigate to="/conducteur/login" replace />} />
      </Routes>
    </Router>
  );
}

export default ConducteurApp;
