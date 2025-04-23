import supabase from '../utils/supabase';
import { toast } from 'react-toastify';

// Create a new report
export const createReport = async (reportData) => {
  try {
    // Format data for Supabase
    const formattedData = {
      title: reportData.title,
      description: reportData.description || '',
      report_type: reportData.reportType,
      sender_id: reportData.senderId,
      recipient_id: reportData.recipientId,
      encrypted_content: reportData.encryptedContent,
      content_hash: reportData.contentHash,
      metadata: reportData.metadata || {},
      access_control: reportData.accessControl || { isPublic: false, authorizedUsers: [] },
      status: reportData.status || 'submitted',
      views: []
    };

    const { data, error } = await supabase
      .from('reports')
      .insert(formattedData)
      .select()
      .single();

    if (error) throw error;
    return { report: data, success: true };
  } catch (error) {
    console.error('Create report error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Get a report by ID
export const getReport = async (reportId, userId) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        sender:sender_id(*),
        recipient:recipient_id(*)
      `)
      .eq('id', reportId)
      .single();

    if (error) throw error;
    
    // Track the view
    await trackReportView(reportId, userId);
    
    return { report: data, success: true };
  } catch (error) {
    console.error('Get report error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// List reports for a user
export const listReports = async (userId, filters = {}) => {
  try {
    // Get sent reports
    const sentQuery = supabase
      .from('reports')
      .select(`
        *,
        recipient:recipient_id(username, profile)
      `)
      .eq('sender_id', userId);
    
    // Get received reports
    const receivedQuery = supabase
      .from('reports')
      .select(`
        *,
        sender:sender_id(username, profile)
      `)
      .eq('recipient_id', userId);
    
    // Apply filters
    if (filters.reportType) {
      sentQuery.eq('report_type', filters.reportType);
      receivedQuery.eq('report_type', filters.reportType);
    }

    if (filters.status) {
      sentQuery.eq('status', filters.status);
      receivedQuery.eq('status', filters.status);
    }

    // Execute queries
    const [sentResult, receivedResult] = await Promise.all([sentQuery, receivedQuery]);
    
    if (sentResult.error) throw sentResult.error;
    if (receivedResult.error) throw receivedResult.error;
    
    return { 
      sent: sentResult.data || [], 
      received: receivedResult.data || [],
      success: true 
    };
  } catch (error) {
    console.error('List reports error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Update report status
export const updateReportStatus = async (reportId, userId, status) => {
  try {
    // Verify ownership first
    const { data: report, error: getError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (getError) throw getError;
    
    // Check permission
    if (report.sender_id !== userId && report.recipient_id !== userId) {
      throw new Error('You do not have permission to update this report');
    }
    
    // Update status
    const { data, error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId)
      .select()
      .single();
    
    if (error) throw error;
    return { report: data, success: true };
  } catch (error) {
    console.error('Update report status error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Share a report with another user
export const shareReport = async (reportId, ownerId, userId, accessLevel = 'read', expiresAt = null) => {
  try {
    // Get the current report
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    // Verify ownership
    if (report.sender_id !== ownerId && report.recipient_id !== ownerId) {
      throw new Error('You do not have permission to share this report');
    }
    
    // Update access control
    const accessControl = report.access_control || { isPublic: false, authorizedUsers: [] };
    
    // Remove existing entries for this user
    accessControl.authorizedUsers = accessControl.authorizedUsers.filter(
      user => user.userId !== userId
    );
    
    // Add new access entry
    accessControl.authorizedUsers.push({
      userId,
      accessLevel,
      grantedAt: new Date().toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
    });
    
    // Update the report
    const { data, error: updateError } = await supabase
      .from('reports')
      .update({ access_control: accessControl })
      .eq('id', reportId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    return { report: data, success: true };
  } catch (error) {
    console.error('Share report error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Track when a user views a report (helper function)
const trackReportView = async (reportId, userId) => {
  try {
    // Get current report
    const { data: report, error } = await supabase
      .from('reports')
      .select('views')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    // Add view record
    const views = report.views || [];
    views.push({
      userId,
      viewedAt: new Date().toISOString()
    });
    
    // Update report
    const { error: updateError } = await supabase
      .from('reports')
      .update({ views })
      .eq('id', reportId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Track report view error:', error);
  }
}; 