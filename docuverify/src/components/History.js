import React, { useState, useEffect } from 'react';
import { Card, Dropdown, Table, Spinner, Alert } from 'react-bootstrap';
import { API } from 'aws-amplify';

function History({ user }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('uploaded'); // 'uploaded' or 'verified'

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await API.get('documentAPI', `/documents/${user.username}`);
                if (Array.isArray(response)) {
                    setDocuments(response);
                } else {
                    setError('Invalid response format.');
                }
            } catch (err) {
                setError('Error fetching documents. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.username) {
            fetchDocuments();
        }
    }, [user]);

    const filteredDocuments = documents.filter(doc => 
        selectedOption === 'uploaded' ? doc.source === 'Upload' : doc.source === 'Verify'
    );

    return (
        <div className="container mt-5">
            <Card>
                <Card.Header as="h5">Your Document History</Card.Header>
                <Card.Body>
                    <Dropdown onSelect={(eventKey) => setSelectedOption(eventKey)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedOption === 'uploaded' ? 'Uploaded by You' : 'Verified by You'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="uploaded">Uploaded by You</Dropdown.Item>
                            <Dropdown.Item eventKey="verified">Verified by You</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Upload Timestamp</th>
                                    <th>Description</th>
                                    {selectedOption === 'verified' && <>
                                        <th>MetaMask Address to Validate</th>
                                        <th>Is Verified</th>
                                    </>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.map((doc, index) => (
                                    <tr key={index}>
                                        <td>{doc.originalFileName}</td>
                                        <td>{new Date(doc.uploadTimestamp).toLocaleString()}</td>
                                        <td>{doc.description}</td>
                                        {selectedOption === 'verified' && <>
                                            <td>{doc.toValidateFor}</td>
                                            <td>{doc.isVerified ? 'Yes' : 'No'}</td>
                                        </>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default History;
