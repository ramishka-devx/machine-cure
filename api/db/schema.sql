-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 17, 2025 at 09:53 PM
-- Server version: 10.6.23-MariaDB-cll-lve
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) DEFAULT NULL,
  `method` varchar(10) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status_code` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `breakdown_attachments`
--

CREATE TABLE `breakdown_attachments` (
  `attachment_id` int(11) NOT NULL,
  `breakdown_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `breakdown_categories`
--

CREATE TABLE `breakdown_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `breakdown_comments` (
  `comment_id` int(11) NOT NULL,
  `breakdown_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_internal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `breakdown_repairs` (
  `repair_id` int(11) NOT NULL,
  `breakdown_id` int(11) NOT NULL,
  `repair_title` varchar(200) NOT NULL,
  `repair_description` text NOT NULL,
  `repair_type` enum('replacement','maintenance','adjustment','cleaning','other') NOT NULL,
  `parts_used` text DEFAULT NULL,
  `labor_hours` decimal(5,2) DEFAULT 0.00,
  `parts_cost` decimal(10,2) DEFAULT 0.00,
  `labor_cost` decimal(10,2) DEFAULT 0.00,
  `performed_by` int(11) NOT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `breakdown_repairs`
--

CREATE TABLE `breakdown_statuses` (
  `status_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `divisions` (
  `division_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `division_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `division_types` (
  `division_type_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `kaizens` (
  `kaizen_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `problem_statement` text DEFAULT NULL,
  `proposed_solution` text NOT NULL,
  `expected_benefits` text DEFAULT NULL,
  `implementation_plan` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `submitted_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `machine_id` int(11) DEFAULT NULL,
  `division_id` int(11) DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT 0.00,
  `estimated_savings` decimal(10,2) DEFAULT 0.00,
  `estimated_implementation_days` int(11) DEFAULT 0,
  `actual_cost` decimal(10,2) DEFAULT NULL,
  `actual_savings` decimal(10,2) DEFAULT NULL,
  `actual_implementation_days` int(11) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `assigned_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `kaizen_attachments` (
  `attachment_id` int(11) NOT NULL,
  `kaizen_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `kaizen_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `kaizen_comments` (
  `comment_id` int(11) NOT NULL,
  `kaizen_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_internal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `kaizen_history` (
  `history_id` int(11) NOT NULL,
  `kaizen_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `old_status_id` int(11) DEFAULT NULL,
  `new_status_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `kaizen_statuses` (
  `status_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `machines` (
  `machine_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `division_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `machine_breakdowns` (
  `breakdown_id` int(11) NOT NULL,
  `machine_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `severity` enum('low','medium','high','critical') DEFAULT 'medium',
  `reported_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `estimated_downtime_hours` decimal(5,2) DEFAULT 0.00,
  `actual_downtime_hours` decimal(5,2) DEFAULT NULL,
  `estimated_repair_cost` decimal(10,2) DEFAULT 0.00,
  `actual_repair_cost` decimal(10,2) DEFAULT NULL,
  `breakdown_start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `breakdown_end_time` timestamp NULL DEFAULT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `assigned_at` timestamp NULL DEFAULT NULL,
  `repair_started_at` timestamp NULL DEFAULT NULL,
  `repair_completed_at` timestamp NULL DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `machine_maintenance` (
  `maintenance_id` int(11) NOT NULL,
  `machine_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `type` enum('preventive','corrective','predictive','emergency','routine','overhaul') DEFAULT 'routine',
  `status` enum('scheduled','in_progress','completed','cancelled','overdue') DEFAULT 'scheduled',
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `scheduled_by` int(11) NOT NULL,
  `estimated_duration_hours` decimal(5,2) DEFAULT 0.00,
  `actual_duration_hours` decimal(5,2) DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT 0.00,
  `actual_cost` decimal(10,2) DEFAULT NULL,
  `scheduled_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `due_date` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;



CREATE TABLE `meters` (
  `meter_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `machine_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;



CREATE TABLE `parameters` (
  `parameter_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value_type` enum('string','number','boolean') NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `meter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `status` set('pending','verified','deleted') NOT NULL DEFAULT 'pending',
  `profileImg` text NOT NULL DEFAULT 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `fk_activities_user` (`user_id`),
  ADD KEY `fk_activities_permission` (`permission_id`);

--
-- Indexes for table `breakdown_attachments`
--
ALTER TABLE `breakdown_attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `breakdown_id` (`breakdown_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `breakdown_categories`
--
ALTER TABLE `breakdown_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `breakdown_comments`
--
ALTER TABLE `breakdown_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_breakdown_comments_breakdown` (`breakdown_id`);

--
-- Indexes for table `breakdown_repairs`
--
ALTER TABLE `breakdown_repairs`
  ADD PRIMARY KEY (`repair_id`),
  ADD KEY `performed_by` (`performed_by`),
  ADD KEY `idx_repairs_breakdown` (`breakdown_id`);

--
-- Indexes for table `breakdown_statuses`
--
ALTER TABLE `breakdown_statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`division_id`),
  ADD KEY `fk_divisions_type` (`division_type_id`),
  ADD KEY `idx_divisions_parent` (`parent_id`);

--
-- Indexes for table `division_types`
--
ALTER TABLE `division_types`
  ADD PRIMARY KEY (`division_type_id`);

--
-- Indexes for table `kaizens`
--
ALTER TABLE `kaizens`
  ADD PRIMARY KEY (`kaizen_id`),
  ADD KEY `idx_kaizens_submitted_by` (`submitted_by`),
  ADD KEY `idx_kaizens_assigned_to` (`assigned_to`),
  ADD KEY `idx_kaizens_status` (`status_id`),
  ADD KEY `idx_kaizens_category` (`category_id`),
  ADD KEY `idx_kaizens_machine` (`machine_id`),
  ADD KEY `idx_kaizens_division` (`division_id`);

--
-- Indexes for table `kaizen_attachments`
--
ALTER TABLE `kaizen_attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `kaizen_id` (`kaizen_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `kaizen_categories`
--
ALTER TABLE `kaizen_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `kaizen_comments`
--
ALTER TABLE `kaizen_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_kaizen_comments_kaizen` (`kaizen_id`);

--
-- Indexes for table `kaizen_history`
--
ALTER TABLE `kaizen_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `old_status_id` (`old_status_id`),
  ADD KEY `new_status_id` (`new_status_id`),
  ADD KEY `idx_kaizen_history_kaizen` (`kaizen_id`);

--
-- Indexes for table `kaizen_statuses`
--
ALTER TABLE `kaizen_statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`machine_id`),
  ADD KEY `idx_machines_division` (`division_id`);

--
-- Indexes for table `machine_breakdowns`
--
ALTER TABLE `machine_breakdowns`
  ADD PRIMARY KEY (`breakdown_id`),
  ADD KEY `idx_breakdowns_machine` (`machine_id`),
  ADD KEY `idx_breakdowns_status` (`status_id`),
  ADD KEY `idx_breakdowns_category` (`category_id`),
  ADD KEY `idx_breakdowns_reported_by` (`reported_by`),
  ADD KEY `idx_breakdowns_assigned_to` (`assigned_to`);

--
-- Indexes for table `machine_maintenance`
--
ALTER TABLE `machine_maintenance`
  ADD PRIMARY KEY (`maintenance_id`),
  ADD KEY `machine_id` (`machine_id`),
  ADD KEY `scheduled_by` (`scheduled_by`);

--
-- Indexes for table `meters`
--
ALTER TABLE `meters`
  ADD PRIMARY KEY (`meter_id`),
  ADD KEY `idx_meters_machine` (`machine_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_notifications_user` (`user_id`,`is_read`,`created_at`),
  ADD KEY `idx_notifications_type` (`type`),
  ADD KEY `idx_notifications_entity` (`entity_type`,`entity_id`);

--
-- Indexes for table `parameters`
--
ALTER TABLE `parameters`
  ADD PRIMARY KEY (`parameter_id`),
  ADD KEY `idx_parameters_meter` (`meter_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `fk_rp_permission` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_role` (`role_id`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `breakdown_attachments`
--
ALTER TABLE `breakdown_attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `breakdown_categories`
--
ALTER TABLE `breakdown_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `breakdown_comments`
--
ALTER TABLE `breakdown_comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `breakdown_repairs`
--
ALTER TABLE `breakdown_repairs`
  MODIFY `repair_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `breakdown_statuses`
--
ALTER TABLE `breakdown_statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `divisions`
--
ALTER TABLE `divisions`
  MODIFY `division_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `division_types`
--
ALTER TABLE `division_types`
  MODIFY `division_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kaizens`
--
ALTER TABLE `kaizens`
  MODIFY `kaizen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `kaizen_attachments`
--
ALTER TABLE `kaizen_attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kaizen_categories`
--
ALTER TABLE `kaizen_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kaizen_comments`
--
ALTER TABLE `kaizen_comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `kaizen_history`
--
ALTER TABLE `kaizen_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kaizen_statuses`
--
ALTER TABLE `kaizen_statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `machines`
--
ALTER TABLE `machines`
  MODIFY `machine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `machine_breakdowns`
--
ALTER TABLE `machine_breakdowns`
  MODIFY `breakdown_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `machine_maintenance`
--
ALTER TABLE `machine_maintenance`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `meters`
--
ALTER TABLE `meters`
  MODIFY `meter_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `parameters`
--
ALTER TABLE `parameters`
  MODIFY `parameter_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=275;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `fk_activities_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`),
  ADD CONSTRAINT `fk_activities_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `breakdown_attachments`
--
ALTER TABLE `breakdown_attachments`
  ADD CONSTRAINT `breakdown_attachments_ibfk_1` FOREIGN KEY (`breakdown_id`) REFERENCES `machine_breakdowns` (`breakdown_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `breakdown_attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `breakdown_comments`
--
ALTER TABLE `breakdown_comments`
  ADD CONSTRAINT `breakdown_comments_ibfk_1` FOREIGN KEY (`breakdown_id`) REFERENCES `machine_breakdowns` (`breakdown_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `breakdown_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `breakdown_repairs`
--
ALTER TABLE `breakdown_repairs`
  ADD CONSTRAINT `breakdown_repairs_ibfk_1` FOREIGN KEY (`breakdown_id`) REFERENCES `machine_breakdowns` (`breakdown_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `breakdown_repairs_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `divisions`
--
ALTER TABLE `divisions`
  ADD CONSTRAINT `fk_divisions_parent` FOREIGN KEY (`parent_id`) REFERENCES `divisions` (`division_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_divisions_type` FOREIGN KEY (`division_type_id`) REFERENCES `division_types` (`division_type_id`);

--
-- Constraints for table `kaizens`
--
ALTER TABLE `kaizens`
  ADD CONSTRAINT `kaizens_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `kaizen_categories` (`category_id`),
  ADD CONSTRAINT `kaizens_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `kaizen_statuses` (`status_id`),
  ADD CONSTRAINT `kaizens_ibfk_3` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `kaizens_ibfk_4` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `kaizens_ibfk_5` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kaizens_ibfk_6` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`division_id`) ON DELETE SET NULL;

--
-- Constraints for table `kaizen_attachments`
--
ALTER TABLE `kaizen_attachments`
  ADD CONSTRAINT `kaizen_attachments_ibfk_1` FOREIGN KEY (`kaizen_id`) REFERENCES `kaizens` (`kaizen_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kaizen_attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `kaizen_comments`
--
ALTER TABLE `kaizen_comments`
  ADD CONSTRAINT `kaizen_comments_ibfk_1` FOREIGN KEY (`kaizen_id`) REFERENCES `kaizens` (`kaizen_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kaizen_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `kaizen_history`
--
ALTER TABLE `kaizen_history`
  ADD CONSTRAINT `kaizen_history_ibfk_1` FOREIGN KEY (`kaizen_id`) REFERENCES `kaizens` (`kaizen_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kaizen_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `kaizen_history_ibfk_3` FOREIGN KEY (`old_status_id`) REFERENCES `kaizen_statuses` (`status_id`),
  ADD CONSTRAINT `kaizen_history_ibfk_4` FOREIGN KEY (`new_status_id`) REFERENCES `kaizen_statuses` (`status_id`);

--
-- Constraints for table `machines`
--
ALTER TABLE `machines`
  ADD CONSTRAINT `fk_machines_division` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`division_id`);

--
-- Constraints for table `machine_breakdowns`
--
ALTER TABLE `machine_breakdowns`
  ADD CONSTRAINT `machine_breakdowns_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`),
  ADD CONSTRAINT `machine_breakdowns_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `machine_breakdowns_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `machine_maintenance`
--
ALTER TABLE `machine_maintenance`
  ADD CONSTRAINT `machine_maintenance_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`),
  ADD CONSTRAINT `machine_maintenance_ibfk_2` FOREIGN KEY (`scheduled_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `meters`
--
ALTER TABLE `meters`
  ADD CONSTRAINT `fk_meters_machine` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `parameters`
--
ALTER TABLE `parameters`
  ADD CONSTRAINT `fk_parameters_meter` FOREIGN KEY (`meter_id`) REFERENCES `meters` (`meter_id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
