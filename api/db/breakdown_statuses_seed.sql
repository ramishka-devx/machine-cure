-- Seed data for breakdown_statuses table
-- These statuses represent the complete breakdown management workflow

INSERT IGNORE INTO breakdown_statuses (name, description, sort_order) VALUES
-- Core workflow statuses
('Reported', 'Initial status when a breakdown is first reported', 1),
('Open', 'Breakdown has been acknowledged but not yet assigned', 2),
('Assigned', 'Breakdown has been assigned to a technician', 3),
('In Repair', 'Repair work is currently in progress', 4),
('Completed', 'Repair work has been completed', 5),
('Verified', 'Repair has been verified and tested', 6),
('Closed', 'Breakdown issue has been fully resolved', 7),

-- Additional workflow statuses
('On Hold', 'Repair work is temporarily paused (waiting for parts, approval, etc.)', 8),
('Cancelled', 'Breakdown report was invalid or cancelled', 9);

-- Seed data for breakdown_categories table
INSERT IGNORE INTO breakdown_categories (name, description) VALUES
('Mechanical', 'Issues related to mechanical components, moving parts, wear and tear'),
('Electrical', 'Problems with electrical systems, wiring, motors, controls'),
('Software', 'Issues with software, programming, automation systems'),
('Hydraulic', 'Problems with hydraulic systems, pumps, cylinders, fluid leaks'),
('Pneumatic', 'Issues with compressed air systems, valves, actuators'),
('Safety', 'Safety system failures, emergency stops, protective equipment'),
('Calibration', 'Accuracy issues, measurement problems, sensor drift'),
('Lubrication', 'Problems with lubrication systems, oil leaks, grease issues'),
('Cooling', 'Overheating issues, cooling system failures, ventilation problems'),
('Material Handling', 'Conveyor issues, feeding problems, material flow disruptions'),
('Quality', 'Product quality issues caused by machine problems'),
('Other', 'Issues that do not fit into other categories');