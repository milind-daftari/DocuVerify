import React, { useState } from 'react';
import { Button, Form, Alert, OverlayTrigger, Tooltip, Card, Row, Col } from 'react-bootstrap';
import { Storage, API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

function Verify({ user }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [metaMaskAddressToValidate, setMetaMaskAddressToValidate] = useState('');

    const isMetaMaskAddressValid = (address) => {
        const regex = /^0x[a-fA-F0-9]{40}$/;
        return regex.test(address);
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

            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension !== 'pdf') {
                setError('Invalid file type. Please upload a PDF.');
                e.target.value = '';
                return;
            }

            if (file.size > 5242880) {
                setError('File size should not exceed 5MB.');
                e.target.value = '';
                return;
            }

            setError('');
            setSuccess('');
            setSelectedFile(file);
        }
    };

    const handleMetaMaskAddressChange = (e) => {
        setMetaMaskAddressToValidate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setSuccess('');
            setError('Please upload a file for verification.');
            return;
        }
        if (!isMetaMaskAddressValid(metaMaskAddressToValidate)) {
            setSuccess('');
            setError('Invalid MetaMask address. Please check and try again.');
            return;
        }

        const uniqueFileName = `tmp/${uuidv4()}_${selectedFile.name}`;
        try {
            await Storage.put(uniqueFileName, selectedFile, {
                contentType: selectedFile.type,
                metadata: {
                    originalFileName: selectedFile.name,
                    uploadTimestamp: new Date().toISOString(),
                    username: user.username,
                    userAddress: user.metaMaskAddress,
                    toValidateFor: metaMaskAddressToValidate
                }
            });

            const metadata = {
                documentId: uniqueFileName,
                originalFileName: selectedFile.name,
                uploadTimestamp: new Date().toISOString(),
                username: user.username,
                userAddress: user.metaMaskAddress,
                toValidateFor: metaMaskAddressToValidate,
                source: 'Verify',
                isVerified: false
            };
            await API.post('documentAPI', '/upload-metadata', {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: metadata
            });

            setSuccess('File uploaded for verification.');
            setSelectedFile(null);
            setMetaMaskAddressToValidate('');
            setError('');
        } catch (err) {
            console.error('Error uploading the file for verification: ', err);
            setError('Error uploading the file for verification.');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Verify Document</Card.Title>
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formFileVerify" className="mb-3">
                                    <Form.Label>Upload your document for verification</Form.Label>
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                File size limit is 5MB. File name should contain alphanumeric characters, hyphens, and underscores only. Only PDF files are allowed.
                                            </Tooltip>
                                        }>
                                        <Form.Control type="file" onChange={handleFileChange} />
                                    </OverlayTrigger>
                                </Form.Group>
                                <Form.Group controlId="metaMaskAddress" className="mb-3">
                                    <Form.Label>MetaMask Address to Validate Against</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter MetaMask address"
                                        value={metaMaskAddressToValidate}
                                        onChange={handleMetaMaskAddressChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit for Verification
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
