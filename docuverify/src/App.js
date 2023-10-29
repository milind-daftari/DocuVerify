import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponents';
import Home from './components/Home';
import Upload from './components/Upload';
import Verify from './components/Verify';

function App() {
    const initialAccount = localStorage.getItem('connectedAccount');
    const [account, setAccount] = useState(initialAccount);

    useEffect(() => {
        if (account) {
            localStorage.setItem('connectedAccount', account);
        } else {
            localStorage.removeItem('connectedAccount');
        }
    }, [account]);

    const handleConnect = (selectedAccount) => {
        setAccount(selectedAccount);
    };

    const handleDisconnect = () => {
        setAccount(null);
    };

    const isConnected = Boolean(account);

    return (
        <Router>
            <div className="container">
                <NavbarComponent isConnected={isConnected} onConnect={handleConnect} onDisconnect={handleDisconnect} />
                <Routes>
                    <Route path="/" element={<Home account={account} />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
