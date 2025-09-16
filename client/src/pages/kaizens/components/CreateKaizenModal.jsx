import React, { useState, useEffect } from 'react';
import { kaizensService } from '../../../services/kaizens.js';
import { divisionsService } from '../../../services/divisions.js';
import { machinesService } from '../../../services/machines.js';

const CreateKaizenModal = ({ isOpen, onClose, onKaizenCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem_statement: '',
    proposed_solution: '',
    expected_benefits: '',
    implementation_plan: '',
    category_id: '',
    priority: 'medium',
    machine_id: '',
    division_id: '',
    estimated_cost: 0,
    estimated_savings: 0,
    estimated_implementation_days: 0
  });
  
  const [categories, setCategories] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchDivisions();
    }
  }, [isOpen]);

  // Fetch machines when division changes
  useEffect(() => {
    if (formData.division_id) {
      fetchMachines(formData.division_id);
    } else {
      setMachines([]);
      setFormData(prev => ({ ...prev, machine_id: '' }));
    }
  }, [formData.division_id]);

  const fetchCategories = async () => {
    try {
      const response = await kaizensService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await divisionsService.getAllDivisions();
      if (response.success) {
        setDivisions(response.data);
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchMachines = async (divisionId) => {
    try {
      const response = await machinesService.getAllMachines({ division_id: divisionId });
      if (response.success) {
        setMachines(response.data.rows || []);
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        machine_id: formData.machine_id || null,
        division_id: formData.division_id || null
      };

      const response = await kaizensService.createKaizen(submitData);
      
      if (response.success) {
        onKaizenCreated(response.data);
        resetForm();
      } else {
        setError(response.message || 'Failed to create kaizen');
      }
    } catch (err) {
      setError(err.message || 'Failed to create kaizen');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      problem_statement: '',
      proposed_solution: '',
      expected_benefits: '',
      implementation_plan: '',
      category_id: '',
      priority: 'medium',
      machine_id: '',
      division_id: '',
      estimated_cost: 0,
      estimated_savings: 0,
      estimated_implementation_days: 0
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Kaizen</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter kaizen title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the kaizen suggestion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division (Optional)
              </label>
              <select
                name="division_id"
                value={formData.division_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select division</option>
                {divisions.map((division) => (
                  <option key={division.division_id} value={division.division_id}>
                    {division.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machine (Optional)
              </label>
              <select
                name="machine_id"
                value={formData.machine_id}
                onChange={handleInputChange}
                disabled={!formData.division_id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="">Select machine</option>
                {machines.map((machine) => (
                  <option key={machine.machine_id} value={machine.machine_id}>
                    {machine.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Statement
              </label>
              <textarea
                name="problem_statement"
                value={formData.problem_statement}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the current problem or opportunity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Solution *
              </label>
              <textarea
                name="proposed_solution"
                value={formData.proposed_solution}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your proposed solution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Benefits
              </label>
              <textarea
                name="expected_benefits"
                value={formData.expected_benefits}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What benefits do you expect from this improvement?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Implementation Plan
              </label>
              <textarea
                name="implementation_plan"
                value={formData.implementation_plan}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How should this kaizen be implemented?"
              />
            </div>
          </div>

          {/* Estimates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Savings ($)
              </label>
              <input
                type="number"
                name="estimated_savings"
                value={formData.estimated_savings}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Implementation Days
              </label>
              <input
                type="number"
                name="estimated_implementation_days"
                value={formData.estimated_implementation_days}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Kaizen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKaizenModal;