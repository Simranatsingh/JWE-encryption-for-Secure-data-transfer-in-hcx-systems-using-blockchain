// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReportStorage {
    struct Report {
        string reportHash;
        string reportType;
        address sender;
        address recipient;
        uint256 timestamp;
        string ipfsHash;
    }

    mapping(uint256 => Report) public reports;
    uint256 public reportCount;

    event ReportStored(
        uint256 indexed reportId,
        string reportHash,
        string reportType,
        address sender,
        address recipient,
        string ipfsHash
    );

    function storeReport(
        string memory _reportHash,
        string memory _reportType,
        address _recipient,
        string memory _ipfsHash
    ) public {
        reportCount++;
        reports[reportCount] = Report({
            reportHash: _reportHash,
            reportType: _reportType,
            sender: msg.sender,
            recipient: _recipient,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash
        });

        emit ReportStored(
            reportCount,
            _reportHash,
            _reportType,
            msg.sender,
            _recipient,
            _ipfsHash
        );
    }

    function getReport(uint256 _reportId) public view returns (
        string memory reportHash,
        string memory reportType,
        address sender,
        address recipient,
        uint256 timestamp,
        string memory ipfsHash
    ) {
        Report memory report = reports[_reportId];
        return (
            report.reportHash,
            report.reportType,
            report.sender,
            report.recipient,
            report.timestamp,
            report.ipfsHash
        );
    }
} 