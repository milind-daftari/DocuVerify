import React, { useState } from 'react';
import { Button, Form, Alert, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { Storage, Auth } from 'aws-amplify';

function Upload() {
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documentDescription, setDocumentDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError('Please select a valid file.');
            return;
        }
        
        const user = await Auth.currentAuthenticatedUser();
        const userFolder = user.username;

        try {
            setUploading(true);
            await Storage.put(`${userFolder}/${selectedFile.name}`, selectedFile, {
                contentType: selectedFile.type,
                metadata: { description: documentDescription }
            });
            alert('File uploaded successfully');
        } catch (err) {
            console.error('Error uploading the file: ', err);
            if (err && err.message) {
                setError(err.message);
            } else {
                setError('Error uploading the file');
            }
        } finally {
            setUploading(false);
        }   
    };

    const handleDescriptionChange = (e) => {
        setDocumentDescription(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;

            if (!/^[a-zA-Z0-9.-_]+$/.test(fileName)) {
                setError('File name should only have alphanumeric characters, hyphens, underscores, and dots.');
                e.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds the 5MB limit.');
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
        handleFileUpload(); 
    };

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <Row className="justify-content-center align-items-center pt-5">
                <Col md={6}>
                    <h2 className="text-center mb-4">Upload Document</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload your document</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        File size limit is 5MB. File name should contain alphanumeric characters, hyphens, and underscores only. Only PDF files are allowed.
                                    </Tooltip>
                                }>
                                <Form.Control type="file" onChange={handleFileChange} disabled={uploading} />
                            </OverlayTrigger>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Document Description (max 128 characters)</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter a brief description of the document" 
                                value={documentDescription}
                                onChange={handleDescriptionChange}
                                maxLength={128}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default Upload;
