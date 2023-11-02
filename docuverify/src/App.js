import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponents';
import Home from './components/Home';
import Upload from './components/Upload';
import Verify from './components/Verify';
import { Auth } from 'aws-amplify';

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
        Auth.signOut()
            .then(() => setAccount(null))
            .catch(err => console.error('Error signing out of Cognito:', err));
    };

    const isConnected = Boolean(account);

    return (
        <Router>
            <div className="container">
                <NavbarComponent isConnected={isConnected} onConnect={handleConnect} onDisconnect={handleDisconnect} />
                <Routes>
                    <Route path="/" element={<Home account={account} />} exact/>
                    <Route path="/upload" element={isConnected ? <Upload /> : <p>Please connect with your wallet.</p>} />
                    <Route path="/verify" element={isConnected ? <Verify /> : <p>Please connect with your wallet.</p>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
