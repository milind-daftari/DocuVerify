import React, { useState } from 'react';
import { Button, Form, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { Storage } from 'aws-amplify';

function Upload() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documentDescription, setDocumentDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDocumentDescription(e.target.value);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError('Please select a valid file.');
            setSuccess('');
            return;
        }
        setError('');
        setUploading(true);
        try {
            const result = await Storage.put(selectedFile.name, selectedFile, {
                contentType: selectedFile.type,
                metadata: { description: documentDescription }
            });
            console.log(result); // For debugging purposes
            setSuccess('Upload successful!');
            // Clear the form data
            setSelectedFile(null);
            setDocumentDescription('');
            setError('');
        } catch (err) {
            console.error('Error uploading the file: ', err);
            setError('Upload failed. Please try again.');
            setSuccess('');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFileUpload();
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <Card className="shadow-sm p-4">
                        <Card.Body>
                            <h5 className="text-center mb-4">Upload Document</h5>
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>Upload your document</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} disabled={uploading} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <Form.Label>Document Description (max 128 characters)</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        placeholder="Enter a brief description of the document" 
                                        value={documentDescription}
                                        onChange={handleDescriptionChange}
                                        maxLength={128}
                                        disabled={uploading}
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" size="lg" type="submit" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Upload;
