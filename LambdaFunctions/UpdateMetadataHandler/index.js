const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { documentId, newStatus } = JSON.parse(event.body);

    const params = {
        TableName: 'DocumentData',
        Key: { documentId },
        UpdateExpression: 'set verificationStatus = :newStatus',
        ExpressionAttributeValues: {
            ':newStatus': newStatus
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await dynamoDb.update(params).promise();
        return { statusCode: 200, body: JSON.stringify({ message: 'Status updated successfully' }) };
    } catch (error) {
        console.error('Error updating document status:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update document status' }) };
    }
};
