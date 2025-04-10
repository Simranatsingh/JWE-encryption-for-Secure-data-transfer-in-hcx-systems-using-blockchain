import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
    const [records, setRecords] = useState([]);
    const [accessRequests, setAccessRequests] = useState([]);

    useEffect(() => {
        // Fetch medical records
        const fetchRecords = async () => {
            try {
                const response = await axios.get('/api/health/records');
                setRecords(response.data.ownRecords);
                setAccessRequests(response.data.sharedRecords);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetchRecords();
    }, []);

    const handleApproveRequest = async (requestId) => {
        try {
            await axios.patch(`/api/health/records/${requestId}/status`, { status: 'approved' });
            // Update UI
            setAccessRequests(accessRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleDenyRequest = async (requestId) => {
        try {
            await axios.patch(`/api/health/records/${requestId}/status`, { status: 'denied' });
            // Update UI
            setAccessRequests(accessRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error denying request:', error);
        }
    };

    return (
        <div className="patient-dashboard">
            <h2>My Medical Records</h2>
            <ul>
                {records.map(record => (
                    <li key={record._id}>
                        <h3>{record.title}</h3>
                        <p>Type: {record.type}</p>
                        <p>Status: {record.status}</p>
                        <button onClick={() => handleApproveRequest(record._id)}>Approve</button>
                        <button onClick={() => handleDenyRequest(record._id)}>Deny</button>
                    </li>
                ))}
            </ul>

            <h2>Access Requests</h2>
            <ul>
                {accessRequests.map(request => (
                    <li key={request._id}>
                        <h3>{request.record.title}</h3>
                        <p>Requested by: {request.sharedWith.username}</p>
                        <button onClick={() => handleApproveRequest(request._id)}>Approve</button>
                        <button onClick={() => handleDenyRequest(request._id)}>Deny</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientDashboard; 