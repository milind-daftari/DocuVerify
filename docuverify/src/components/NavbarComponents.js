import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

function NavbarComponent({ isConnected, onConnect, onDisconnect, isCognitoAuthenticated, onSignOut }) {

    return (
        <Navbar style={{ backgroundColor: '#ADD8E6' }} fixed="top">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/">DocuVerify</Navbar.Brand>
                {isCognitoAuthenticated && isConnected && (
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/upload/">Upload</Nav.Link>
                        <Nav.Link as={NavLink} to="/verify/">Verify</Nav.Link>
                    </Nav>
                )}
                <Nav>
                    {isCognitoAuthenticated ? (
                        <>
                            {isConnected ? (
                                <Button variant="outline-secondary" onClick={onDisconnect} className="me-2">
                                    Disconnect MetaMask
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={onConnect} className="me-2">
                                    Connect to MetaMask
                                </Button>
                            )}
                            <Button variant="outline-danger" onClick={onSignOut}>Logout</Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={onConnect}>Connect to MetaMask</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
