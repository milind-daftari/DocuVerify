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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Sorting documents by uploadTimestamp in descending order (newest first)
    const sortedDocuments = documents.sort((a, b) => new Date(b.uploadTimestamp) - new Date(a.uploadTimestamp));

    // Filter and then slice documents for pagination
    const filteredDocuments = sortedDocuments.filter(doc => selectedOption === 'uploaded' ? doc.source === 'Upload' : doc.source === 'Verify');
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

    // Function to change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

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
    }, [user.username]);

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
                        <>
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>{selectedOption === 'uploaded' ? 'Upload Timestamp' : 'Verification Timestamp'}</th>
                                        <th>{selectedOption === 'uploaded' ? 'Uploaded By' : 'Verified By'}</th>
                                        {selectedOption === 'verified' && <th>Validated for Address</th>}
                                        {selectedOption === 'verified' && <th>Status</th>}
                                        {selectedOption === 'uploaded' && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.filter(doc => selectedOption === 'uploaded' ? doc.source === 'Upload' : doc.source === 'Verify').map((doc, index) => (
                                        <tr key={index}>
                                            <td>{doc.originalFileName}</td>
                                            <td>{new Date(selectedOption === 'uploaded' ? doc.uploadTimestamp : doc.uploadTimestamp).toLocaleString()}</td>
                                            <td>{doc.userAddress}</td>
                                            {selectedOption === 'verified' && <td>{doc.toValidateFor}</td>}
                                            {selectedOption === 'verified' && (
                                                <td>
                                                    {doc.isVerified === 'Verified' ? 'Document Verified' :
                                                    doc.isVerified === 'Verification Failed' ? 'Verification Failed' :
                                                    'Verification In Progress'}
                                                </td>
                                            )}
                                            {selectedOption === 'uploaded' && (
                                                <td>
                                                    <Button variant="primary" onClick={() => handleDownload(doc.documentId)}>
                                                        Download
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                            <button onClick={() => paginate(i + 1)} className="page-link">
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
    
    
}

export default History;
