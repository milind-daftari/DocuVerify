const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const username = event.pathParameters.username;

        const params = {
            TableName: "DocumentData",
            IndexName: "username-index", // Reference the name of the GSI
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };

        const data = await dynamoDb.query(params).promise();

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
        },
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.error("Error fetching documents:", error);

        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
        },
            body: JSON.stringify({ error: "Could not fetch documents", details: error.message })
        };
    }
};
