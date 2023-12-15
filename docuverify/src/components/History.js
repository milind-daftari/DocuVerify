import React, { useState, useEffect } from 'react';
import { Card, Dropdown, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { API } from 'aws-amplify';
import axios from 'axios';
import FileSaver from 'file-saver';

function History({ user }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('uploaded');

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await API.get('documentAPI', `/document/${user.username}`);
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

        fetchDocuments();
    }, [user.username, user]);

    const handleDownload = async (documentId, source) => {
        try {
            // Using AWS Amplify to make the GET request
            const presignedUrlResponse = await API.get('documentAPI', `/download?documentId=${documentId}&source=${source}`);
    
            // Assuming the response contains a URL in the format { url: "your_presigned_url_here" }
            const presignedUrl = presignedUrlResponse.url;
    
            const response = await axios.get(presignedUrl, { responseType: 'blob' });
            FileSaver.saveAs(response.data, documentId);
        } catch (error) {
            console.error('Error downloading the document:', error);
            setError('Error downloading the document. Please try again.');
        }
    };
    

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
                                    {selectedOption === 'uploaded' && <th>Description</th>}
                                    {selectedOption === 'verified' && <>
                                        <th>MetaMask Address to Validate</th>
                                        <th>Is Verified</th>
                                    </>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.filter(doc => 
                                    selectedOption === 'uploaded' ? doc.source === 'Upload' : doc.source === 'Verify'
                                ).map((doc, index) => (
                                    <tr key={index}>
                                        <td>{doc.originalFileName}</td>
                                        <td>{new Date(doc.uploadTimestamp).toLocaleString()}</td>
                                        {selectedOption === 'uploaded' && <td>{doc.description}</td>}
                                        {selectedOption === 'verified' && <>
                                            <td>{doc.toValidateFor}</td>
                                            <td>{doc.isVerified ? 'Yes' : 'No'}</td>
                                        </>}
                                        <td>
                                            <Button variant="primary" onClick={() => handleDownload(doc.documentId, doc.source)}>
                                                Download
                                            </Button>
                                        </td>
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
