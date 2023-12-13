const AWS = require('aws-sdk');
const axios = require('axios');
require('dotenv').config()

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event) => {
  const record = event.Records[0]; // Get first S3 object creation event
  const { name } = record.s3.bucket; // Extract bucket and key
  const { key } = record.s3.object; // Extract bucket and key

  try {

    // Build data object
    const dataToUpload = {
      bucketName: name,
      fileName: key
    };

    console.log("dataToUpload:");
    console.log(dataToUpload);
    // Upload the data to your chosen API endpoint
    await axios.post(process.env.API_URL, dataToUpload);
    console.log(`Sent object details and hash to API: ${JSON.stringify(dataToUpload)}`);
  } 
  
  catch (error) {
    console.error(`Error uploading data to API: ${error.errors}`);
  }
};
