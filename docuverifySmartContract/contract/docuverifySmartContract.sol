// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

contract docuverifySmartContract {
    // Structure to hold document details
    struct Document {
        uint256 timestamp;
        bytes32 hash;
    }

    // Mapping of user address to an array of Documents
    mapping (address => Document[]) private userDocuments;

    // Mapping to keep track of registered addresses
    mapping (address => bool) private isRegistered;

    // Admin address is set to the address that deploys the contract
    address public admin;

    // Fee for uploading and verifying documents
    uint256 public constant uploadFee = 1e14;
    uint256 public constant verifyFee = 1e13;

    // Event to emit when a document is registered
    event DocumentRegistered(address indexed user, bytes32 indexed hash, uint256 timestamp);

    // Event to emit when a document is verified
    event DocumentVerified(uint256 timestamp, bytes32 hash);

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
    function registerDocument(bytes32 hash, uint256 timestamp) external payable{
        require(msg.value >= uploadFee, "Upload fee is not sufficient");

        // Check if the document already exists for the user
        for (uint i = 0; i < userDocuments[msg.sender].length; i++) {
            require(userDocuments[msg.sender][i].hash != hash, "Document already registered");
        }

        userDocuments[msg.sender].push(Document(timestamp, hash));
        emit DocumentRegistered(msg.sender, hash, timestamp);
    }

    // Function to verify a document by its hash
    function verifyDocument(bytes32 hash, address user) external view returns (bool, uint256, bytes32) {

        for (uint i = 0; i < userDocuments[user].length; i++) {
            if(userDocuments[user][i].hash == hash) {
                return (true, userDocuments[user][i].timestamp, hash);
            }
        }
        return (false, 0, 0);
    }

    // Function to withdraw accumulated fees
    function withdrawFunds() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }

    // Function to get the current balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}