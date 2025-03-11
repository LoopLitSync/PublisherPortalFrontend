import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BookSubmission from './pages/BookSubmission';
import PublisherDashboard from './pages/PublisherDashboard';
import PublisherProfile from './pages/PublisherProfile';
import Navbar from './components/Navbar';
import {KeycloakProvider} from './KeycloakContext';
// import { ReactKeycloakProvider } from '@react-keycloak/web';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <KeycloakProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute> <BookSubmission/> </ProtectedRoute>} />
          <Route path="/book-submission" element={<ProtectedRoute> <BookSubmission/> </ProtectedRoute>} />
          <Route path="/publisher-dashboard" element={<ProtectedRoute> <PublisherDashboard/> </ProtectedRoute>} />
          <Route path="/publisher-profile" element={<ProtectedRoute> <PublisherProfile/> </ProtectedRoute>} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
};

export default App;
