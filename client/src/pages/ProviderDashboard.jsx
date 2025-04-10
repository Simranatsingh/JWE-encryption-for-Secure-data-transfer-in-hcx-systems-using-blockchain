import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [recordTitle, setRecordTitle] = useState('');
    const [recordContent, setRecordContent] = useState('');

    useEffect(() => {
        // Fetch patients
        const fetchPatients = async () => {
            try {
                const response = await axios.get('/api/users/patients');
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleUploadRecord = async () => {
        try {
            const response = await axios.post('/api/health/records', {
                type: 'diagnosis',
                title: recordTitle,
                content: recordContent,
                receiverId: selectedPatient
            });
            alert('Record uploaded successfully');
        } catch (error) {
            console.error('Error uploading record:', error);
            alert('Failed to upload record');
        }
    };

    return (
        <div className="provider-dashboard">
            <h2>Patient Records</h2>
            <select onChange={(e) => setSelectedPatient(e.target.value)}>
                <option value="">Select a patient</option>
                {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>{patient.username}</option>
                ))}
            </select>

            <h2>Upload Medical Record</h2>
            <input
                type="text"
                placeholder="Record Title"
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
            />
            <textarea
                placeholder="Record Content"
                value={recordContent}
                onChange={(e) => setRecordContent(e.target.value)}
            />
            <button onClick={handleUploadRecord} className="btn btn-primary">Upload Record</button>
        </div>
    );
};

export default ProviderDashboard; 