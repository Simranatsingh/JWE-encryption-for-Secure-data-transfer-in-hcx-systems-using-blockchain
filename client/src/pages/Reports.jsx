import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Tabs, Tab, Paper, 
         TextField, MenuItem, CircularProgress, Snackbar, Alert,
         Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import reportsService from '../services/reports.service';
import userService from '../services/user.service';

// Report types for dropdown
const REPORT_TYPES = [
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'test_result', label: 'Test Result' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'insurance_claim', label: 'Insurance Claim' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'treatment_plan', label: 'Treatment Plan' },
  { value: 'medical_history', label: 'Medical History' }
];

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState({ sent: [], received: [] });
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reportType: 'medical_report',
    content: '',
    recipientId: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  // Filter users based on current user's role
  useEffect(() => {
    if (!user || !allUsers.length) return;

    let filtered = [];
    
    switch (user.role) {
      case 'patient':
        // Patients can send to doctors, healthcare providers, and insurance providers
        filtered = allUsers.filter(u => 
          u._id !== user._id && 
          ['doctor', 'healthcare_provider', 'insurance_provider'].includes(u.role)
        );
        break;
      
      case 'doctor':
        // Doctors can send to patients, healthcare providers (but not insurance)
        filtered = allUsers.filter(u => 
          u._id !== user._id && 
          ['patient', 'healthcare_provider'].includes(u.role)
        );
        break;
      
      case 'healthcare_provider':
        // Healthcare providers can send to patients, doctors, and insurance
        filtered = allUsers.filter(u => 
          u._id !== user._id && 
          ['patient', 'doctor', 'insurance_provider'].includes(u.role)
        );
        break;
      
      case 'insurance_provider':
        // Insurance providers can send to patients and healthcare providers
        filtered = allUsers.filter(u => 
          u._id !== user._id && 
          ['patient', 'healthcare_provider'].includes(u.role)
        );
        break;
      
      default:
        filtered = allUsers.filter(u => u._id !== user._id);
    }
    
    setFilteredUsers(filtered);
    
    // Reset recipient if the current selection is no longer valid
    if (formData.recipientId && !filtered.find(u => u._id === formData.recipientId)) {
      setFormData(prev => ({ ...prev, recipientId: '' }));
    }
  }, [user, allUsers]);

  // Fetch all reports for the current user
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.listReports();
      setReports(data || { sent: [], received: [] });
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for recipient selection
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.listUsers();
      console.log('Fetched users:', response);
      setAllUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Update form data with file name
      setFormData(prev => ({
        ...prev,
        title: file.name,
        description: `Uploaded file: ${file.name}`
      }));
    }
  };

  // Handle form submission with file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (selectedFile) {
        // Create form data for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('reportType', formData.reportType);
        formDataToSend.append('recipientId', formData.recipientId);

        // Upload file with progress tracking
        const response = await reportsService.uploadReport(formDataToSend, (progress) => {
          setUploadProgress(progress);
        });
        
        console.log('Uploaded report:', response);
        setSuccess('Report uploaded successfully');
      } else {
        // Handle regular report creation
        const response = await reportsService.createReport(formData);
        console.log('Created report:', response);
        setSuccess('Report created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        reportType: 'medical_report',
        content: '',
        recipientId: ''
      });
      setSelectedFile(null);
      setUploadProgress(0);
      fetchReports();
    } catch (err) {
      console.error('Error creating/uploading report:', err);
      setError('Failed to create/upload report: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open report details dialog
  const handleViewReport = async (reportId) => {
    try {
      setLoading(true);
      const report = await reportsService.getReport(reportId);
      setCurrentReport(report);
      setReportContent(report.decryptedContent || 'Encrypted content (you cannot view)');
      setDialogOpen(true);
    } catch (err) {
      console.error('Error viewing report:', err);
      setError('Failed to load report: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Update report status
  const handleUpdateStatus = async (reportId, status) => {
    try {
      setLoading(true);
      await reportsService.updateReportStatus(reportId, status);
      setSuccess(`Report marked as ${status}`);
      fetchReports();
      setDialogOpen(false);
    } catch (err) {
      console.error('Error updating report status:', err);
      setError('Failed to update report: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Get role label for display
  const getRoleLabel = (role) => {
    switch (role) {
      case 'patient': return 'Patient';
      case 'doctor': return 'Doctor';
      case 'healthcare_provider': return 'Healthcare Provider';
      case 'insurance_provider': return 'Insurance Provider';
      default: return role;
    }
  };

  // Render the create report form
  const renderCreateForm = () => (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Create New Report
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={2}
        />
        
        <TextField
          fullWidth
          margin="normal"
          select
          label="Report Type"
          name="reportType"
          value={formData.reportType}
          onChange={handleInputChange}
          required
        >
          {REPORT_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          margin="normal"
          select
          label="Recipient"
          name="recipientId"
          value={formData.recipientId}
          onChange={handleInputChange}
          required
          helperText={
            filteredUsers.length === 0 
              ? "No suitable recipients found. Please contact an administrator." 
              : `Select a ${user?.role === 'patient' ? 'doctor, healthcare provider, or insurance provider' : 
                  user?.role === 'doctor' ? 'patient or healthcare provider' : 
                  user?.role === 'healthcare_provider' ? 'patient, doctor, or insurance provider' : 
                  'patient or healthcare provider'} to send this report to`
          }
        >
          {filteredUsers.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.profile?.fullName || user.username} ({getRoleLabel(user.role)})
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          margin="normal"
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
          helperText="This content will be encrypted with JWE for secure transmission"
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Report'}
        </Button>
      </form>
    </Paper>
  );

  // Render the reports list
  const renderReportsList = (reportsList, isSent) => (
    <Box sx={{ mt: 3 }}>
      {reportsList.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No reports found.
        </Typography>
      ) : (
        reportsList.map((report) => (
          <Paper 
            key={report._id} 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 2, 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              ':hover': { bgcolor: 'action.hover' }
            }}
          >
            <Box>
              <Typography variant="h6">
                {report.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {REPORT_TYPES.find(t => t.value === report.reportType)?.label || report.reportType}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isSent 
                  ? `To: ${report.recipientId?.profile?.fullName || report.recipientId?.username || 'Unknown'} (${getRoleLabel(report.recipientId?.role)})` 
                  : `From: ${report.senderId?.profile?.fullName || report.senderId?.username || 'Unknown'} (${getRoleLabel(report.senderId?.role)})`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {report.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {new Date(report.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => handleViewReport(report._id)}
            >
              View
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );

  // Render the report details dialog
  const renderReportDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
      {currentReport && (
        <>
          <DialogTitle>
            {currentReport.title}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1" gutterBottom>
              Type: {REPORT_TYPES.find(t => t.value === currentReport.reportType)?.label || currentReport.reportType}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              From: {currentReport.senderId?.profile?.fullName || currentReport.senderId?.username || 'Unknown'} ({getRoleLabel(currentReport.senderId?.role)})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              To: {currentReport.recipientId?.profile?.fullName || currentReport.recipientId?.username || 'Unknown'} ({getRoleLabel(currentReport.recipientId?.role)})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status: {currentReport.status}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Created: {new Date(currentReport.createdAt).toLocaleString()}
            </Typography>
            {currentReport.description && (
              <Box sx={{ my: 2 }}>
                <Typography variant="h6">Description</Typography>
                <Typography variant="body1">{currentReport.description}</Typography>
              </Box>
            )}
            <Box sx={{ my: 2 }}>
              <Typography variant="h6">Content</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                {reportContent ? (
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {reportContent}
                  </pre>
                ) : (
                  <Typography color="textSecondary">
                    No content available or encryption key missing.
                  </Typography>
                )}
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Box>
              {currentReport.recipientId?._id === user?._id && currentReport.status === 'submitted' && (
                <>
                  <Button onClick={() => handleUpdateStatus(currentReport._id, 'approved')} color="success" variant="contained" sx={{ mr: 1 }}>
                    Approve
                  </Button>
                  <Button onClick={() => handleUpdateStatus(currentReport._id, 'rejected')} color="error" variant="contained">
                    Reject
                  </Button>
                </>
              )}
            </Box>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Secure Reports
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Create Report" />
          <Tab label="Received Reports" />
          <Tab label="Sent Reports" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && renderCreateForm()}
      {tabValue === 1 && renderReportsList(reports.received || [], false)}
      {tabValue === 2 && renderReportsList(reports.sent || [], true)}
      
      {renderReportDialog()}
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reports; 