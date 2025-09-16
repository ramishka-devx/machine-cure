import React, { useState, useEffect } from 'react';
import { breakdownService } from '../../../services/breakdowns';
import { machinesService } from '../../../services/machines';

const CreateBreakdown = ({ onBreakdownCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    machine_id: '',
    title: '',
    description: '',
    category_id: '',
    severity: 'medium',
    estimated_downtime_hours: 0,
    estimated_repair_cost: 0,
    breakdown_start_time: new Date().toISOString().slice(0, 16) // Format for datetime-local input
  });

  const [machines, setMachines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [machinesRes, categoriesRes] = await Promise.all([
          machinesService.getAllMachines(),
          breakdownService.getCategories()
        ]);
        
        setMachines(machinesRes?.data?.rows || []);
        setCategories(categoriesRes?.data || []);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.machine_id) newErrors.machine_id = 'Machine is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.breakdown_start_time) newErrors.breakdown_start_time = 'Breakdown start time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const breakdownData = {
        ...formData,
        machine_id: parseInt(formData.machine_id),
        category_id: parseInt(formData.category_id),
        breakdown_start_time: new Date(formData.breakdown_start_time).toISOString()
      };

      const response = await breakdownService.createBreakdown(breakdownData);
      
      // Reset form
      setFormData({
        machine_id: '',
        title: '',
        description: '',
        category_id: '',
        severity: 'medium',
        estimated_downtime_hours: 0,
        estimated_repair_cost: 0,
        breakdown_start_time: new Date().toISOString().slice(0, 16)
      });
      
      if (onBreakdownCreated) {
        onBreakdownCreated(response?.data);
      }
      
      alert('Breakdown reported successfully!');
    } catch (error) {
      console.error('Error creating breakdown:', error);
      alert('Error reporting breakdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      machine_id: '',
      title: '',
      description: '',
      category_id: '',
      severity: 'medium',
      estimated_downtime_hours: 0,
      estimated_repair_cost: 0,
      breakdown_start_time: new Date().toISOString().slice(0, 16)
    });
    setErrors({});
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="mb-6 text-gray-700 text-2xl font-semibold">Report New Breakdown</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="machine_id" className="mb-2 font-semibold text-gray-700">Machine *</label>
            <select
              id="machine_id"
              name="machine_id"
              value={formData.machine_id}
              onChange={handleInputChange}
              className={`p-3 border-2 rounded transition-colors text-sm ${
                errors.machine_id 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-200 focus:border-blue-600'
              } focus:outline-none`}
              required
            >
              <option value="">Select a machine</option>
              {machines?.map(machine => (
                <option key={machine.machine_id} value={machine.machine_id}>
                  {machine.title}
                </option>
              ))}
            </select>
            {errors.machine_id && <span className="text-red-600 text-xs mt-1">{errors.machine_id}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="category_id" className="mb-2 font-semibold text-gray-700">Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className={`p-3 border-2 rounded transition-colors text-sm ${
                errors.category_id 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-200 focus:border-blue-600'
              } focus:outline-none`}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <span className="text-red-600 text-xs mt-1">{errors.category_id}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="severity" className="mb-2 font-semibold text-gray-700">Severity</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="p-3 border-2 border-gray-200 rounded transition-colors text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="breakdown_start_time" className="mb-2 font-semibold text-gray-700">Breakdown Start Time *</label>
            <input
              type="datetime-local"
              id="breakdown_start_time"
              name="breakdown_start_time"
              value={formData.breakdown_start_time}
              onChange={handleInputChange}
              className={`p-3 border-2 rounded transition-colors text-sm ${
                errors.breakdown_start_time 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-200 focus:border-blue-600'
              } focus:outline-none`}
              required
            />
            {errors.breakdown_start_time && <span className="text-red-600 text-xs mt-1">{errors.breakdown_start_time}</span>}
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 font-semibold text-gray-700">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief description of the problem"
            className={`p-3 border-2 rounded transition-colors text-sm ${
              errors.title 
                ? 'border-red-600 focus:border-red-600' 
                : 'border-gray-200 focus:border-blue-600'
            } focus:outline-none`}
            required
          />
          {errors.title && <span className="text-red-600 text-xs mt-1">{errors.title}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 font-semibold text-gray-700">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about the breakdown, symptoms, and any relevant observations"
            rows="4"
            className={`p-3 border-2 rounded transition-colors text-sm ${
              errors.description 
                ? 'border-red-600 focus:border-red-600' 
                : 'border-gray-200 focus:border-blue-600'
            } focus:outline-none`}
            required
          />
          {errors.description && <span className="text-red-600 text-xs mt-1">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="estimated_downtime_hours" className="mb-2 font-semibold text-gray-700">Estimated Downtime (hours)</label>
            <input
              type="number"
              id="estimated_downtime_hours"
              name="estimated_downtime_hours"
              value={formData.estimated_downtime_hours}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              placeholder="0"
              className="p-3 border-2 border-gray-200 rounded transition-colors text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="estimated_repair_cost" className="mb-2 font-semibold text-gray-700">Estimated Repair Cost ($)</label>
            <input
              type="number"
              id="estimated_repair_cost"
              name="estimated_repair_cost"
              value={formData.estimated_repair_cost}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="p-3 border-2 border-gray-200 rounded transition-colors text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-5 flex-col md:flex-row">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white rounded border-none cursor-pointer text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? 'Reporting...' : 'Report Breakdown'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBreakdown;