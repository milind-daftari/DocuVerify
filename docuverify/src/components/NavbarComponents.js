import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { authenticateWithCognito } from '../utility/cognitoAuth';

function NavbarComponent({ isConnected, onConnect, onDisconnect }) {
    
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                await authenticateWithCognito(selectedAccount);
                onConnect(selectedAccount);
            } catch (error) {
                console.error("Failed to connect wallet", error);
            }
        } else {
            console.log("Ethereum provider is not available");
        }
    };

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                onDisconnect();
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [onDisconnect]);

    return (
        <Navbar style={{ backgroundColor: '#ADD8E6' }} fixed="top">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/">DocuVerify</Navbar.Brand>
                    {isConnected && (
                        <Nav className="mr-auto">
                            <Nav.Item as="li">
                                <NavLink to="/upload" className="nav-link">Upload</NavLink>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <NavLink to="/verify" className="nav-link">Verify</NavLink>
                            </Nav.Item>
                        </Nav>
                    )}
                </div>
                <Nav className="ml-auto">
                    {isConnected ? (
                        <Button variant="outline-primary" disabled>Connected to MetaMask</Button>
                    ) : (
                        <Button variant="primary" onClick={connectWallet}>Connect to MetaMask</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;