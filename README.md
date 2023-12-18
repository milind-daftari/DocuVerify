# DocuVerify

## Introduction
DocuVerify is a document verification and storage platform that integrates the Ethereum blockchain with AWS services and a React JS frontend. This platform is designed to provide a secure, efficient, and user-friendly method for document management, storage and authentication.

## Architecture and Technologies
DocuVerify harnesses a variety of advanced technologies to deliver its comprehensive functionalities.

### Ethereum Blockchain & Solidity Smart Contract
- **Purpose**: To provide a decentralized and tamper-proof system for document verification.
- **Technology**: Ethereum blockchain and smart contracts, written in Solidity.
- **Role**: Ensures the integrity and authenticity of documents. The platform hashes documents and stores these hashes on the blockchain, creating an immutable record. A nominal fee of 0.0001 ETH is charged for each upload to the blockchain. This fee is designed to prevent spam and can only be withdrawn by the admin user.

### AWS Services
- **Amplify**: Deploys and hosts the React application, offering a scalable environment with robust backend integration.
- **Lambda**: Provides serverless computing for backend processes, efficiently responding to events and HTTP requests.
- **KMS (Key Management Service)**: Ensures secure encryption of documents in S3 storage.
- **Cognito**: Manages user authentication and authorization.
- **API Gateway**: Serves as the entry point for frontend interactions, routing API requests to appropriate Lambda functions.
- **DynamoDB**: A NoSQL database service, used for storing document metadata.
- **S3 (Simple Storage Service)**: Secure and scalable object storage for documents, equipped with pre-signed URLs for controlled access.

### React JS
- **Purpose**: Develops a responsive and interactive user interface.
- **Role**: Facilitates user interactions for document uploads, viewing document history, and MetaMask connectivity.

### Ethers.js
- **Purpose**: Integrates Ethereum blockchain interactions into the web application.
- **Role**: Manages wallet transactions and bridges the React frontend with the Solidity smart contracts.

## Features
- **Blockchain-Based Verification**: Uses Ethereum smart contracts to create a verifiable, immutable record of document hashes.
- **Secure Document Storage**: Utilizes AWS S3 with KMS encryption for storing documents.
- **User Authentication**: Integrates AWS Cognito for secure user login experiences.
- **Serverless Backend**: Employs AWS Lambda for efficient backend operations.
- **Document History and Management**: Allows users to upload, view, filter, and download the documents uploaded by them.
- **MetaMask Integration**: Enables connection to users' Ethereum wallets for blockchain-based operations.

## Usage
1. **Connect MetaMask Wallet**: Users must connect their Ethereum wallet using MetaMask. Multiple wallet addresses can we used with the same DocuVerify account.
2. **Upload Documents**: Securely upload documents to AWS S3. The uploaded document is encrypted in S3. The document is hashed and the hash is stored on the Ethereum blockchain. 
3. **Verify Documents**: Another user can verify the authenticity of a document by uploading it and providing the MetaMask address of the original uploader.
4. **Sign-In**: Utilize AWS Cognito for user authentication.
5. **Manage Documents**: View and filter the history of Uploads and Verified Documents and download the documents uploaded by the user.

## Running the Application Locally
To run DocuVerify in a local environment:

```bash
npm install
npm start
```
