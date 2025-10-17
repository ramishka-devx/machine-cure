-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 17, 2025 at 09:39 PM
-- Server version: 10.6.23-MariaDB-cll-lve
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ewinners_machine_cure`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`ewinners`@`localhost` PROCEDURE `insert_dummy_users` ()   BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 100000 DO
        INSERT INTO users (name, email, age, city)
        VALUES (
            CONCAT('User', i),
            CONCAT('user', i, '@example.com'),
            FLOOR(18 + (RAND() * 42)), -- random age between 18 and 60
            ELT(FLOOR(1 + (RAND() * 4)), 'Colombo', 'Galle', 'Kandy', 'Jaffna')
        );
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

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
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `user_id`, `permission_id`, `method`, `path`, `status_code`, `created_at`) VALUES
(1, 2, 2, 'PUT', '/api/users/3', 200, '2025-08-10 04:15:43'),
(2, 2, 2, 'PUT', '/api/users/3', 200, '2025-08-10 04:16:12'),
(3, 2, 3, 'POST', '/api/divisions', 201, '2025-08-10 04:33:29'),
(4, 2, 3, 'POST', '/api/divisions', 201, '2025-08-10 04:33:38'),
(5, 2, 6, 'POST', '/api/machines', 400, '2025-08-10 04:52:12'),
(6, 2, 6, 'POST', '/api/machines', 500, '2025-08-10 04:52:17'),
(7, 2, 3, 'POST', '/api/divisions', 201, '2025-08-10 04:56:24'),
(8, 2, 6, 'POST', '/api/machines', 201, '2025-08-10 04:57:04'),
(9, 2, 6, 'POST', '/api/machines', 201, '2025-08-10 04:57:40'),
(10, 2, 10, 'PUT', '/api/users/3/status', 400, '2025-08-10 13:14:09'),
(11, 2, 10, 'PUT', '/api/users/3/status', 200, '2025-08-10 13:15:06'),
(12, 2, 10, 'PUT', '/api/users/3/status', 400, '2025-08-10 13:15:14'),
(13, 2, 10, 'PUT', '/api/users/2/status', 200, '2025-08-10 13:38:11'),
(14, 2, 10, 'PUT', '/api/users/4/status', 200, '2025-08-10 13:55:28'),
(15, 2, 10, 'PUT', '/api/users/5/status', 200, '2025-08-10 14:00:09'),
(16, 2, 10, 'PUT', '/api/users/5/status', 200, '2025-08-10 14:00:14'),
(17, 2, 10, 'PUT', '/api/users/5/status', 200, '2025-08-10 14:19:58'),
(18, 2, 3, 'POST', '/api/divisions', 201, '2025-09-14 15:37:53'),
(19, 2, NULL, 'POST', '/api/division-types', 400, '2025-09-15 04:21:53'),
(20, 2, NULL, 'POST', '/api/division-types', 201, '2025-09-15 04:23:07'),
(21, 2, NULL, 'PUT', '/api/division-types/3', 200, '2025-09-15 04:26:34'),
(22, 2, NULL, 'PUT', '/api/division-types/3', 200, '2025-09-15 04:26:51'),
(23, 2, NULL, 'DELETE', '/api/division-types/3', 204, '2025-09-15 04:28:14'),
(24, 2, NULL, 'DELETE', '/api/division-types/3', 204, '2025-09-15 04:28:26'),
(25, 2, 3, 'POST', '/api/divisions', 201, '2025-09-15 04:30:03'),
(26, 2, 5, 'PUT', '/api/divisions/5', 200, '2025-09-15 04:32:14'),
(27, 2, NULL, 'DELETE', '/api/divisions/5', 204, '2025-09-15 04:32:58'),
(28, 2, 3, 'POST', '/api/divisions', 201, '2025-09-15 07:24:30'),
(29, 2, NULL, 'POST', '/api/division-types', 201, '2025-09-15 09:17:06'),
(30, 2, NULL, 'PUT', '/api/division-types/5', 200, '2025-09-15 09:17:15'),
(31, 2, 6, 'POST', '/api/machines', 201, '2025-09-15 10:01:44'),
(32, 2, 8, 'PUT', '/api/machines/4', 200, '2025-09-15 10:02:39'),
(33, 2, 9, 'DELETE', '/api/machines/4', 204, '2025-09-15 10:03:21'),
(34, 2, NULL, 'PUT', '/api/users/3/role', 200, '2025-09-15 11:08:55'),
(35, 2, NULL, 'PUT', '/api/users/3/role', 400, '2025-09-15 11:24:01'),
(36, 2, NULL, 'PUT', '/api/users/3/role', 200, '2025-09-15 11:24:07'),
(37, 2, NULL, 'PUT', '/api/users/3/role', 200, '2025-09-15 11:24:11'),
(38, 2, NULL, 'PUT', '/api/users/3/role', 200, '2025-09-15 11:24:20'),
(39, 2, NULL, 'PUT', '/api/users/2/role', 200, '2025-09-15 11:25:26'),
(40, 2, NULL, 'PUT', '/api/users/2/role', 400, '2025-09-15 11:25:29'),
(41, 2, NULL, 'PUT', '/api/users/2/role', 200, '2025-09-15 11:25:30'),
(42, 2, NULL, 'PUT', '/api/users/2/role', 400, '2025-09-15 11:25:54'),
(43, 2, NULL, 'PUT', '/api/users/2/role', 200, '2025-09-15 11:27:19'),
(44, 2, NULL, 'PUT', '/api/users/2/role', 200, '2025-09-15 11:27:23'),
(45, 2, NULL, 'PUT', '/api/users/2/role', 200, '2025-09-15 11:27:38'),
(46, 2, 10, 'PUT', '/api/users/2/status', 200, '2025-09-15 11:45:02'),
(47, 2, 10, 'PUT', '/api/users/2/status', 200, '2025-09-15 11:45:06'),
(48, 2, 10, 'PUT', '/api/users/6/status', 200, '2025-09-15 11:58:39'),
(49, 6, 10, 'PUT', '/api/users/7/status', 200, '2025-09-15 12:28:38'),
(50, 6, 10, 'PUT', '/api/users/8/status', 200, '2025-09-15 12:28:39'),
(51, 6, 10, 'PUT', '/api/users/9/status', 200, '2025-09-15 12:28:41'),
(52, 6, NULL, 'POST', '/api/breakdowns', 201, '2025-09-15 15:19:10'),
(53, 6, NULL, 'POST', '/api/breakdowns', 201, '2025-09-15 15:22:10'),
(54, 6, NULL, 'POST', '/api/breakdowns', 201, '2025-09-15 15:26:11'),
(55, 6, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 00:20:42'),
(56, 6, NULL, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-16 00:35:58'),
(57, 2, NULL, 'POST', '/api/maintenance', 201, '2025-09-16 07:56:41'),
(58, 2, NULL, 'PUT', '/api/maintenance/1/status', 200, '2025-09-16 07:56:59'),
(59, 2, NULL, 'PUT', '/api/maintenance/1', 200, '2025-09-16 07:57:08'),
(60, 2, NULL, 'PUT', '/api/maintenance/1/status', 200, '2025-09-16 07:57:18'),
(61, 2, NULL, 'PUT', '/api/maintenance/1/status', 200, '2025-09-16 07:57:25'),
(62, 2, NULL, 'PUT', '/api/maintenance/1', 200, '2025-09-16 07:57:39'),
(63, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 10:18:26'),
(64, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 10:25:43'),
(65, 2, NULL, 'POST', '/api/breakdown/3/comments', 201, '2025-09-16 10:34:04'),
(66, 2, NULL, 'POST', '/api/breakdown/3/repairs', 201, '2025-09-16 11:12:13'),
(67, 2, NULL, 'POST', '/api/breakdown/3/repairs', 201, '2025-09-16 11:13:10'),
(68, 2, NULL, 'PATCH', '/api/breakdowns/3/complete-repair', 200, '2025-09-16 11:19:19'),
(69, 2, NULL, 'PATCH', '/api/breakdowns/2/complete-repair', 200, '2025-09-16 11:23:41'),
(70, 2, NULL, 'PATCH', '/api/breakdowns/2/status', 200, '2025-09-16 11:23:46'),
(71, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 11:25:36'),
(72, 2, NULL, 'PATCH', '/api/breakdowns/1/status', 200, '2025-09-16 11:25:47'),
(73, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 11:27:49'),
(74, 2, NULL, 'POST', '/api/breakdown/3/repairs', 201, '2025-09-16 11:28:09'),
(75, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 11:28:10'),
(76, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-16 11:29:48'),
(77, 2, NULL, 'POST', '/api/maintenance', 201, '2025-09-16 11:47:40'),
(78, 2, NULL, 'PUT', '/api/maintenance/2', 200, '2025-09-16 11:48:39'),
(79, 2, NULL, 'PUT', '/api/maintenance/2/status', 200, '2025-09-16 11:48:54'),
(80, 2, NULL, 'PUT', '/api/maintenance/2', 200, '2025-09-16 11:49:09'),
(81, 2, NULL, 'POST', '/api/maintenance', 201, '2025-09-16 11:52:46'),
(82, 2, NULL, 'DELETE', '/api/division-types/5', 204, '2025-09-16 12:06:56'),
(83, 2, NULL, 'DELETE', '/api/division-types/5', 204, '2025-09-16 12:07:02'),
(84, 2, NULL, 'POST', '/api/division-types', 201, '2025-09-16 12:07:58'),
(85, 2, NULL, 'DELETE', '/api/division-types/6', 204, '2025-09-16 12:08:03'),
(86, 2, NULL, 'POST', '/api/division-types', 201, '2025-09-16 12:08:16'),
(87, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:08:19'),
(88, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:08:46'),
(89, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:08:48'),
(90, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:09:05'),
(91, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:09:07'),
(92, 2, NULL, 'DELETE', '/api/division-types/7', 204, '2025-09-16 12:09:52'),
(93, 2, 3, 'POST', '/api/divisions', 201, '2025-09-16 12:10:11'),
(94, 2, NULL, 'DELETE', '/api/divisions/7', 204, '2025-09-16 12:10:20'),
(95, 2, NULL, 'DELETE', '/api/divisions/7', 204, '2025-09-16 12:10:41'),
(96, 2, 6, 'POST', '/api/machines', 201, '2025-09-16 12:11:00'),
(97, 2, 9, 'DELETE', '/api/machines/5', 204, '2025-09-16 12:11:06'),
(98, 2, 6, 'POST', '/api/machines', 400, '2025-09-16 12:11:43'),
(99, 2, 6, 'POST', '/api/machines', 201, '2025-09-16 12:11:59'),
(100, 2, 9, 'DELETE', '/api/machines/6', 204, '2025-09-16 12:12:07'),
(101, 2, 6, 'POST', '/api/machines', 201, '2025-09-23 05:12:48'),
(102, 2, NULL, 'PUT', '/api/maintenance/3/status', 200, '2025-09-23 05:54:30'),
(103, 2, NULL, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-23 06:50:45'),
(104, 2, 6, 'POST', '/api/machines', 201, '2025-09-23 07:05:15'),
(105, 2, 6, 'POST', '/api/machines', 201, '2025-09-23 07:05:48'),
(106, 2, 6, 'POST', '/api/machines', 201, '2025-09-23 07:06:04'),
(107, 2, 6, 'POST', '/api/machines', 201, '2025-09-23 07:06:26'),
(108, 2, NULL, 'PATCH', '/api/breakdowns/2/assign', 200, '2025-09-23 07:40:26'),
(109, 2, NULL, 'PUT', '/api/notifications/1/read', 500, '2025-09-23 07:44:11'),
(110, 2, NULL, 'PUT', '/api/maintenance/3', 200, '2025-09-23 07:54:58'),
(111, 2, NULL, 'POST', '/api/maintenance', 201, '2025-09-23 07:56:27'),
(112, 2, NULL, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-23 08:13:39'),
(113, 2, NULL, 'PUT', '/api/notifications/9/read', 500, '2025-09-23 08:13:51'),
(114, 2, NULL, 'PATCH', '/api/breakdowns/1/assign', 200, '2025-09-23 08:19:21'),
(115, 2, 189, 'PUT', '/api/users/10/status', 200, '2025-09-23 10:03:32'),
(116, 10, 211, 'POST', '/api/machines', 201, '2025-09-23 10:05:42'),
(117, 10, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-23 10:06:48'),
(118, 10, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-23 10:07:01'),
(119, 2, 257, 'PUT', '/api/notifications/16/read', 500, '2025-09-23 10:07:44'),
(120, 2, 260, 'POST', '/api/maintenance', 201, '2025-09-24 13:52:19'),
(121, 2, 189, 'PUT', '/api/users/11/status', 200, '2025-09-24 13:56:30'),
(122, 11, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-24 13:57:57'),
(123, 11, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-24 13:58:16'),
(124, 2, 257, 'PUT', '/api/notifications/18/read', 500, '2025-09-24 13:58:40'),
(125, 2, 228, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-24 14:03:25'),
(126, 2, 228, 'PATCH', '/api/breakdowns/3/status', 200, '2025-09-24 14:03:45'),
(127, 2, 189, 'PUT', '/api/users/13/status', 200, '2025-09-24 14:43:44'),
(128, 13, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-24 14:46:22'),
(129, 13, 229, 'PATCH', '/api/breakdowns/3/assign', 200, '2025-09-24 14:46:34'),
(130, 2, 257, 'PUT', '/api/notifications/20/read', 500, '2025-09-24 14:46:53'),
(131, 3, 189, 'PUT', '/api/users/15/status', 200, '2025-10-17 09:00:39'),
(132, 15, 211, 'POST', '/api/machines', 400, '2025-10-17 10:05:33'),
(133, 15, 211, 'POST', '/api/machines', 400, '2025-10-17 10:06:08'),
(134, 15, 211, 'POST', '/api/machines', 201, '2025-10-17 10:10:11'),
(135, 15, 211, 'POST', '/api/machines', 201, '2025-10-17 10:12:22'),
(136, 15, 211, 'POST', '/api/machines', 201, '2025-10-17 10:23:10'),
(137, 15, 188, 'PUT', '/api/users/3', 200, '2025-10-17 11:20:13'),
(138, 15, 188, 'PUT', '/api/users/3', 200, '2025-10-17 11:20:53'),
(139, 15, 188, 'PUT', '/api/users/3', 200, '2025-10-17 11:21:18'),
(140, 15, 188, 'PUT', '/api/users/3', 200, '2025-10-17 11:22:15'),
(141, 15, 211, 'POST', '/api/machines', 201, '2025-10-17 15:43:06');

-- --------------------------------------------------------

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

--
-- Dumping data for table `breakdown_categories`
--

INSERT INTO `breakdown_categories` (`category_id`, `name`, `description`, `created_at`) VALUES
(1, 'Default', NULL, '2025-09-15 15:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `breakdown_comments`
--

CREATE TABLE `breakdown_comments` (
  `comment_id` int(11) NOT NULL,
  `breakdown_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_internal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `breakdown_comments`
--

INSERT INTO `breakdown_comments` (`comment_id`, `breakdown_id`, `user_id`, `comment`, `is_internal`, `created_at`) VALUES
(1, 3, 2, 'testing cmnt', 0, '2025-09-16 10:34:03');

-- --------------------------------------------------------

--
-- Table structure for table `breakdown_repairs`
--

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

INSERT INTO `breakdown_repairs` (`repair_id`, `breakdown_id`, `repair_title`, `repair_description`, `repair_type`, `parts_used`, `labor_hours`, `parts_cost`, `labor_cost`, `performed_by`, `started_at`, `completed_at`, `notes`, `created_at`, `updated_at`) VALUES
(1, 3, 'repair 1', 'hello world', 'replacement', 'nuts', 5.00, 20.00, 500.00, 2, NULL, NULL, NULL, '2025-09-16 11:12:12', '2025-09-16 11:12:12'),
(2, 3, 'second', 'hello world repair', 'replacement', '', 2.00, 10.00, 50.00, 2, NULL, NULL, NULL, '2025-09-16 11:13:09', '2025-09-16 11:13:09'),
(3, 3, 'ad', 'ada', 'replacement', '', 22.00, 10.00, 5.00, 2, NULL, NULL, NULL, '2025-09-16 11:28:09', '2025-09-16 11:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `breakdown_statuses`
--

CREATE TABLE `breakdown_statuses` (
  `status_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `breakdown_statuses`
--

INSERT INTO `breakdown_statuses` (`status_id`, `name`, `description`, `sort_order`, `created_at`) VALUES
(1, 'reported', NULL, 0, '2025-09-16 00:18:50'),
(2, 'on going', NULL, 0, '2025-09-16 00:20:25'),
(4, 'completed', NULL, 0, '2025-09-16 11:20:36');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `division_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `division_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`division_id`, `title`, `parent_id`, `division_type_id`) VALUES
(1, 'soup', NULL, 1),
(2, 'PC', NULL, 1),
(3, 'Shampoo', 2, 2),
(4, 'Napkins', NULL, 1),
(6, 'Pack Unit', 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `division_types`
--

CREATE TABLE `division_types` (
  `division_type_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `division_types`
--

INSERT INTO `division_types` (`division_type_id`, `title`) VALUES
(1, 'plant'),
(2, 'line'),
(4, 'unit');

-- --------------------------------------------------------

--
-- Table structure for table `kaizens`
--

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

--
-- Dumping data for table `kaizens`
--

INSERT INTO `kaizens` (`kaizen_id`, `title`, `description`, `problem_statement`, `proposed_solution`, `expected_benefits`, `implementation_plan`, `category_id`, `status_id`, `priority`, `submitted_by`, `assigned_to`, `machine_id`, `division_id`, `estimated_cost`, `estimated_savings`, `estimated_implementation_days`, `actual_cost`, `actual_savings`, `actual_implementation_days`, `submitted_at`, `assigned_at`, `started_at`, `completed_at`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, 'ad', 'ad', 'ada', 'ada', 'ad', 'ada', 1, 2, 'medium', 2, NULL, 3, 3, 3.00, 2.00, 22, NULL, NULL, NULL, '2025-09-16 12:19:29', NULL, NULL, NULL, NULL, '2025-09-16 12:19:29', '2025-09-16 12:31:39'),
(2, 'ad', 'ad', 'ada', 'ada', 'ad', 'ada', 1, 1, 'medium', 2, 3, 3, 3, 3.00, 2.00, 22, NULL, NULL, NULL, '2025-09-16 12:20:04', '2025-09-16 12:30:21', NULL, NULL, NULL, '2025-09-16 12:20:04', '2025-09-16 12:30:21'),
(3, 'da', 'aa', 'as', 'asa', 'sa', 'sa', 1, 2, 'low', 2, NULL, NULL, 4, 2.00, 3.00, 34, NULL, NULL, NULL, '2025-09-16 12:39:46', NULL, NULL, NULL, NULL, '2025-09-16 12:39:46', '2025-09-16 12:40:23');

-- --------------------------------------------------------

--
-- Table structure for table `kaizen_attachments`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `kaizen_categories`
--

CREATE TABLE `kaizen_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kaizen_categories`
--

INSERT INTO `kaizen_categories` (`category_id`, `name`, `description`, `created_at`) VALUES
(1, 'complains', NULL, '2025-09-15 13:45:53'),
(2, 'suggestions', NULL, '2025-09-16 12:13:32');

-- --------------------------------------------------------

--
-- Table structure for table `kaizen_comments`
--

CREATE TABLE `kaizen_comments` (
  `comment_id` int(11) NOT NULL,
  `kaizen_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_internal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kaizen_comments`
--

INSERT INTO `kaizen_comments` (`comment_id`, `kaizen_id`, `user_id`, `comment`, `is_internal`, `created_at`) VALUES
(1, 2, 2, 'hello world', 0, '2025-09-16 12:30:55'),
(2, 3, 2, 'zx', 1, '2025-09-16 12:44:03'),
(3, 3, 2, 'fs', 1, '2025-09-16 12:45:33');

-- --------------------------------------------------------

--
-- Table structure for table `kaizen_history`
--

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

--
-- Dumping data for table `kaizen_history`
--

INSERT INTO `kaizen_history` (`history_id`, `kaizen_id`, `user_id`, `action`, `old_status_id`, `new_status_id`, `notes`, `created_at`) VALUES
(1, 2, 2, 'assigned_to_user_3', NULL, NULL, 'asa', '2025-09-16 12:30:21'),
(2, 2, 2, 'comment_added', NULL, NULL, 'hello world', '2025-09-16 12:30:55'),
(3, 1, 2, 'status_change', 1, 2, '', '2025-09-16 12:31:39'),
(4, 3, 2, 'status_change', 1, 2, '', '2025-09-16 12:40:24'),
(5, 3, 2, 'comment_added', NULL, NULL, 'zx', '2025-09-16 12:44:03'),
(6, 3, 2, 'comment_added', NULL, NULL, 'fs', '2025-09-16 12:45:34');

-- --------------------------------------------------------

--
-- Table structure for table `kaizen_statuses`
--

CREATE TABLE `kaizen_statuses` (
  `status_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kaizen_statuses`
--

INSERT INTO `kaizen_statuses` (`status_id`, `name`, `description`, `sort_order`) VALUES
(1, 'pending', NULL, 0),
(2, 'Approved', NULL, 0),
(3, 'Declined', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

CREATE TABLE `machines` (
  `machine_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `division_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machines`
--

INSERT INTO `machines` (`machine_id`, `title`, `division_id`) VALUES
(2, 'filling machine', 3),
(3, 'carton machine', 3),
(7, 'Purifier', 4),
(8, 'Mixer', 3),
(9, 'Liquid Filler', 3),
(10, 'Stamper', 3),
(11, 'Labeling Machine', 3),
(12, 'filler', 4),
(13, 'AutoTest Machine 1760695809257', 4),
(14, 'AutoTest Machine 1760695939714', 4),
(15, 'AutoTest Machine 1760696588194', 4),
(16, 'AutoTest Machine 1760715783711', 4);

-- --------------------------------------------------------

--
-- Table structure for table `machine_breakdowns`
--

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

--
-- Dumping data for table `machine_breakdowns`
--

INSERT INTO `machine_breakdowns` (`breakdown_id`, `machine_id`, `title`, `description`, `category_id`, `status_id`, `severity`, `reported_by`, `assigned_to`, `estimated_downtime_hours`, `actual_downtime_hours`, `estimated_repair_cost`, `actual_repair_cost`, `breakdown_start_time`, `breakdown_end_time`, `reported_at`, `assigned_at`, `repair_started_at`, `repair_completed_at`, `verified_at`, `created_at`, `updated_at`) VALUES
(1, 3, 'Hello', 'Testing', 1, 4, 'high', 6, 2, 10.00, NULL, 5.00, NULL, '2025-09-23 08:19:13', NULL, '2025-09-15 15:19:09', '2025-09-23 08:19:13', NULL, '2025-09-16 11:25:45', NULL, '2025-09-15 15:19:09', '2025-09-23 08:19:13'),
(2, 3, 'aasda', 'aadsa', 1, 4, 'medium', 6, 2, 2.00, 25.54, 2.00, 20.00, '2025-09-23 07:40:24', '2025-09-16 11:23:39', '2025-09-15 15:22:08', '2025-09-23 07:40:24', NULL, '2025-09-16 11:23:42', NULL, '2025-09-15 15:22:08', '2025-09-23 07:40:24'),
(3, 3, 'sfcs', 'sfcs', 1, 2, 'high', 6, 2, 2.00, 5.00, 3.00, 55.00, '2025-09-24 14:46:28', '2025-09-16 11:19:18', '2025-09-15 15:26:10', '2025-09-24 14:46:28', NULL, '2025-09-24 14:03:24', NULL, '2025-09-15 15:26:10', '2025-09-24 14:46:28');

-- --------------------------------------------------------

--
-- Table structure for table `machine_maintenance`
--

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

--
-- Dumping data for table `machine_maintenance`
--

INSERT INTO `machine_maintenance` (`maintenance_id`, `machine_id`, `title`, `description`, `type`, `status`, `priority`, `scheduled_by`, `estimated_duration_hours`, `actual_duration_hours`, `estimated_cost`, `actual_cost`, `scheduled_date`, `due_date`, `started_at`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 3, 'oil chnage', 'hell world', 'preventive', 'completed', 'medium', 2, 5.00, 20.00, 10.00, 55.00, '2025-09-16 02:27:00', '2025-09-16 20:56:00', '2025-09-16 07:57:18', '2025-09-16 07:57:24', '2025-09-16 07:56:40', '2025-09-16 07:57:39'),
(2, 3, 'Anual Repair', 'this machine should have anual repair', 'preventive', 'scheduled', 'high', 2, 50.00, NULL, 2.00, NULL, '2025-09-16 06:18:00', '2025-09-23 00:47:00', NULL, NULL, '2025-09-16 11:47:40', '2025-09-16 11:49:08'),
(3, 2, 'Chnage Petrol', 'this machine old oil should be chnaged', 'preventive', 'in_progress', 'medium', 2, 5.00, NULL, 23.00, NULL, '2025-09-23 00:24:00', '2025-09-30 06:22:00', '2025-09-23 05:54:29', NULL, '2025-09-16 11:52:46', '2025-09-23 07:54:56'),
(4, 10, 'new maintenance', 'adding a new maintenance for testing', 'preventive', 'scheduled', 'medium', 2, 5.00, NULL, 20000.00, NULL, '2025-09-23 07:56:00', '2025-09-24 07:56:00', NULL, NULL, '2025-09-23 07:56:27', '2025-09-23 07:56:27'),
(5, 12, 'Engine oil change', 'after 5000 km the engine oil should be chnaged', 'preventive', 'scheduled', 'medium', 2, 3.00, NULL, 50000.00, NULL, '2025-09-24 15:53:00', '2025-09-25 13:51:00', NULL, NULL, '2025-09-24 13:52:15', '2025-09-24 13:52:15');

-- --------------------------------------------------------

--
-- Table structure for table `meters`
--

CREATE TABLE `meters` (
  `meter_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `machine_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

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

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `type`, `title`, `message`, `entity_type`, `entity_id`, `priority`, `is_read`, `read_at`, `created_at`) VALUES
(1, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #2', 'breakdown', 2, 'high', 1, '2025-09-23 07:44:10', '2025-09-23 07:40:25'),
(2, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-23 07:58:10', '2025-09-23 07:57:32'),
(3, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-23 07:58:10', '2025-09-23 07:57:40'),
(4, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-23 07:58:10', '2025-09-23 07:57:52'),
(5, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-23 07:58:10', '2025-09-23 07:58:00'),
(6, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 07:58:11'),
(7, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 07:58:20'),
(8, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 07:58:30'),
(9, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 1, '2025-09-23 08:13:50', '2025-09-23 08:13:33'),
(10, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #1', 'breakdown', 1, 'high', 1, '2025-09-24 14:02:59', '2025-09-23 08:19:15'),
(11, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 08:21:51'),
(12, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 08:22:00'),
(13, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 08:22:10'),
(14, 2, 'maintenance_reminder', 'Maintenance Reminder', 'Maintenance \"new maintenance\" for machine \"Stamper\" is scheduled for today.', 'maintenance', 4, 'medium', 1, '2025-09-24 14:02:59', '2025-09-23 08:22:20'),
(15, 9, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 0, NULL, '2025-09-23 10:06:43'),
(16, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 1, '2025-09-23 10:07:42', '2025-09-23 10:06:56'),
(17, 10, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 0, NULL, '2025-09-24 13:57:51'),
(18, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 1, '2025-09-24 13:58:39', '2025-09-24 13:58:11'),
(19, 7, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 0, NULL, '2025-09-24 14:46:16'),
(20, 2, 'breakdown_assigned', 'Breakdown Assigned', 'You have been assigned to repair breakdown #3', 'breakdown', 3, 'high', 1, '2025-09-24 14:46:52', '2025-09-24 14:46:29');

-- --------------------------------------------------------

--
-- Table structure for table `parameters`
--

CREATE TABLE `parameters` (
  `parameter_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value_type` enum('string','number','boolean') NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `meter_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `description`) VALUES
(187, 'user.list', NULL),
(188, 'user.update', NULL),
(189, 'user.status.update', NULL),
(190, 'user.role.update', NULL),
(191, 'user.analytics', NULL),
(192, 'user.delete', NULL),
(193, 'permission.add', NULL),
(194, 'permission.list', NULL),
(195, 'permission.delete', NULL),
(196, 'permission.assign', NULL),
(197, 'permission.revoke', NULL),
(198, 'role.list', NULL),
(199, 'role.view', NULL),
(200, 'role.create', NULL),
(201, 'role.update', NULL),
(202, 'role.delete', NULL),
(203, 'divisionType.add', NULL),
(204, 'divisionType.list', NULL),
(205, 'divisionType.update', NULL),
(206, 'divisionType.delete', NULL),
(207, 'division.add', NULL),
(208, 'division.list', NULL),
(209, 'division.update', NULL),
(210, 'division.delete', NULL),
(211, 'machine.add', NULL),
(212, 'machine.list', NULL),
(213, 'machine.update', NULL),
(214, 'machine.delete', NULL),
(215, 'meter.add', NULL),
(216, 'meter.list', NULL),
(217, 'meter.update', NULL),
(218, 'meter.delete', NULL),
(219, 'parameter.add', NULL),
(220, 'parameter.list', NULL),
(221, 'parameter.update', NULL),
(222, 'parameter.delete', NULL),
(223, 'breakdown.add', NULL),
(224, 'breakdown.list', NULL),
(225, 'breakdown.view', NULL),
(226, 'breakdown.update', NULL),
(227, 'breakdown.delete', NULL),
(228, 'breakdown.updateStatus', NULL),
(229, 'breakdown.assign', NULL),
(230, 'breakdown.startRepair', NULL),
(231, 'breakdown.completeRepair', NULL),
(232, 'breakdownCategory.add', NULL),
(233, 'breakdownCategory.list', NULL),
(234, 'breakdownCategory.view', NULL),
(235, 'breakdownCategory.update', NULL),
(236, 'breakdownCategory.delete', NULL),
(237, 'breakdownStatus.add', NULL),
(238, 'breakdownStatus.list', NULL),
(239, 'breakdownStatus.view', NULL),
(240, 'breakdownStatus.update', NULL),
(241, 'breakdownStatus.delete', NULL),
(242, 'breakdown.comment.add', NULL),
(243, 'breakdown.comment.list', NULL),
(244, 'breakdown.comment.view', NULL),
(245, 'breakdown.comment.update', NULL),
(246, 'breakdown.comment.delete', NULL),
(247, 'breakdown.repair.add', NULL),
(248, 'breakdown.repair.list', NULL),
(249, 'breakdown.repair.view', NULL),
(250, 'breakdown.repair.update', NULL),
(251, 'breakdown.repair.start', NULL),
(252, 'breakdown.repair.complete', NULL),
(253, 'breakdown.repair.delete', NULL),
(254, 'breakdown.analytics.view', NULL),
(255, 'notification.list', NULL),
(256, 'notification.view', NULL),
(257, 'notification.read', NULL),
(258, 'notification.delete', NULL),
(259, 'dashboard.view', NULL),
(260, 'maintenance.add', NULL),
(261, 'maintenance.list', NULL),
(262, 'maintenance.update', NULL),
(263, 'maintenance.delete', NULL),
(264, 'maintenance.status.update', NULL),
(265, 'kaizen.create', NULL),
(266, 'kaizen.view', NULL),
(267, 'kaizen.update', NULL),
(268, 'kaizen.delete', NULL),
(269, 'kaizen.assign', NULL),
(270, 'kaizen.approve', NULL),
(271, 'kaizen.comment', NULL),
(272, 'kaizen.view_all', NULL),
(273, 'kaizen.report', NULL),
(274, 'kaizen.manage', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`) VALUES
(7, 'engineer'),
(2, 'super.admin'),
(1, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 187),
(1, 204),
(1, 208),
(1, 212),
(1, 216),
(1, 220),
(1, 224),
(1, 225),
(1, 233),
(1, 238),
(1, 255),
(1, 256),
(1, 257),
(1, 259),
(1, 265),
(1, 266),
(7, 187),
(7, 188),
(7, 189),
(7, 190),
(7, 191),
(7, 192),
(7, 193),
(7, 194),
(7, 195),
(7, 196),
(7, 197),
(7, 198),
(7, 199),
(7, 200),
(7, 201),
(7, 202),
(7, 203),
(7, 204),
(7, 205),
(7, 206),
(7, 207),
(7, 208),
(7, 209),
(7, 210),
(7, 211),
(7, 212),
(7, 213),
(7, 214),
(7, 215),
(7, 216),
(7, 217),
(7, 218),
(7, 219),
(7, 220),
(7, 221),
(7, 222),
(7, 223),
(7, 224),
(7, 225),
(7, 226),
(7, 227),
(7, 228),
(7, 229),
(7, 230),
(7, 231),
(7, 232),
(7, 233),
(7, 234),
(7, 235),
(7, 236),
(7, 237),
(7, 238),
(7, 239),
(7, 240),
(7, 241),
(7, 242),
(7, 243),
(7, 244),
(7, 245),
(7, 246),
(7, 247),
(7, 248),
(7, 249),
(7, 250),
(7, 251),
(7, 252),
(7, 253),
(7, 254),
(7, 255),
(7, 256),
(7, 257),
(7, 258),
(7, 259),
(7, 260),
(7, 261),
(7, 262),
(7, 263),
(7, 264),
(7, 265),
(7, 266),
(7, 267),
(7, 268),
(7, 269),
(7, 270),
(7, 271),
(7, 272),
(7, 273),
(7, 274);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password_hash`, `role_id`, `status`, `profileImg`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'ramishka', 'Geenath', 'ramishkathennakoon@gmail.com', '$2b$10$JH3y6qWNHbWbto0i/FPS4uIbXVD6IOn9twa6UHPifqxT5dpr26lvC', 2, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-08-10 03:16:00', '2025-09-23 08:12:22', NULL),
(3, 'Gihan', 'Karunarathne', 'gihan@gmail.com', '$2b$10$9Q77Xq5aM87S/zDwv2YMAOhI1DUWd5VGAIXVQRuSI8DnMqOHyIutG', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-08-10 04:15:08', '2025-10-17 11:22:14', NULL),
(4, 'ramishka', 'thennakoon', 'test@gmail.com', '$2b$10$NXMDMckzyYSsIAtCvJlSTOdvnr4mCWJDlWWPxpK19JygDOa/Mdq6W', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-08-10 06:07:28', '2025-08-10 13:55:27', NULL),
(5, 'ramishka', 'Geenath', 'ramishkaa@gmail.com', '$2b$10$HRWPjpvhbFLq0gMDLlYMme3HPq4V91lMpVWebWyyKa8Y7lQkTIjzO', 1, 'deleted', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-08-10 06:17:46', '2025-08-10 14:19:56', NULL),
(6, 'Ramishka', 'Thennakoon', 'my@gmail.com', '$2b$10$I8YcEi5FYu6mVXogd1fDoOFNaraRKT/nsTdzgJYTi10NHANHfMSwO', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-15 11:47:29', '2025-09-15 11:58:37', NULL),
(7, 'a', 'a', 'd@gmail.com', '$2b$10$lURq/0AHbpHOf25arf3y5.Yb3jgs3INGOmfdKrU4zWDg6BzQaQTFS', 1, 'deleted', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-15 11:57:05', '2025-09-15 12:28:36', NULL),
(8, 'a', 'a', 'mya@gmail.com', '$2b$10$yI278IN8dKbbCEqdVeoGyOgauX.RlDVNrTIhNK3o9gEm70c2OaNsO', 1, 'deleted', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-15 11:57:30', '2025-09-15 12:28:38', NULL),
(9, 'a', 'a', 'adminaaadada@gmail.com', '$2b$10$3yXX30mxWh9abV5VLX2NvuNZ6aJ8ev56.hEVlMnsxqwUmAvODpi8C', 1, 'deleted', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-15 11:57:57', '2025-09-15 12:28:40', NULL),
(10, 'my', 'user', 'manthrawa@gmail.com', '$2b$10$eMCIeNwCHDrfP6I/YzGTk.s3.8hKJ0SY0BDV9nvVEPIk9kMgY9vdS', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-23 10:02:39', '2025-09-23 10:03:30', NULL),
(11, 'test', 'account1', 'alguidance.lk@gmail.com', '$2b$10$mQNewpWW1MElIf9pbJDnjOsOuZ6JOM/UXjxKuPkNOEuy0fuImRWdS', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-24 13:55:36', '2025-09-24 13:56:29', NULL),
(12, 'hello', 'world', 'hello@gmail.com', '$2b$10$58wp3SS2983XRcPfzKN9puLI6wWrp6Rt/oaxRdGMoTde9Qwm4v1eG', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-24 14:42:25', '2025-09-24 14:42:25', NULL),
(13, '1111', '1111', 'test1@gmail.com', '$2b$10$O0/YDZA5E/R1o5mLVdPlsuWuR9NIg9eOl4CGsk.2NfyxanCSsBD9S', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-09-24 14:43:00', '2025-09-24 14:43:43', NULL),
(14, 'Test', 'User', 'testuser_1760667011887@example.com', '$2b$10$Db4ZMfgOroLAdqRUuw1OCefrkVWcIPYQ.QyxcrM8YoqW7OteQlTFC', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 02:10:13', '2025-10-17 02:10:13', NULL),
(15, 'gihan', 'karuna', 'ramishka@gmail.com', '$2b$10$6KSha3owWfq0b7Cp4r2ifOyK5JjpoNDhm415BUCxoDPeKklDY4vBe', 1, 'verified', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 08:59:53', '2025-10-17 09:00:37', NULL),
(16, 'ramishka', 'Geenath', 'ramishka_1760698587414@gmail.com', '$2b$10$B4ylef0ETB6FZS4sa3rkUOVsOFv6rFjFGaQ6VdkjUrHMoltV8wBUG', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 10:56:28', '2025-10-17 10:56:28', NULL),
(17, 'ramishka', 'Geenath', 'ramishka_1760698839375@gmail.com', '$2b$10$Rgf33w6eiL7pcpZv6pJjQODNrTWhI05Lph3MlNJi17eBxjFIcS9LW', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:00:40', '2025-10-17 11:00:40', NULL),
(18, 'ramishka', 'Geenath', 'ramishka_1760699759037@gmail.com', '$2b$10$cBynAniQQivn.LpL84.R6e5OYqp7MF0wOi8oNeF0kiqcQ4SLtrM6S', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:15:59', '2025-10-17 11:15:59', NULL),
(19, 'ramishka', 'Geenath', 'ramishka_1760699829412@gmail.com', '$2b$10$6OQSd0/YJDhWXrurUkBl..v6BCu7wVdhiH3/FYIrRomBB2H.yLKv2', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:17:10', '2025-10-17 11:17:10', NULL),
(20, 'ramishka', 'Geenath', 'ramishka_1760699842882@gmail.com', '$2b$10$IaKc8JLCes4bIPwSi432LuQUNvlo5j2JH9jR12e96Dh.KM/dzkaN6', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:17:23', '2025-10-17 11:17:23', NULL),
(21, 'ramishka', 'Geenath', 'ramishka_1760700075838@gmail.com', '$2b$10$T6SOiXXDrPd0Uv3maqRkv.MdiH6V43X1/D.vchPOq5guk2wOEyROC', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:21:16', '2025-10-17 11:21:16', NULL),
(22, 'ramishka', 'Geenath', 'ramishka_1760700088494@gmail.com', '$2b$10$EwbRc6le8Np4pEkdrvtDSu4P3rONO/OcaBCIRNwZzM1u1m.DIYtpe', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:21:28', '2025-10-17 11:21:28', NULL),
(23, 'ramishka', 'Geenath', 'ramishka_1760700109923@gmail.com', '$2b$10$g6o9rA0Jk.mtL8WudFa.7emMVlYF4GFmV8YtPzxq0W/8hZXHsUimO', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:21:50', '2025-10-17 11:21:50', NULL),
(24, 'ramishka', 'Geenath', 'ramishka_1760700133294@gmail.com', '$2b$10$T7a7sk.HBRd91E3DdlA7b.ZfumJ9ywUPuZ7Wd.DBIkdz2wxKPFvz2', 1, 'pending', 'https://res.cloudinary.com/dftbkrs4f/image/upload/v1732101562/avatar2_d0vokh.png', '2025-10-17 11:22:13', '2025-10-17 11:22:13', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
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
