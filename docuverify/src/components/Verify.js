import React, { useState } from 'react';
import { Button, Form, Alert, Row, Col, Card } from 'react-bootstrap';

function Verify() {
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [documentInfo, setDocumentInfo] = useState({});

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;

            // Check for special characters and multiple dots in the filename
            if (/[^a-zA-Z0-9.-]/.test(fileName.split('.').shift()) || (fileName.match(/\./g) || []).length > 1) {
                setError('File name should not have special characters.');
                e.target.value = '';
                return;
            }

            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension !== 'pdf') {
                setError('Invalid file type. Please upload a PDF.');
                e.target.value = '';
                return;
            }

            setError('');
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <Row className="justify-content-center align-items-center pt-5">
                <Col md={6}>
                    <h2 className="text-center mb-4">Verify Document</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group controlId="formFileVerify" className="mb-3">
                            <Form.Label>Upload your document for verification</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="d-block mx-auto">
                            Verify
                        </Button>
                    </Form>
                    {result !== null && (
                        <Card className="mt-4">
                            <Card.Body>
                                {result ? (
                                    <>
                                        <Card.Title>Document is valid</Card.Title>
                                        <Card.Text>
                                            <strong>Uploaded by:</strong> {documentInfo.uploader}<br />
                                            <strong>Date of Upload:</strong> {documentInfo.uploadDate}<br />
                                            <strong>Description:</strong> {documentInfo.description}
                                        </Card.Text>
                                    </>
                                ) : (
                                    <Card.Title>Document is not valid</Card.Title>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default Verify;
