// API URL from environment variables or default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

// Report types
export const REPORT_TYPES = [
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'test_result', label: 'Test Result' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'insurance_claim', label: 'Insurance Claim' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'treatment_plan', label: 'Treatment Plan' },
  { value: 'medical_history', label: 'Medical History' }
];

// Report statuses
export const REPORT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' }
];

// User roles
export const USER_ROLES = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'healthcare_provider', label: 'Healthcare Provider' },
  { value: 'insurance_provider', label: 'Insurance Provider' }
];

// Priority levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]; 