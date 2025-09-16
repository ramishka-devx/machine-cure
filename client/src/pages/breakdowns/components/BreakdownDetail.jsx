import React, { useState, useEffect } from 'react';
import { breakdownService } from '../../../services/breakdowns';
import { usersService } from '../../../services/users';
import { toast } from 'react-toastify';

const BreakdownDetail = ({ breakdownId, onClose, onStatusUpdate }) => {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAssignUser, setShowAssignUser] = useState(false);
  
  // Repair-related state
  const [showAddRepair, setShowAddRepair] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [repairFormData, setRepairFormData] = useState({
    repair_title: '',
    repair_description: '',
    repair_type: 'maintenance',
    parts_used: '',
    labor_hours: 0,
    parts_cost: 0,
    labor_cost: 0,
    notes: ''
  });
  const [repairSubmitting, setRepairSubmitting] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(null);
  const [completionData, setCompletionData] = useState({
    notes: '',
    final_labor_hours: 0,
    final_parts_cost: 0,
    final_labor_cost: 0
  });
  
  // End breakdown state
  const [showEndBreakdown, setShowEndBreakdown] = useState(false);
  const [endBreakdownData, setEndBreakdownData] = useState({
    actual_downtime_hours: 0,
    actual_repair_cost: 0
  });

  useEffect(() => {
    if (breakdownId) {
      loadBreakdownDetails();
    }
  }, [breakdownId]);

  const loadBreakdownDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const [breakdownRes, commentsRes, repairsRes, statusesRes, usersRes] = await Promise.all([
        breakdownService.getBreakdownById(breakdownId),
        breakdownService.getBreakdownComments(breakdownId).catch(() => ({ data: [] })),
        breakdownService.getBreakdownRepairs(breakdownId).catch(() => ({ data: [] })),
        breakdownService.getStatuses(),
        usersService.getAllUsers({ limit: 100 })
      ]);

      setBreakdown(breakdownRes?.data);
      setComments(commentsRes?.data || []);
      setRepairs(repairsRes?.data || []);
      setStatuses(statusesRes?.data || []);
      setUsers(usersRes?.data?.rows || []);
    } catch (err) {
      setError('Error loading breakdown details');
      console.error('Error loading breakdown details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatusId) => {
    try {
      await breakdownService.updateBreakdownStatus(breakdownId, newStatusId);
      loadBreakdownDetails();
      if (onStatusUpdate) onStatusUpdate();
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.warning('Error updating status. Please try again.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await breakdownService.addBreakdownComment(breakdownId, {
        comment: newComment,
        is_internal: false
      });
      setNewComment('');
      loadBreakdownDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  const handleAssignUser = async (userId) => {
    if (!userId) return;

    try {
      await breakdownService.assignBreakdown(breakdownId, userId);
      loadBreakdownDetails();
      if (onStatusUpdate) onStatusUpdate();
      setShowAssignUser(false);
      alert('Breakdown assigned successfully!');
    } catch (error) {
      console.error('Error assigning breakdown:', error);
      alert('Error assigning breakdown. Please try again.');
    }
  };

  // Repair operation handlers
  const resetRepairForm = () => {
    setRepairFormData({
      repair_title: '',
      repair_description: '',
      repair_type: 'maintenance',
      parts_used: '',
      labor_hours: 0,
      parts_cost: 0,
      labor_cost: 0,
      notes: ''
    });
    setEditingRepair(null);
    setShowAddRepair(false);
  };

  const handleAddRepair = async (e) => {
    e.preventDefault();
    if (!repairFormData.repair_title.trim() || !repairFormData.repair_description.trim()) {
      alert('Please fill in the title and description');
      return;
    }

    setRepairSubmitting(true);
    try {
      await breakdownService.addBreakdownRepair(breakdownId, repairFormData);
      
      // Update breakdown status to "Open" (status_id 2) when repair is added
      await breakdownService.updateBreakdownStatus(breakdownId, 2);
      
      resetRepairForm();
      await loadBreakdownDetails();
      if (onStatusUpdate) onStatusUpdate();
      alert('Repair task added successfully and breakdown status updated to Open');
    } catch (err) {
      console.error('Error adding repair:', err);
      alert('Error adding repair task');
    } finally {
      setRepairSubmitting(false);
    }
  };

  const handleUpdateRepair = async (e) => {
    e.preventDefault();
    if (!editingRepair || !repairFormData.repair_title.trim() || !repairFormData.repair_description.trim()) {
      alert('Please fill in the title and description');
      return;
    }

    setRepairSubmitting(true);
    try {
      await breakdownService.updateBreakdownRepair(editingRepair.repair_id, repairFormData);
      resetRepairForm();
      await loadBreakdownDetails();
      alert('Repair task updated successfully');
    } catch (err) {
      console.error('Error updating repair:', err);
      alert('Error updating repair task');
    } finally {
      setRepairSubmitting(false);
    }
  };

  const handleStartRepair = async (repairId) => {
    if (!confirm('Are you sure you want to start this repair task?')) return;
    
    try {
      await breakdownService.startBreakdownRepair(repairId);
      await loadBreakdownDetails();
      alert('Repair task started successfully');
    } catch (err) {
      console.error('Error starting repair:', err);
      alert('Error starting repair task');
    }
  };

  const handleCompleteRepair = async (repairId) => {
    try {
      await breakdownService.completeBreakdownRepair(repairId, completionData);
      setShowCompleteForm(null);
      setCompletionData({
        notes: '',
        final_labor_hours: 0,
        final_parts_cost: 0,
        final_labor_cost: 0
      });
      await loadBreakdownDetails();
      alert('Repair task completed successfully');
    } catch (err) {
      console.error('Error completing repair:', err);
      alert('Error completing repair task');
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if (!confirm('Are you sure you want to delete this repair task? This action cannot be undone.')) return;
    
    try {
      await breakdownService.deleteBreakdownRepair(repairId);
      await loadBreakdownDetails();
      alert('Repair task deleted successfully');
    } catch (err) {
      console.error('Error deleting repair:', err);
      alert('Error deleting repair task');
    }
  };

  const handleEditRepair = (repair) => {
    setRepairFormData({
      repair_title: repair.repair_title || '',
      repair_description: repair.repair_description || '',
      repair_type: repair.repair_type || 'maintenance',
      parts_used: repair.parts_used || '',
      labor_hours: repair.labor_hours || 0,
      parts_cost: repair.parts_cost || 0,
      labor_cost: repair.labor_cost || 0,
      notes: repair.notes || ''
    });
    setEditingRepair(repair);
    setShowAddRepair(true);
  };

  // End breakdown handler
  const handleEndBreakdown = async () => {
    if (!confirm('Are you sure you want to end this breakdown? This will mark it as completed.')) {
      return;
    }

    try {
      // Calculate total breakdown time in hours
      const startTime = new Date(breakdown.breakdown_start_time);
      const endTime = new Date();
      const totalHours = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours
      
      // Use the calculated time if actual downtime hours is not provided
      const finalDowntimeHours = endBreakdownData.actual_downtime_hours || totalHours;
      
      const completionData = {
        ...endBreakdownData,
        actual_downtime_hours: finalDowntimeHours
      };

      await breakdownService.completeRepair(breakdownId, completionData);
      
      // Also update status to "Completed" (status_id 4 as requested)
      await breakdownService.updateBreakdownStatus(breakdownId, 4);
      
      setShowEndBreakdown(false);
      setEndBreakdownData({
        actual_downtime_hours: 0,
        actual_repair_cost: 0
      });
      await loadBreakdownDetails();
      if (onStatusUpdate) onStatusUpdate();
      toast.success('Breakdown completed successfully!');
    } catch (err) {
      console.error('Error ending breakdown:', err);
      toast.error('Error ending breakdown. Please try again.');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-400 text-gray-900';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusBadgeClass = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'reported': return 'bg-purple-600 text-white';
      case 'assigned': return 'bg-cyan-400 text-gray-900';
      case 'in repair': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'verified': return 'bg-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Ongoing';

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return `${diffHours.toFixed(1)} hours`;
    } else {
      const diffDays = diffHours / 24;
      return `${diffDays.toFixed(1)} days`;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-11/12 max-h-90vh overflow-y-auto">
          <div className="text-center py-10 text-gray-600 text-base font-medium">Loading breakdown details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-11/12 max-h-90vh overflow-y-auto">
          <div className="text-red-600 text-center p-5 text-base font-medium">{error}</div>
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-colors">Close</button>
        </div>
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-11/12 max-h-90vh overflow-y-auto">
          <div className="text-red-600 text-center p-5 text-base font-medium">Breakdown not found</div>
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-colors">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center py-5 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-11/12 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-gray-800 text-xl font-bold tracking-tight">
            Breakdown Details - #{breakdown.breakdown_id}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-600 hover:text-gray-700">&times;</button>
        </div>

        <div className="p-5 text-sm text-gray-800 leading-relaxed">
          {/* === Basic Information === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Title</label>
                <span>{breakdown.title}</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Machine</label>
                <span>{breakdown.machine?.title}</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Division</label>
                <span>{breakdown.machine?.division?.title}</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Category</label>
                <span>{breakdown.category?.name}</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Severity</label>
                <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap w-fit ${getSeverityBadgeClass(breakdown.severity)}`}>
                  {breakdown.severity}
                </span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Current Status</label>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ${getStatusBadgeClass(breakdown.status?.name)}`}>
                    {breakdown.status?.name}
                  </span>
                  <select
                    onChange={(e) => handleStatusChange(e.target.value)}
                    value=""
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Change Status</option>
                    {statuses.map(status => (
                      <option
                        key={status.status_id}
                        value={status.status_id}
                        disabled={status.status_id === breakdown.status?.status_id}
                      >
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* === Description === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              Description
            </h3>
            <p className="bg-gray-50 p-4 rounded border-l-4 border-blue-600 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {breakdown.description}
            </p>
          </div>

          {/* === Timeline === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Breakdown Started</label>
                <span>{formatDateTime(breakdown.breakdown_start_time)}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Reported</label>
                <span>{formatDateTime(breakdown.reported_at)}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Assigned</label>
                <span>{formatDateTime(breakdown.assigned_at)}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Repair Started</label>
                <span>{formatDateTime(breakdown.repair_started_at)}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Repair Completed</label>
                <span>{formatDateTime(breakdown.repair_completed_at)}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded">
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-0.5">Total Duration</label>
                <span>{formatDuration(breakdown.breakdown_start_time, breakdown.breakdown_end_time)}</span>
              </div>
            </div>
          </div>

          {/* === People === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              People Involved
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Reported By</label>
                <span>
                  {breakdown.reported_by?.first_name} {breakdown.reported_by?.last_name}
                  <br />
                  <small className="text-gray-500 text-xs">{breakdown.reported_by?.email}</small>
                </span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Assigned To</label>
                <div className="flex flex-col gap-2">
                  {breakdown.assigned_to ? (
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                      <span>
                        {breakdown.assigned_to.first_name} {breakdown.assigned_to.last_name}
                        <br />
                        <small className="text-gray-500 text-xs">{breakdown.assigned_to.email}</small>
                      </span>
                      <button
                        onClick={() => setShowAssignUser(true)}
                        className="px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded hover:bg-gray-700 transition-colors"
                      >
                        Reassign
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                      <span className="text-red-600 italic text-sm">Not assigned</span>
                      <button
                        onClick={() => setShowAssignUser(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                      >
                        Assign User
                      </button>
                    </div>
                  )}

                  {showAssignUser && (
                    <div className="flex flex-col lg:flex-row gap-2 items-stretch lg:items-center mt-2.5 p-2.5 bg-gray-50 rounded border border-gray-200">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignUser(parseInt(e.target.value));
                          }
                        }}
                        defaultValue=""
                        className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="">Select a user...</option>
                        {users.map(user => (
                          <option
                            key={user.user_id}
                            value={user.user_id}
                            disabled={user.user_id === breakdown.assigned_to?.user_id}
                          >
                            {user.first_name} {user.last_name} ({user.email})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowAssignUser(false)}
                        className="px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* === Costs === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              Cost Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Estimated Downtime</label>
                <span>{breakdown.estimated_downtime_hours} hours</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Actual Downtime</label>
                <span>{breakdown.actual_downtime_hours || 'TBD'} hours</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Estimated Repair Cost</label>
                <span>LKR {breakdown.estimated_repair_cost}</span>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Actual Repair Cost</label>
                <span>LKR {breakdown.actual_repair_cost || 'TBD'}</span>
              </div>
            </div>
          </div>

          {/* === Comments === */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
              Comments ({comments.length})
            </h3>
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              {comments.length === 0 ? (
                <p className="text-gray-500 italic text-center m-0">No comments yet.</p>
              ) : (
                <div className="mb-5">
                  {comments.map(comment => (
                    <div key={comment.comment_id} className="border-b border-gray-200 pb-2.5 mb-2.5 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">
                          {comment.user?.first_name} {comment.user?.last_name}
                        </span>
                        <span className="text-xs text-gray-500">{formatDateTime(comment.created_at)}</span>
                      </div>
                      <p className="mt-1 text-gray-700 text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
          </div>

          {/* === Repair Management === */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold border-b border-gray-200 pb-2 tracking-wide">
                Repair Management ({repairs.length})
              </h3>
              {!showAddRepair && (
                <button
                  onClick={() => setShowAddRepair(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 transition-colors"
                >
                  Add Repair
                </button>
              )}
            </div>

            {/* Add/Edit Repair Form */}
            {showAddRepair && (
              <div className="border border-gray-200 rounded p-4 bg-blue-50 mb-4">
                <h4 className="text-gray-800 font-semibold mb-3">
                  {editingRepair ? 'Edit Repair Task' : 'Add New Repair Task'}
                </h4>
                <form onSubmit={editingRepair ? handleUpdateRepair : handleAddRepair}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repair Title *
                      </label>
                      <input
                        type="text"
                        value={repairFormData.repair_title}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, repair_title: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter repair title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repair Type *
                      </label>
                      <select
                        value={repairFormData.repair_type}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, repair_type: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                        required
                      >
                        <option value="maintenance">Maintenance</option>
                        <option value="replacement">Replacement</option>
                        <option value="adjustment">Adjustment</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repair Description *
                    </label>
                    <textarea
                      value={repairFormData.repair_description}
                      onChange={(e) => setRepairFormData(prev => ({ ...prev, repair_description: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      placeholder="Describe the repair work to be done"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Labor Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={repairFormData.labor_hours}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, labor_hours: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parts Cost (LKR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={repairFormData.parts_cost}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, parts_cost: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Labor Cost (LKR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={repairFormData.labor_cost}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, labor_cost: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parts Used
                    </label>
                    <input
                      type="text"
                      value={repairFormData.parts_used}
                      onChange={(e) => setRepairFormData(prev => ({ ...prev, parts_used: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      placeholder="List parts used (optional)"
                    />
                  </div>

                  {editingRepair && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={repairFormData.notes}
                        onChange={(e) => setRepairFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                        placeholder="Additional notes (optional)"
                        rows="2"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={repairSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {repairSubmitting ? 'Saving...' : (editingRepair ? 'Update Repair' : 'Add Repair')}
                    </button>
                    <button
                      type="button"
                      onClick={resetRepairForm}
                      className="px-4 py-2 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Repair List */}
            <div className="border border-gray-200 rounded p-4 bg-gray-50">
              {repairs.length === 0 ? (
                <p className="text-gray-500 italic text-center m-0">No repair tasks yet.</p>
              ) : (
                <div className="space-y-4">
                  {repairs.map(repair => (
                    <div key={repair.repair_id} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-800 text-sm mb-1">
                            {repair.repair_title || repair.title || 'Repair Task'}
                          </h5>
                          <span className="text-xs text-gray-500">
                            Created by: {repair.user?.first_name} {repair.user?.last_name} | 
                            {formatDateTime(repair.created_at)}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {repair.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStartRepair(repair.repair_id)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                title="Start Repair"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => handleEditRepair(repair)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                title="Edit Repair"
                              >
                                Edit
                              </button>
                            </>
                          )}
                          {repair.status === 'in_progress' && (
                            <button
                              onClick={() => setShowCompleteForm(repair.repair_id)}
                              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                              title="Complete Repair"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRepair(repair.repair_id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            title="Delete Repair"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-3">
                        {repair.repair_description || repair.notes}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-3">
                        <div>
                          <span className="font-semibold text-gray-500">Type:</span>{' '}
                          <span className="capitalize">{repair.repair_type || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Status:</span>{' '}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            repair.status === 'completed' ? 'bg-green-100 text-green-800' :
                            repair.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {repair.status || 'pending'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Labor Hours:</span>{' '}
                          {repair.labor_hours || repair.duration_hours || 0}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Total Cost:</span>{' '}
                          LKR {((repair.parts_cost || 0) + (repair.labor_cost || 0)) || repair.cost || 0}
                        </div>
                      </div>

                      {repair.parts_used && (
                        <div className="text-xs mb-2">
                          <span className="font-semibold text-gray-500">Parts Used:</span>{' '}
                          {repair.parts_used}
                        </div>
                      )}

                      {repair.started_at && (
                        <div className="text-xs mb-2">
                          <span className="font-semibold text-gray-500">Started:</span>{' '}
                          {formatDateTime(repair.started_at)}
                        </div>
                      )}

                      {repair.completed_at && (
                        <div className="text-xs mb-2">
                          <span className="font-semibold text-gray-500">Completed:</span>{' '}
                          {formatDateTime(repair.completed_at)}
                        </div>
                      )}

                      {/* Completion Form */}
                      {showCompleteForm === repair.repair_id && (
                        <div className="mt-3 p-3 bg-purple-50 rounded border">
                          <h6 className="font-semibold text-gray-700 mb-2">Complete Repair Task</h6>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Final Labor Hours
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={completionData.final_labor_hours}
                                onChange={(e) => setCompletionData(prev => ({ ...prev, final_labor_hours: parseFloat(e.target.value) || 0 }))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Final Parts Cost
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={completionData.final_parts_cost}
                                onChange={(e) => setCompletionData(prev => ({ ...prev, final_parts_cost: parseFloat(e.target.value) || 0 }))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Final Labor Cost
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={completionData.final_labor_cost}
                                onChange={(e) => setCompletionData(prev => ({ ...prev, final_labor_cost: parseFloat(e.target.value) || 0 }))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Completion Notes
                            </label>
                            <textarea
                              value={completionData.notes}
                              onChange={(e) => setCompletionData(prev => ({ ...prev, notes: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              placeholder="Add completion notes..."
                              rows="2"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCompleteRepair(repair.repair_id)}
                              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => setShowCompleteForm(null)}
                              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* End Breakdown Form */}
        {showEndBreakdown && (
          <div className="p-5 border-t border-gray-200 bg-red-50">
            <h4 className="text-gray-800 font-semibold mb-3">End Breakdown</h4>
            <p className="text-sm text-gray-600 mb-4">
              Complete this breakdown by providing final details. This will mark the breakdown as completed and set the end time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Downtime Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={endBreakdownData.actual_downtime_hours}
                  onChange={(e) => setEndBreakdownData(prev => ({ ...prev, actual_downtime_hours: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  placeholder={`Auto-calculated: ${breakdown.breakdown_start_time ? ((new Date() - new Date(breakdown.breakdown_start_time)) / (1000 * 60 * 60)).toFixed(1) : 0} hours`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-calculate from breakdown start time
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Repair Cost (LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={endBreakdownData.actual_repair_cost}
                  onChange={(e) => setEndBreakdownData(prev => ({ ...prev, actual_repair_cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  placeholder="Enter actual repair cost"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEndBreakdown}
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Complete Breakdown
              </button>
              <button
                onClick={() => {
                  setShowEndBreakdown(false);
                  setEndBreakdownData({ actual_downtime_hours: 0, actual_repair_cost: 0 });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2.5 p-5 border-t border-gray-200">
          <div>
            {breakdown.breakdown_end_time ? (
              <span className="text-sm text-green-600 font-medium">
                ✓ Breakdown completed on {formatDateTime(breakdown.breakdown_end_time)}
              </span>
            ) : (
              <button
                onClick={() => setShowEndBreakdown(true)}
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold text-sm hover:bg-red-700 transition-colors"
                disabled={showEndBreakdown}
              >
                End Breakdown
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-600 text-white rounded font-semibold text-sm hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakdownDetail;
