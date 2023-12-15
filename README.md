# DocuVerify

## Introduction
DocuVerify is a cutting-edge document verification and storage platform that skillfully combines the power of Ethereum blockchain with AWS services and a React JS frontend. This solution provides a secure, efficient, and user-friendly way to manage and verify documents.

## Architecture and Technologies
DocuVerify integrates several technologies, each playing a vital role in the overall functionality of the application.

### Ethereum Blockchain & Solidity Smart Contract
- **Purpose**: Used for secure and tamper-proof document hash storage.
- **Technology**: Ethereum smart contracts, written in Solidity.
- **Role**: Ensures the integrity and authenticity of documents through blockchain technology.

### AWS Services
- **Amplify**: Facilitates deployment and hosting of the React application, providing a scalable environment with authentication and backend integration.
- **Lambda**: Offers serverless computing, executing code in response to events like HTTP requests from API Gateway, making the backend efficient and cost-effective.
- **KMS (Key Management Service)**: Ensures secure storage in S3 by encrypting documents at rest using specified keys.
- **Cognito**: Manages user authentication and authorization, offering a secure sign-in experience.
- **API Gateway**: Acts as the entry point for the frontend to interact with Lambda functions, routing different API requests.
- **DynamoDB**: A NoSQL database service used to store metadata about documents, such as upload timestamps and user details.
- **S3 (Simple Storage Service)**: Provides secure, scalable object storage for documents, with pre-signed URLs for secure, temporary access to download documents.

### React JS
- **Purpose**: Creates a responsive and interactive user interface.
- **Role**: Facilitates the user's interaction with the application, including document upload, history viewing, and MetaMask connectivity.

### Ethers.js
- **Purpose**: Integrates Ethereum blockchain interactions within the web application.
- **Role**: Manages wallet interactions and blockchain transactions, bridging the gap between the Solidity smart contracts and the React frontend.

## Features
- **Blockchain-Based Verification**: Utilizes Ethereum smart contracts for immutable document verification.
- **Secure Document Storage**: Employs AWS S3, with KMS encryption, for document storage.
- **User Authentication**: Integrates AWS Cognito for secure user authentication.
- **Serverless Backend**: Uses AWS Lambda functions for efficient backend processing.
- **Document History and Management**: Allows users to view, filter, and download their document history.
- **MetaMask Integration**: Connects users' Ethereum wallets for blockchain interactions.

## Usage
1. **Connect MetaMask Wallet**: Connect your Ethereum wallet to the dApp using MetaMask.
2. **Upload Documents**: Securely upload documents to AWS S3.
3. **Verify Documents**: Utilize Ethereum smart contracts for document verification.
4. **Sign-In**: Use AWS Cognito for user authentication.
5. **Manage Documents**: View and manage your document history.

## Running the Application
To run DocuVerify locally:

```bash
npm install
npm start
```

## Status
DocuVerify is under active development, with ongoing enhancements in blockchain integration, user authentication, and secure document management.

## Note
Metamask must be installed in the browser.
