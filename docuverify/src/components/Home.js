import React, { useState, useEffect } from 'react';
import { Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { getBalance, getNetworkName } from '../utility/blockchain'; // Adjust the import path as necessary

function Home({ account }) {
    const [balance, setBalance] = useState(null);
    const [networkName, setNetworkName] = useState("");

    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (account) {
                try {
                    const accountBalance = await getBalance(account);
                    const netName = await getNetworkName();
                    setBalance(accountBalance);
                    setNetworkName(netName);
                } catch (error) {
                    console.error("Error fetching details:", error);
                }
            }
        };

        fetchAccountDetails();
    }, [account]);

    return (
        <Container className="my-5">
            <Card className="text-center shadow">
                <Card.Header as="h5" className="bg-primary text-white">Welcome to DocuVerify</Card.Header>
                <Card.Body>
                    {account ? (
                        <>
                            <Card.Title>Hi, {account}</Card.Title>
                            <ListGroup className="list-group-flush">
                                {balance !== null && (
                                    <ListGroupItem>Your balance: {balance}</ListGroupItem>
                                )}
                                {networkName && (
                                    <ListGroupItem>Network: {networkName}</ListGroupItem>
                                )}
                            </ListGroup>
                        </>
                    ) : (
                        <Card.Text>Please connect with your wallet.</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;
