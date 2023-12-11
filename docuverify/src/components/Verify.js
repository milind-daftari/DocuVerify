import React, { useState } from 'react';
import { Button, Form, Alert, Card, Row, Col } from 'react-bootstrap';

function Verify() {
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;

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
            setSelectedFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your file verification logic here
    };

    return (
        <div className="container mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Verify Document</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formFileVerify" className="mb-3">
                                    <Form.Label>Upload your document for verification</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Verify
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Verify;
