-- Seed data for Kaizen system

-- Insert kaizen categories
INSERT INTO kaizen_categories (name, description) VALUES
('Equipment Improvement', 'Ideas to improve machine performance, efficiency, or reliability'),
('Safety Enhancement', 'Suggestions to improve workplace safety and reduce accidents'),
('Quality Improvement', 'Ideas to improve product quality or reduce defects'),
('Cost Reduction', 'Suggestions to reduce operational costs or waste'),
('Process Optimization', 'Ideas to streamline workflows and improve efficiency'),
('Environmental Impact', 'Suggestions to reduce environmental footprint'),
('Employee Satisfaction', 'Ideas to improve work environment and employee engagement'),
('Maintenance Optimization', 'Suggestions to improve maintenance processes and reduce downtime'),
('Energy Efficiency', 'Ideas to reduce energy consumption'),
('Workplace Organization', '5S implementation and workspace organization ideas');

-- Insert kaizen statuses
INSERT INTO kaizen_statuses (name, description, sort_order) VALUES
('Submitted', 'Kaizen has been submitted and is awaiting review', 1),
('Under Review', 'Kaizen is being evaluated by management', 2),
('Approved', 'Kaizen has been approved for implementation', 3),
('In Progress', 'Kaizen is currently being implemented', 4),
('Testing', 'Kaizen implementation is being tested', 5),
('Completed', 'Kaizen has been successfully implemented', 6),
('On Hold', 'Kaizen implementation has been temporarily paused', 7),
('Rejected', 'Kaizen has been rejected after review', 8),
('Cancelled', 'Kaizen has been cancelled', 9);

-- Insert kaizen-related permissions
INSERT INTO permissions (name, description) VALUES
('kaizen.create', 'Create new kaizen suggestions'),
('kaizen.view', 'View kaizen suggestions'),
('kaizen.update', 'Update kaizen suggestions'),
('kaizen.delete', 'Delete kaizen suggestions'),
('kaizen.assign', 'Assign kaizen suggestions to users'),
('kaizen.approve', 'Approve or reject kaizen suggestions'),
('kaizen.comment', 'Add comments to kaizen suggestions'),
('kaizen.view_all', 'View all kaizen suggestions across all divisions'),
('kaizen.report', 'Generate kaizen reports and analytics'),
('kaizen.manage', 'Full kaizen management permissions');