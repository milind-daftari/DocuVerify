const AWS = require('aws-sdk');
AWS.config.update({ signatureVersion: 'v4' });
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        // Extracting queryStringParameters from the event object
        const queryParams = event.queryStringParameters;
        if (!queryParams) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Adjust as per your requirement
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({ error: 'Missing query parameters' })
            };
        }

        // Extracting documentId and source
        const { documentId, source } = queryParams;
        if (!documentId || !source) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({ error: 'Missing required parameters' })
            };
        }

        // Determine the S3 path based on source
        const filePath = source === 'Upload' ? `public/${documentId}` : `public/temp/${documentId}`;

        // Generate the pre-signed URL
        const url = s3.getSignedUrl('getObject', {
            Bucket: 'docuverify143516-dev',
            Key: filePath,
            Expires: 60 // URL expires in 60 seconds
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ url })
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ error: 'Error generating pre-signed URL', details: error.message })
        };
    }
};
