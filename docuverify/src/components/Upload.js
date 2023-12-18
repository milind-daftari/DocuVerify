import React, { useState } from 'react';
import { Button, Form, Alert, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { Storage, API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { id as hash } from '@ethersproject/hash';
import { registerDocument as register } from '../utility/interact';

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
                setSuccess('');
                e.target.value = '';
                return;
            }

            if (file.size > 5242880) {
                setError('File size should not exceed 5MB.');
                setSuccess('');
                e.target.value = '';
                return;
            }

            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension !== 'pdf') {
                setError('Invalid file type. Please upload a PDF.');
                setSuccess('');
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

        setUploading(true);
        try {
            const fileContents = await readFile(selectedFile);
            const docHash = hash(fileContents); // Hash the document
            const registrationResult = await register(docHash);

            if (registrationResult.status === 'Success') { 
                const fileName = `${uuidv4()}_${selectedFile.name}`;
                await Storage.put(fileName, selectedFile, {
                    contentType: selectedFile.type,
                    metadata: {
                        description: documentDescription,
                        originalFileName: selectedFile.name,
                        uploadTimestamp: new Date().toISOString(),
                        username: user.username,
                        userAddress: user.metaMaskAddress,
                        fileSize: selectedFile.size.toString(),
                    },
                    // Server-side encryption with AWS KMS
                    serverSideEncryption: "aws:kms",
                    SSEKMSKeyId: "f9c61645-afb9-4ce7-97c7-d5dc95ba18ce"
                });

                const metadata = {
                    documentId: fileName,
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
                    headers: { 'Content-Type': 'application/json' },
                    body: metadata
                });

                setSuccess('Document Registered');
                setError('');
            } else {
                setError("Document already registered");
                setSuccess('');
            }
        } catch (err) {
            console.error('Error during file upload: ', err);
            setError('Upload Failed. ' + (err.message || ''));
            setSuccess('');
        } finally {
            setUploading(false);
            setSelectedFile(null);
            setDocumentDescription('');
        }
    };

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const bytes = new Uint8Array(arrayBuffer);
                const hexString = bytes.reduce((result, byte) => result + byte.toString(16).padStart(2, '0'), '');
                resolve(hexString);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
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
                            <Form.Label>Document</Form.Label>
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
                                placeholder="Enter document description" 
                                value={documentDescription}
                                onChange={handleDescriptionChange}
                                maxLength={128} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default Upload;
