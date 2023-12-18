const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const headers = event.headers;
        if (!headers) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "No headers found in the request" })
            };
        }

        const contentType = headers["Content-Type"] || headers["content-type"];
        if (contentType !== "application/json") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Invalid content type. Only application/json is allowed." })
            };
        }

        const requestBody = JSON.parse(event.body);

        // Add check to ensure unique documentId
        const existingItemCheckParams = {
            TableName: "DocumentData",
            Key: { documentId: requestBody.documentId }
        };
        const existingItem = await dynamoDb.get(existingItemCheckParams).promise();
        if (existingItem.Item) {
            return {
                statusCode: 409,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Document with the same ID already exists" })
            };
        }

        const params = {
            TableName: "DocumentData",
            Item: {
                documentId: requestBody.documentId,
                username: requestBody.username,
                description: requestBody.description,
                originalFileName: requestBody.originalFileName,
                uploadTimestamp: requestBody.uploadTimestamp,
                userAddress: requestBody.userAddress,
                fileSize: requestBody.fileSize,
                isVerified: requestBody.isVerified || '',
                source: requestBody.source || '',
                toValidateFor: requestBody.toValidateFor || ''
            }
        };

        await dynamoDb.put(params).promise();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Metadata successfully uploaded to DynamoDB" })
        };
    } catch (error) {
        console.error("Error writing metadata to DynamoDB:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Could not write metadata to DynamoDB", details: error.message })
        };
    }
};
