-- Maintenance statuses seed data
INSERT INTO maintenance_statuses (name, description, sort_order) VALUES
('scheduled', 'Maintenance is scheduled to be performed', 1),
('in_progress', 'Maintenance work is currently in progress', 2),
('completed', 'Maintenance work has been completed successfully', 3),
('cancelled', 'Maintenance has been cancelled', 4),
('overdue', 'Scheduled maintenance is overdue', 5)
ON DUPLICATE KEY UPDATE
description = VALUES(description),
sort_order = VALUES(sort_order);

-- Sample maintenance types
INSERT INTO maintenance_types (name, description, default_frequency_days, estimated_duration_hours) VALUES
('Oil Change', 'Regular oil change for machinery', 30, 2.0),
('Filter Replacement', 'Replace air and oil filters', 90, 1.5),
('Belt Inspection', 'Inspect and replace drive belts if necessary', 60, 1.0),
('Bearing Lubrication', 'Lubricate all bearings and moving parts', 14, 0.5),
('Calibration Check', 'Calibrate instruments and sensors', 180, 3.0),
('Safety Inspection', 'Complete safety system inspection', 90, 4.0),
('Electrical Check', 'Inspect electrical connections and components', 120, 2.5),
('Cleaning & Degreasing', 'Deep clean and degrease equipment', 30, 1.5),
('Vibration Analysis', 'Perform vibration analysis and diagnostics', 180, 2.0),
('Annual Overhaul', 'Complete annual maintenance overhaul', 365, 24.0)
ON DUPLICATE KEY UPDATE
description = VALUES(description),
default_frequency_days = VALUES(default_frequency_days),
estimated_duration_hours = VALUES(estimated_duration_hours);

-- Sample parts categories and parts
INSERT INTO parts (part_number, name, description, unit_price, supplier, category, minimum_stock_level, current_stock_level, unit) VALUES
('OIL-HD-5W30', 'Heavy Duty Motor Oil 5W-30', '5 gallon container of heavy duty motor oil', 45.99, 'Industrial Lubricants Inc', 'Lubricants', 10, 25, 'gallons'),
('FILTER-AIR-001', 'Air Filter Element', 'Standard air filter for industrial equipment', 12.50, 'FilterTech Corp', 'Filters', 20, 50, 'pieces'),
('FILTER-OIL-001', 'Oil Filter Cartridge', 'High-efficiency oil filter cartridge', 8.75, 'FilterTech Corp', 'Filters', 15, 30, 'pieces'),
('BELT-V-001', 'V-Belt Standard', 'Standard V-belt for drive systems', 25.00, 'Power Transmission Co', 'Belts', 5, 12, 'pieces'),
('BEARING-6205', 'Deep Groove Ball Bearing 6205', 'Standard deep groove ball bearing', 15.50, 'Bearing Solutions Ltd', 'Bearings', 10, 25, 'pieces'),
('GREASE-LI-001', 'Lithium Grease', 'Multi-purpose lithium grease cartridge', 8.25, 'Industrial Lubricants Inc', 'Lubricants', 25, 40, 'cartridges'),
('GASKET-001', 'Rubber Gasket Set', 'Standard rubber gasket set', 18.00, 'Seal-Rite Manufacturing', 'Gaskets', 8, 15, 'sets'),
('BOLT-HEX-M10', 'Hex Bolt M10x50mm', 'High-strength hex bolt M10x50mm', 2.50, 'FastenTech Supply', 'Fasteners', 50, 100, 'pieces'),
('WIRE-14AWG', '14 AWG Electrical Wire', '14 AWG stranded copper wire', 1.25, 'ElectroWire Corp', 'Electrical', 100, 200, 'feet'),
('SENSOR-TEMP-001', 'Temperature Sensor', 'Digital temperature sensor', 75.00, 'Automation Systems Inc', 'Sensors', 5, 8, 'pieces')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description),
unit_price = VALUES(unit_price),
supplier = VALUES(supplier),
category = VALUES(category),
minimum_stock_level = VALUES(minimum_stock_level),
current_stock_level = VALUES(current_stock_level),
unit = VALUES(unit);