import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { API } from 'aws-amplify';

function History({ user }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    console.log(user.username)
    console.log("test")
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await API.get('Document', `/documents/${user.username}`);
                console.log('API Response:', response); // Debugging line

                // Check if the response is an array
                if (Array.isArray(response)) {
                    setDocuments(response);
                } else {
                    console.error('Response is not an array:', response);
                    setError('Invalid response format.');
                }
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError('Error fetching documents. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.username) {
            fetchDocuments();
        }
    }, [user.username]);

    return (
        <div className="container mt-5">
            <Card>
                <Card.Header as="h5">Your Document History</Card.Header>
                <ListGroup variant="flush">
                    {loading ? (
                        <ListGroup.Item>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </ListGroup.Item>
                    ) : error ? (
                        <ListGroup.Item className="text-danger">{error}</ListGroup.Item>
                    ) : documents.length === 0 ? (
                        <ListGroup.Item>No documents found.</ListGroup.Item>
                    ) : (
                        documents.map((doc, index) => (
                            <ListGroup.Item key={index}>
                                {doc.originalFileName} - Uploaded on {new Date(doc.uploadTimestamp).toLocaleString()}
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </Card>
        </div>
    );
}

export default History;
