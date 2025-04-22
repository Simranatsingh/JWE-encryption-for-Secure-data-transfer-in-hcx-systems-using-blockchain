// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MedicalRecords
 * @dev Store and manage medical records on the blockchain
 */
contract MedicalRecords {
    address public owner;
    
    struct Record {
        string ipfsHash;      // IPFS hash of the record
        uint256 timestamp;    // When the record was added
        bool isShared;        // Whether the record is shared with others
    }
    
    // Mapping from user address to their records
    mapping(address => Record[]) private records;
    
    // Mapping to track authorized viewers for each user
    mapping(address => mapping(address => bool)) private authorizedViewers;
    
    // Events
    event RecordAdded(address indexed user, string ipfsHash, uint256 timestamp);
    event RecordShared(address indexed owner, address indexed viewer);
    event RecordAccessRevoked(address indexed owner, address indexed viewer);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Add a new medical record
     * @param ipfsHash IPFS hash of the record
     */
    function addRecord(string memory ipfsHash) public {
        records[msg.sender].push(Record(ipfsHash, block.timestamp, false));
        emit RecordAdded(msg.sender, ipfsHash, block.timestamp);
    }
    
    /**
     * @dev Get the number of records for the caller
     * @return Number of records
     */
    function getRecordCount() public view returns (uint256) {
        return records[msg.sender].length;
    }
    
    /**
     * @dev Get a specific record
     * @param index Index of the record to retrieve
     * @return Record data (ipfsHash, timestamp, isShared)
     */
    function getRecord(uint256 index) public view returns (string memory, uint256, bool) {
        require(index < records[msg.sender].length, "Index out of bounds");
        Record memory record = records[msg.sender][index];
        return (record.ipfsHash, record.timestamp, record.isShared);
    }
    
    /**
     * @dev Authorize another address to view your records
     * @param viewer Address to authorize
     */
    function authorizeViewer(address viewer) public {
        require(viewer != address(0), "Invalid address");
        require(viewer != msg.sender, "Cannot authorize yourself");
        
        authorizedViewers[msg.sender][viewer] = true;
        emit RecordShared(msg.sender, viewer);
    }
    
    /**
     * @dev Revoke authorization for an address
     * @param viewer Address to revoke
     */
    function revokeAuthorization(address viewer) public {
        authorizedViewers[msg.sender][viewer] = false;
        emit RecordAccessRevoked(msg.sender, viewer);
    }
    
    /**
     * @dev Check if the caller is authorized to view records
     * @param recordOwner Owner of the records
     * @return Boolean indicating if caller is authorized
     */
    function isAuthorized(address recordOwner) public view returns (bool) {
        return authorizedViewers[recordOwner][msg.sender];
    }
    
    /**
     * @dev View records of another user (if authorized)
     * @param recordOwner Owner of the records
     * @param index Index of the record
     * @return Record data
     */
    function viewSharedRecord(address recordOwner, uint256 index) public view 
        returns (string memory, uint256, bool) 
    {
        require(authorizedViewers[recordOwner][msg.sender], "Not authorized");
        require(index < records[recordOwner].length, "Index out of bounds");
        
        Record memory record = records[recordOwner][index];
        return (record.ipfsHash, record.timestamp, record.isShared);
    }
} 