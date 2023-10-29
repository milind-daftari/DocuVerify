import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

function NavbarComponent({ isConnected, onConnect, onDisconnect }) {
    useEffect(() => {
        if (window.ethereum && !window.ethereum.selectedAddress && isConnected) {
            onDisconnect();  // Disconnect if user is not connected to their wallet
        }
    }, [isConnected, onDisconnect]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                onConnect(selectedAccount);
            } catch (error) {
                console.error("Failed to connect wallet", error);
            }
        } else {
            console.log("Ethereum provider is not available");
        }
    };

    const disconnectWallet = () => {
        if (window.ethereum) {
            onDisconnect();
        }
    };

    return (
        <Navbar style={{ backgroundColor: '#ADD8E6' }} fixed="top">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/">DocuVerify</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Item as="li">
                            <NavLink to="/upload" className="nav-link">Upload</NavLink>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <NavLink to="/verify" className="nav-link">Verify</NavLink>
                        </Nav.Item>
                    </Nav>
                </div>
                <Nav>
                    {isConnected ? (
                        <Button variant="outline-primary" onClick={disconnectWallet}>Disconnect</Button>
                    ) : (
                        <Button variant="primary" onClick={connectWallet}>Connect to MetaMask</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
