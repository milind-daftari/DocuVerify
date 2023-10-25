import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponents'; // Ensure the path is correct
import Home from './components/Home';
import Upload from './components/Upload';
import Verify from './components/Verify';

function App() {
    return (
        <Router>
            <div className="container">
                <NavbarComponent />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
