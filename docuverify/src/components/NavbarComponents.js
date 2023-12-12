import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Button, Image } from '@aws-amplify/ui-react';

function NavbarComponent({ isConnected, onConnect, onDisconnect, isCognitoAuthenticated, onSignOut }) {
    return (
        <Flex as="nav" justifyContent="space-between" padding="15px" backgroundColor="#ADD8E6" position="fixed" width="100%">
            <Flex gap="10px" alignItems="center">
                <Link to="/">
                    <Image src={`${process.env.PUBLIC_URL}/logo.png`} alt="DocuVerify Logo" width="50px" />
                </Link>
                {isCognitoAuthenticated && (
                    <>
                        <Button variation="link" as={Link} to="/">Home</Button>
                        {isConnected && (
                            <>
                                <Button variation="link" as={Link} to="/upload">Upload</Button>
                                <Button variation="link" as={Link} to="/verify">Verify</Button>
                                <Button variation="link" as={Link} to="/history">History</Button>
                            </>
                        )}
                    </>
                )}
            </Flex>
            <Flex>
                {isCognitoAuthenticated && (
                    <>
                        {isConnected ? (
                            <Button variation="primary" onClick={onDisconnect}>Disconnect MetaMask</Button>
                        ) : (
                            <Button variation="primary" onClick={onConnect}>Connect to MetaMask</Button>
                        )}
                        <Button variation="primary" onClick={onSignOut}>Logout</Button>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export default NavbarComponent;
