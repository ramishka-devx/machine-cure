-- Schema for Machine Management System

CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS division_types (
  division_type_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS divisions (
  division_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  parent_id INT NULL,
  division_type_id INT NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES divisions(division_id) ON DELETE SET NULL,
  FOREIGN KEY (division_type_id) REFERENCES division_types(division_type_id)
);

CREATE TABLE IF NOT EXISTS machines (
  machine_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  division_id INT NOT NULL,
  FOREIGN KEY (division_id) REFERENCES divisions(division_id)
);

CREATE TABLE IF NOT EXISTS meters (
  meter_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  machine_id INT NOT NULL,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);

CREATE TABLE IF NOT EXISTS parameters (
  parameter_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value_type ENUM('string','number','boolean') NOT NULL,
  unit VARCHAR(50) NULL,
  meter_id INT NOT NULL,
  FOREIGN KEY (meter_id) REFERENCES meters(meter_id)
);

CREATE TABLE IF NOT EXISTS activities (
  activity_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  permission_id INT NULL,
  method VARCHAR(10) NOT NULL,
  path VARCHAR(255) NOT NULL,
  status_code INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);

CREATE TABLE IF NOT EXISTS kaizen_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kaizen_statuses (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kaizens (
  kaizen_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  problem_statement TEXT,
  proposed_solution TEXT NOT NULL,
  expected_benefits TEXT,
  implementation_plan TEXT,
  category_id INT NOT NULL,
  status_id INT NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  submitted_by INT NOT NULL,
  assigned_to INT NULL,
  machine_id INT NULL,
  division_id INT NULL,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  estimated_savings DECIMAL(10,2) DEFAULT 0,
  estimated_implementation_days INT DEFAULT 0,
  actual_cost DECIMAL(10,2) NULL,
  actual_savings DECIMAL(10,2) NULL,
  actual_implementation_days INT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_at TIMESTAMP NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES kaizen_categories(category_id),
  FOREIGN KEY (status_id) REFERENCES kaizen_statuses(status_id),
  FOREIGN KEY (submitted_by) REFERENCES users(user_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id),
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id) ON DELETE SET NULL,
  FOREIGN KEY (division_id) REFERENCES divisions(division_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS kaizen_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  kaizen_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kaizen_id) REFERENCES kaizens(kaizen_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS kaizen_attachments (
  attachment_id INT AUTO_INCREMENT PRIMARY KEY,
  kaizen_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kaizen_id) REFERENCES kaizens(kaizen_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS kaizen_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  kaizen_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  old_status_id INT NULL,
  new_status_id INT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kaizen_id) REFERENCES kaizens(kaizen_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (old_status_id) REFERENCES kaizen_statuses(status_id),
  FOREIGN KEY (new_status_id) REFERENCES kaizen_statuses(status_id)
);

CREATE TABLE IF NOT EXISTS breakdown_statuses (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS breakdown_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS machine_breakdowns (
  breakdown_id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id INT NOT NULL,
  status_id INT NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  reported_by INT NOT NULL,
  assigned_to INT NULL,
  estimated_downtime_hours DECIMAL(5,2) DEFAULT 0,
  actual_downtime_hours DECIMAL(5,2) NULL,
  estimated_repair_cost DECIMAL(10,2) DEFAULT 0,
  actual_repair_cost DECIMAL(10,2) NULL,
  breakdown_start_time TIMESTAMP NOT NULL,
  breakdown_end_time TIMESTAMP NULL,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_at TIMESTAMP NULL,
  repair_started_at TIMESTAMP NULL,
  repair_completed_at TIMESTAMP NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
  FOREIGN KEY (category_id) REFERENCES breakdown_categories(category_id),
  FOREIGN KEY (status_id) REFERENCES breakdown_statuses(status_id),
  FOREIGN KEY (reported_by) REFERENCES users(user_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS breakdown_repairs (
  repair_id INT AUTO_INCREMENT PRIMARY KEY,
  breakdown_id INT NOT NULL,
  repair_title VARCHAR(200) NOT NULL,
  repair_description TEXT NOT NULL,
  repair_type ENUM('replacement', 'maintenance', 'adjustment', 'cleaning', 'other') NOT NULL,
  parts_used TEXT NULL,
  labor_hours DECIMAL(5,2) DEFAULT 0,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  performed_by INT NOT NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (breakdown_id) REFERENCES machine_breakdowns(breakdown_id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS breakdown_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  breakdown_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (breakdown_id) REFERENCES machine_breakdowns(breakdown_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS breakdown_attachments (
  attachment_id INT AUTO_INCREMENT PRIMARY KEY,
  breakdown_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (breakdown_id) REFERENCES machine_breakdowns(breakdown_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_divisions_parent ON divisions(parent_id);
CREATE INDEX IF NOT EXISTS idx_machines_division ON machines(division_id);
CREATE INDEX IF NOT EXISTS idx_meters_machine ON meters(machine_id);
CREATE INDEX IF NOT EXISTS idx_parameters_meter ON parameters(meter_id);
CREATE INDEX IF NOT EXISTS idx_kaizens_submitted_by ON kaizens(submitted_by);
CREATE INDEX IF NOT EXISTS idx_kaizens_assigned_to ON kaizens(assigned_to);
CREATE INDEX IF NOT EXISTS idx_kaizens_status ON kaizens(status_id);
CREATE INDEX IF NOT EXISTS idx_kaizens_category ON kaizens(category_id);
CREATE INDEX IF NOT EXISTS idx_kaizens_machine ON kaizens(machine_id);
CREATE INDEX IF NOT EXISTS idx_kaizens_division ON kaizens(division_id);
CREATE INDEX IF NOT EXISTS idx_kaizen_comments_kaizen ON kaizen_comments(kaizen_id);
CREATE INDEX IF NOT EXISTS idx_kaizen_history_kaizen ON kaizen_history(kaizen_id);
CREATE INDEX IF NOT EXISTS idx_breakdowns_machine ON machine_breakdowns(machine_id);
CREATE INDEX IF NOT EXISTS idx_breakdowns_status ON machine_breakdowns(status_id);
CREATE INDEX IF NOT EXISTS idx_breakdowns_category ON machine_breakdowns(category_id);
CREATE INDEX IF NOT EXISTS idx_breakdowns_reported_by ON machine_breakdowns(reported_by);
CREATE INDEX IF NOT EXISTS idx_breakdowns_assigned_to ON machine_breakdowns(assigned_to);
CREATE INDEX IF NOT EXISTS idx_repairs_breakdown ON breakdown_repairs(breakdown_id);
CREATE INDEX IF NOT EXISTS idx_breakdown_comments_breakdown ON breakdown_comments(breakdown_id);

-- Maintenance Management Tables

CREATE TABLE IF NOT EXISTS maintenance_types (
  maintenance_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  default_frequency_days INT NOT NULL,
  estimated_duration_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id INT NOT NULL,
  maintenance_type_id INT NOT NULL,
  frequency_days INT NOT NULL,
  next_due_date DATE NOT NULL,
  last_completed_date DATE NULL,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_to INT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
  FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(maintenance_type_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS maintenance_statuses (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id INT NOT NULL,
  maintenance_type_id INT NOT NULL,
  schedule_id INT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status_id INT NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  scheduled_date DATE NOT NULL,
  estimated_duration_hours DECIMAL(5,2) DEFAULT 0,
  actual_duration_hours DECIMAL(5,2) NULL,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  actual_cost DECIMAL(10,2) NULL,
  assigned_to INT NULL,
  performed_by INT NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
  FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(maintenance_type_id),
  FOREIGN KEY (schedule_id) REFERENCES maintenance_schedules(schedule_id),
  FOREIGN KEY (status_id) REFERENCES maintenance_statuses(status_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id),
  FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS parts (
  part_id INT AUTO_INCREMENT PRIMARY KEY,
  part_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2) DEFAULT 0,
  supplier VARCHAR(200),
  category VARCHAR(100),
  minimum_stock_level INT DEFAULT 0,
  current_stock_level INT DEFAULT 0,
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_parts_used (
  usage_id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  part_id INT NOT NULL,
  quantity_used INT NOT NULL,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (maintenance_id) REFERENCES maintenance_records(maintenance_id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES parts(part_id)
);

CREATE TABLE IF NOT EXISTS machine_parts (
  machine_id INT NOT NULL,
  part_id INT NOT NULL,
  recommended_stock_level INT DEFAULT 0,
  PRIMARY KEY (machine_id, part_id),
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_procedures (
  procedure_id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_type_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  steps JSON NOT NULL,
  safety_notes TEXT,
  required_tools TEXT,
  estimated_time_minutes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(maintenance_type_id)
);

CREATE TABLE IF NOT EXISTS maintenance_checklist_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  procedure_id INT NOT NULL,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by INT NULL,
  completed_at TIMESTAMP NULL,
  notes TEXT,
  FOREIGN KEY (maintenance_id) REFERENCES maintenance_records(maintenance_id) ON DELETE CASCADE,
  FOREIGN KEY (procedure_id) REFERENCES maintenance_procedures(procedure_id),
  FOREIGN KEY (completed_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS maintenance_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maintenance_id) REFERENCES maintenance_records(maintenance_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS maintenance_attachments (
  attachment_id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maintenance_id) REFERENCES maintenance_records(maintenance_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Indexes for maintenance tables
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_machine ON maintenance_schedules(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_due_date ON maintenance_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_type ON maintenance_schedules(maintenance_type_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_machine ON maintenance_records(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_status ON maintenance_records(status_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_assigned_to ON maintenance_records(assigned_to);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_scheduled_date ON maintenance_records(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_type ON maintenance_records(maintenance_type_id);
CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_maintenance_parts_maintenance ON maintenance_parts_used(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_parts_part ON maintenance_parts_used(part_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_comments_maintenance ON maintenance_comments(maintenance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_checklist_maintenance ON maintenance_checklist_items(maintenance_id);