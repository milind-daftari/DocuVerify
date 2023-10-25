import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function NavbarComponent() {
    return (
        <Navbar style={{ backgroundColor: '#ADD8E6' }} fixed="top">
            <Navbar.Brand as={Link} to="/">DocuVerify</Navbar.Brand>
            <Nav className="ml-auto d-flex align-items-center">
                <Nav.Link as={NavLink} to="/upload" activeClassName="active">Upload</Nav.Link>
                <Nav.Link as={NavLink} to="/verify" activeClassName="active">Verify</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavbarComponent;
