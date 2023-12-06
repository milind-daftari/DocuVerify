// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

contract docuverifySmartContract {
    // Structure to hold document details
    struct Document {
        string name;
        string details;
        address uploadedBy;
        uint256 timestamp;
    }

    // Mapping of document hash to Document
    mapping (string => Document) private documents;

    // Admin address is set to the address that deploys the contract
    address public admin;

    // Fee for uploading and verifying documents
    uint256 public constant uploadFee = 1e14;
    uint256 public constant verifyFee = 1e13;

    // Event to emit when a document is registered
    event DocumentRegistered(string indexed hash, address indexed uploadedBy, uint256 timestamp);

    // Constructor to set the admin
    constructor() {
        admin = msg.sender;
    }

    // Modifier to check if the caller is admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    // Function to register a document
    function registerDocument(string calldata hash, string calldata name, string calldata details) external payable {
        require(msg.value == uploadFee, "Incorrect upload fee");
        require(bytes(hash).length > 0, "Document hash cannot be empty");
        require(bytes(name).length > 0, "Document name cannot be empty");
        require(bytes(details).length > 0, "Document details cannot be empty");
        require(documents[hash].timestamp == 0, "Document already registered");

        documents[hash] = Document(name, details, msg.sender, block.timestamp);
        emit DocumentRegistered(hash, msg.sender, block.timestamp);
    }

    // Function to verify a document by its hash
    function verifyDocumentByHash(string calldata hash) external payable returns (string memory, string memory, address, uint256) {
        require(msg.value == verifyFee, "Incorrect verification fee");
        require(bytes(hash).length > 0, "Document hash cannot be empty");
        require(documents[hash].timestamp != 0, "Document not found");

        Document memory doc = documents[hash];
        return (doc.name, doc.details, doc.uploadedBy, doc.timestamp);
    }

    // Function to withdraw accumulated fees
    function withdrawFunds() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
