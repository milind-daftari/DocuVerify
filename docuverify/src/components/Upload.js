import React, { useState } from 'react';
import { Button, Form, Alert, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';

function Upload() {
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;

            // Check for special characters and multiple dots in the filename first
            if (/[^a-zA-Z0-9.-]/.test(fileName.split('.').shift()) || (fileName.match(/\./g) || []).length > 1) {
                setError('File name should not have special characters.');
                e.target.value = '';
                return;
            }

            const fileExtension = fileName.split('.').pop().toLowerCase();
            const validExtensions = ['pdf'];

            if (!validExtensions.includes(fileExtension)) {
                setError('Invalid file type. Please upload a valid document format [pdf].');
                e.target.value = '';
                return;
            }

            // MIME Type Check (client-side, this can be spoofed)
            const validMimeTypes = ['application/pdf'];
            if (!validMimeTypes.includes(file.type)) {
                setError('Invalid MIME type. Please upload a valid PDF document.');
                e.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5 MB in bytes
                setError('File size exceeds the limit of 5 MB.');
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
                    <h2 className="text-center mb-4">Upload Document</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload your document</Form.Label>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        File size limit is 5MB. No special characters are allowed in the file name. Only PDF files are allowed.
                                    </Tooltip>
                                }>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </OverlayTrigger>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Document Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter a brief description of the document" />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit">
                                Upload
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default Upload;
