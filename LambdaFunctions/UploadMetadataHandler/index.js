// index.js
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Check if headers exist in the request
        const headers = event.headers;
        if (!headers) {
            return {
                statusCode: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" // CORS header
                },
                body: JSON.stringify({ error: "No headers found in the request" })
            };
        }

        // Check if the Content-Type is set to application/json
        const contentType = headers["Content-Type"] || headers["content-type"];
        if (contentType !== "application/json") {
            return {
                statusCode: 400,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" // CORS header
                },
                body: JSON.stringify({ error: "Invalid content type. Only application/json is allowed." })
            };
        }

        // Attempt to parse the JSON body
        const requestBody = JSON.parse(event.body);

        // Construct the DynamoDB put request
        const params = {
            TableName: "DocumentData",
            Item: {
                documentId: requestBody.documentId,
                username: requestBody.username,
                description: requestBody.description,
                originalFileName: requestBody.originalFileName,
                description: requestBody.description,
                uploadTimestamp: requestBody.uploadTimestamp,
                userAddress: requestBody.userAddress,
                fileSize: requestBody.fileSize,
                isVerified: requestBody.isVerified,
                source: requestBody.source,
                toValidateFor: requestBody.toValidateFor
            }
        };

        // Write to the DynamoDB table
        await dynamoDb.put(params).promise();

        // Return success response
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // CORS header
            },
            body: JSON.stringify({ message: "Metadata successfully uploaded to DynamoDB" })
        };
    } catch (error) {
        console.error("Error writing metadata to DynamoDB:", error);

        // Return error response if an error occurs
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // CORS header
            },
            body: JSON.stringify({ error: "Could not write metadata to DynamoDB", details: error.message })
        };
    }
};
