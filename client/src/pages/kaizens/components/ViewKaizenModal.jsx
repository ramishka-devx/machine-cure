import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';

const ViewKaizenModal = ({ isOpen, onClose, kaizen }) => {
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (isOpen && kaizen) {
      fetchComments();
      fetchHistory();
    }
  }, [isOpen, kaizen]);

  const fetchComments = async () => {
    try {
      const response = await kaizensService.getComments(kaizen.kaizen_id);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await kaizensService.getHistory(kaizen.kaizen_id);
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await kaizensService.addComment(kaizen.kaizen_id, {
        comment: newComment,
        is_internal: isInternalComment
      });

      if (response.success) {
        setNewComment('');
        setIsInternalComment(false);
        await fetchComments();
        await fetchHistory();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-purple-600 bg-purple-50';
      case 'under review': return 'text-yellow-600 bg-yellow-50';
      case 'submitted': return 'text-gray-600 bg-gray-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'on hold': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen || !kaizen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kaizen Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History ({history.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{kaizen.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(kaizen.priority)}`}>
                      {kaizen.priority}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(kaizen.status)}`}>
                      {kaizen.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Category:</strong> {kaizen.category}</p>
                  <p><strong>Submitted by:</strong> {kaizen.submitted_by_first_name} {kaizen.submitted_by_last_name}</p>
                  <p><strong>Submitted:</strong> {formatDate(kaizen.submitted_at)}</p>
                  {kaizen.assigned_to_first_name && (
                    <p><strong>Assigned to:</strong> {kaizen.assigned_to_first_name} {kaizen.assigned_to_last_name}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{kaizen.description}</p>
              </div>

              {/* Problem Statement */}
              {kaizen.problem_statement && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Problem Statement</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{kaizen.problem_statement}</p>
                </div>
              )}

              {/* Proposed Solution */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Proposed Solution</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{kaizen.proposed_solution}</p>
              </div>

              {/* Expected Benefits */}
              {kaizen.expected_benefits && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Benefits</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{kaizen.expected_benefits}</p>
                </div>
              )}

              {/* Implementation Plan */}
              {kaizen.implementation_plan && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation Plan</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{kaizen.implementation_plan}</p>
                </div>
              )}

              {/* Location Info */}
              {(kaizen.machine_title || kaizen.division_title) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                  <div className="text-gray-900">
                    {kaizen.division_title && <p><strong>Division:</strong> {kaizen.division_title}</p>}
                    {kaizen.machine_title && <p><strong>Machine:</strong> {kaizen.machine_title}</p>}
                  </div>
                </div>
              )}

              {/* Estimates and Actuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Estimates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span className="font-medium">{formatCurrency(kaizen.estimated_cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Savings:</span>
                      <span className="font-medium">{formatCurrency(kaizen.estimated_savings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation Days:</span>
                      <span className="font-medium">{kaizen.estimated_implementation_days}</span>
                    </div>
                  </div>
                </div>

                {(kaizen.actual_cost || kaizen.actual_savings || kaizen.actual_implementation_days) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Actuals</h4>
                    <div className="space-y-2 text-sm">
                      {kaizen.actual_cost && (
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span className="font-medium">{formatCurrency(kaizen.actual_cost)}</span>
                        </div>
                      )}
                      {kaizen.actual_savings && (
                        <div className="flex justify-between">
                          <span>Savings:</span>
                          <span className="font-medium">{formatCurrency(kaizen.actual_savings)}</span>
                        </div>
                      )}
                      {kaizen.actual_implementation_days && (
                        <div className="flex justify-between">
                          <span>Implementation Days:</span>
                          <span className="font-medium">{kaizen.actual_implementation_days}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Submitted:</span>
                    <span>{formatDate(kaizen.submitted_at)}</span>
                  </div>
                  {kaizen.assigned_at && (
                    <div className="flex justify-between">
                      <span>Assigned:</span>
                      <span>{formatDate(kaizen.assigned_at)}</span>
                    </div>
                  )}
                  {kaizen.started_at && (
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span>{formatDate(kaizen.started_at)}</span>
                    </div>
                  )}
                  {kaizen.completed_at && (
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span>{formatDate(kaizen.completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your comment..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Internal comment</span>
                  </label>
                  <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.comment_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {comment.first_name} {comment.last_name}
                        </span>
                        {comment.is_internal && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Internal
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-900 whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.history_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {entry.first_name} {entry.last_name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {entry.action.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {entry.old_status && entry.new_status && (
                        <p className="text-sm text-gray-600">
                          Status changed from <span className="font-medium">{entry.old_status}</span> to{' '}
                          <span className="font-medium">{entry.new_status}</span>
                        </p>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-gray-900 mt-1">{entry.notes}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(entry.created_at)}</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-gray-500 text-center py-8">No history available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewKaizenModal;