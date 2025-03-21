import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookSubmission from './pages/BookSubmission';
import PublisherDashboard from './pages/PublisherDashboard';
import PublisherProfile from './pages/PublisherProfile';
import Navbar from './components/Navbar';
import BookDetails from './pages/BookDetails';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

function App() {
    return (
        <AuthProvider> 
            <Router>
                <Navbar />
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<PublisherDashboard />} />
                        <Route path="/book-submission" element={<BookSubmission />} />
                        <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
                        <Route path="/publisher-profile" element={<PublisherProfile />} />
                        <Route path="/publisher-profile/:id" element={<PublisherProfile />} />
                        <Route path="/book/:id" element={<BookDetails />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
