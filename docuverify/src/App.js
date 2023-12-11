import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/NavbarComponents';
import Home from './components/Home';
import Upload from './components/Upload';
import Verify from './components/Verify';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';

Amplify.configure(awsconfig);

function App() {
    const [isCognitoAuthenticated, setIsCognitoAuthenticated] = useState(false);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    } else {
                        setAccount(null);
                    }
                } catch (error) {
                    console.error("Failed to retrieve accounts:", error);
                }
            }
        };

        checkIfWalletIsConnected();

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                setAccount(null);
            } else {
                setAccount(accounts[0]);
            }
        };

        window.ethereum?.on('accountsChanged', handleAccountsChanged);

        // Clean up the event listener when the component unmounts
        return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    }, []);

    const handleConnect = async () => {
        if (window.ethereum) {
            try {
                const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(selectedAccount);
            } catch (error) {
                console.error("Failed to connect to wallet", error);
            }
        } else {
            console.log("Ethereum provider is not available");
        }
    };

    const handleDisconnect = () => {
        setAccount(null);
    };

    const handleSignOut = async () => {
        setIsCognitoAuthenticated(false);
        handleDisconnect();
    };

    return (
        <Authenticator signUpAttributes={['email', 'name', 'family_name', 'birthdate', 'gender']}>
            {({ signOut, user }) => {
                setIsCognitoAuthenticated(!!user);
                return (
                    <Router>
                        <NavbarComponent
                            isConnected={!!account}
                            onConnect={handleConnect}
                            onDisconnect={handleDisconnect}
                            isCognitoAuthenticated={isCognitoAuthenticated}
                            onSignOut={() => {
                                signOut();
                                handleSignOut();
                            }}
                        />
                        <div className="app-container">
                            <Routes>
                                <Route path="/" element={<Home account={account} />} exact />
                                <Route path="/upload" element={isCognitoAuthenticated && account ? <Upload user={{ metaMaskAddress: account, username: user?.username }} /> : <p>Please connect with your wallet.</p>} />
                                <Route path="/verify" element={isCognitoAuthenticated && account ? <Verify user={{ metaMaskAddress: account, username: user?.username }} /> : <p>Please connect with your wallet.</p>} />
                            </Routes>
                        </div>
                    </Router>
                );
            }}
        </Authenticator>
    );
}

export default App;