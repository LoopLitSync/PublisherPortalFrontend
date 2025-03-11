import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookSubmission from './pages/BookSubmission';
import PublisherDashboard from './pages/PublisherDashboard';
import PublisherProfile from './pages/PublisherProfile';
import Navbar from './components/Navbar';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/book-submission" element={<BookSubmission />} />
          <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
          <Route path="/publisher-profile" element={<PublisherProfile />} />
          <Route path="/book/:isbn" element={<BookDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
