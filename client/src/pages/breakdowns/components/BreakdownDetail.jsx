import React, { useState, useEffect } from 'react';
import { breakdownService } from '../../../services/breakdowns';
import { usersService } from '../../../services/users';

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
        usersService.getAllUsers({ limit: 100 }) // Get all active users for assignment
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
      loadBreakdownDetails(); // Refresh details
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
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
      loadBreakdownDetails(); // Refresh to show new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  const handleAssignUser = async (userId) => {
    if (!userId) return;
    
    try {
      await breakdownService.assignBreakdown(breakdownId, userId);
      loadBreakdownDetails(); // Refresh to show assignment
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      setShowAssignUser(false);
      alert('Breakdown assigned successfully!');
    } catch (error) {
      console.error('Error assigning breakdown:', error);
      alert('Error assigning breakdown. Please try again.');
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
          <div className="text-center py-10 text-gray-600 text-base">Loading breakdown details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-11/12 max-h-90vh overflow-y-auto">
          <div className="text-red-600 text-center p-5 text-base">{error}</div>
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 transition-colors">Close</button>
        </div>
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-11/12 max-h-90vh overflow-y-auto">
          <div className="text-red-600 text-center p-5 text-base">Breakdown not found</div>
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 transition-colors">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center py-5 z-50">
      <div className="bg-white rounded-sm shadow-xl max-w-4xl w-11/12 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="m-0 text-gray-700 text-xl font-semibold">Breakdown Details - #{breakdown.breakdown_id}</h2>
          <button onClick={onClose} className="bg-none border-none text-2xl cursor-pointer text-gray-600 p-0 w-8 h-8 flex items-center justify-center hover:text-gray-700">&times;</button>
        </div>

        <div className="p-5">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Title:</label>
                <span className="text-gray-700 text-sm">{breakdown.title}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Machine:</label>
                <span className="text-gray-700 text-sm">{breakdown.machine?.title}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Division:</label>
                <span className="text-gray-700 text-sm">{breakdown.machine?.division?.title}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Category:</label>
                <span className="text-gray-700 text-sm">{breakdown.category?.name}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Severity:</label>
                <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ${getSeverityBadgeClass(breakdown.severity)}`}>
                  {breakdown.severity}
                </span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Current Status:</label>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <span className={`px-2 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ${getStatusBadgeClass(breakdown.status?.name)}`}>
                    {breakdown.status?.name}
                  </span>
                  <select
                    onChange={(e) => handleStatusChange(e.target.value)}
                    value=""
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
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

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Description</h3>
            <p className="bg-gray-50 p-4 rounded border-l-4 border-blue-600 m-0 whitespace-pre-wrap">{breakdown.description}</p>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Breakdown Started:</label>
                <span className="text-gray-700 text-sm">{formatDateTime(breakdown.breakdown_start_time)}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Reported:</label>
                <span className="text-gray-700 text-sm">{formatDateTime(breakdown.reported_at)}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Assigned:</label>
                <span className="text-gray-700 text-sm">{formatDateTime(breakdown.assigned_at)}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Repair Started:</label>
                <span className="text-gray-700 text-sm">{formatDateTime(breakdown.repair_started_at)}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Repair Completed:</label>
                <span className="text-gray-700 text-sm">{formatDateTime(breakdown.repair_completed_at)}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-gray-50 rounded">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-0.5">Total Duration:</label>
                <span className="text-gray-700 text-sm">{formatDuration(breakdown.breakdown_start_time, breakdown.breakdown_end_time)}</span>
              </div>
            </div>
          </div>

          {/* People */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">People Involved</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Reported By:</label>
                <span className="text-gray-700 text-sm">
                  {breakdown.reported_by?.first_name} {breakdown.reported_by?.last_name}
                  <br />
                  <small className="text-gray-600 text-xs">{breakdown.reported_by?.email}</small>
                </span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Assigned To:</label>
                <div className="flex flex-col gap-2">
                  {breakdown.assigned_to ? (
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                      <span className="text-gray-700 text-sm">
                        {breakdown.assigned_to.first_name} {breakdown.assigned_to.last_name}
                        <br />
                        <small className="text-gray-600 text-xs">{breakdown.assigned_to.email}</small>
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

          {/* Costs */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Cost Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Estimated Downtime:</label>
                <span className="text-gray-700 text-sm">{breakdown.estimated_downtime_hours} hours</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Actual Downtime:</label>
                <span className="text-gray-700 text-sm">{breakdown.actual_downtime_hours || 'TBD'} hours</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Estimated Repair Cost:</label>
                <span className="text-gray-700 text-sm">${breakdown.estimated_repair_cost}</span>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-xs uppercase mb-1">Actual Repair Cost:</label>
                <span className="text-gray-700 text-sm">${breakdown.actual_repair_cost || 'TBD'}</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Comments ({comments.length})</h3>
            <div className="border border-gray-200 rounded p-4">
              {comments.length === 0 ? (
                <p className="text-gray-600 italic text-center m-0">No comments yet.</p>
              ) : (
                <div className="mb-5">
                  {comments.map(comment => (
                    <div key={comment.comment_id} className="border-b border-gray-200 pb-2.5 mb-2.5 last:border-b-0 last:mb-0">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-gray-700 text-sm">
                          {comment.user?.first_name} {comment.user?.last_name}
                        </strong>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-xs">
                            {formatDateTime(comment.created_at)}
                          </span>
                          {comment.is_internal && (
                            <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold uppercase">Internal</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm whitespace-pre-wrap">{comment.comment}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="resize-y min-h-15 p-2.5 border border-gray-300 rounded text-sm font-inherit"
                />
                <button type="submit" className="self-start px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors">
                  Add Comment
                </button>
              </form>
            </div>
          </div>

          {/* Repairs */}
          {repairs.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-gray-700 text-lg border-b border-gray-200 pb-1">Repair Tasks ({repairs.length})</h3>
              <div className="flex flex-col gap-4">
                {repairs.map(repair => (
                  <div key={repair.repair_id} className="border border-gray-200 rounded p-4 bg-gray-50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2.5 gap-1">
                      <strong className="text-gray-700">{repair.repair_title}</strong>
                      <span className="bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold uppercase">{repair.repair_type}</span>
                    </div>
                    <p className="mb-2.5 text-gray-700">{repair.repair_description}</p>
                    <div className="flex flex-col lg:flex-row gap-4 flex-wrap text-xs text-gray-600">
                      <span>Labor: {repair.labor_hours}h</span>
                      <span>Parts Cost: ${repair.parts_cost}</span>
                      <span>Labor Cost: ${repair.labor_cost}</span>
                      <span>By: {repair.performed_by?.first_name} {repair.performed_by?.last_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakdownDetail;