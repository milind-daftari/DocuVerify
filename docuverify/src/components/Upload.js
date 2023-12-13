import React, { useState } from 'react';
import { Button, Form, Alert, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { Storage, API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

function Upload({ user }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documentDescription, setDocumentDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            if (!/^[a-zA-Z0-9.-_]+$/.test(fileName)) {
                setError('File name should only have alphanumeric characters, hyphens, underscores, and dots.');
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
            setSuccess('');
            setSelectedFile(file);
        }
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

        const uniqueFileName = `${uuidv4()}_${selectedFile.name}`;
        setUploading(true);
        try {
            await Storage.put(uniqueFileName, selectedFile, {
                contentType: selectedFile.type,
                metadata: {
                    description: documentDescription,
                    originalFileName: selectedFile.name,
                    uploadTimestamp: new Date().toISOString(),
                    username: user.username,
                    userAddress: user.metaMaskAddress,
                    fileSize: selectedFile.size.toString(),
                }
            });

            const metadata = {
                documentId: uniqueFileName,
                description: documentDescription,
                originalFileName: selectedFile.name,
                uploadTimestamp: new Date().toISOString(),
                username: user.username,
                userAddress: user.metaMaskAddress,
                fileSize: selectedFile.size.toString(),
                source: 'Upload',
                isVerified: '',
                toValidateFor: ''
            };
            await API.post('documentAPI', '/upload-metadata', {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: metadata
            });

            setSuccess('Upload successful!');
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
        <div className="container" style={{ marginTop: '4rem' }}>
            <Row className="justify-content-center align-items-center pt-5">
                <Col md={6}>
                    <h2 className="text-center mb-4">Upload Document</h2>
                    {success && <Alert variant="success">{success}</Alert>}
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
