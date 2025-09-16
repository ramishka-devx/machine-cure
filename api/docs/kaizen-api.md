# Kaizen API Documentation

## Overview
The Kaizen API provides endpoints for managing continuous improvement suggestions in the machine management system. Kaizens can be linked to specific machines or divisions and track the entire lifecycle from submission to completion.

## Base URL
```
/api/kaizens
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Categories and Statuses

#### Get Kaizen Categories
```http
GET /api/kaizens/categories
```
**Permission Required:** `kaizen.view`

**Response:**
```json
[
  {
    "category_id": 1,
    "name": "Equipment Improvement",
    "description": "Ideas to improve machine performance, efficiency, or reliability",
    "created_at": "2025-09-15T00:00:00.000Z"
  }
]
```

#### Get Kaizen Statuses
```http
GET /api/kaizens/statuses
```
**Permission Required:** `kaizen.view`

**Response:**
```json
[
  {
    "status_id": 1,
    "name": "Submitted",
    "description": "Kaizen has been submitted and is awaiting review",
    "sort_order": 1
  }
]
```

### 2. CRUD Operations

#### Create Kaizen
```http
POST /api/kaizens
```
**Permission Required:** `kaizen.create`

**Request Body:**
```json
{
  "title": "Reduce Machine Downtime",
  "description": "Implement predictive maintenance to reduce unexpected machine failures",
  "problem_statement": "Machine XYZ experiences frequent unexpected downtime",
  "proposed_solution": "Install vibration sensors and implement predictive maintenance",
  "expected_benefits": "Reduce downtime by 40%",
  "implementation_plan": "1. Purchase sensors 2. Install system",
  "category_id": 1,
  "priority": "high",
  "machine_id": 1,
  "division_id": 1,
  "estimated_cost": 5000.00,
  "estimated_savings": 15000.00,
  "estimated_implementation_days": 30
}
```

#### Get All Kaizens
```http
GET /api/kaizens?page=1&limit=10&status_id=1&category_id=1&priority=high&q=search
```
**Permission Required:** `kaizen.view`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status_id` (optional): Filter by status
- `category_id` (optional): Filter by category
- `submitted_by` (optional): Filter by submitter
- `assigned_to` (optional): Filter by assignee
- `machine_id` (optional): Filter by machine
- `division_id` (optional): Filter by division
- `priority` (optional): Filter by priority (low, medium, high, critical)
- `q` (optional): Search in title and description

#### Get Kaizen by ID
```http
GET /api/kaizens/{kaizen_id}
```
**Permission Required:** `kaizen.view`

#### Update Kaizen
```http
PATCH /api/kaizens/{kaizen_id}
```
**Permission Required:** `kaizen.update`

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "actual_cost": 4200.00,
  "actual_savings": 16000.00,
  "actual_implementation_days": 25
}
```

#### Delete Kaizen
```http
DELETE /api/kaizens/{kaizen_id}
```
**Permission Required:** `kaizen.delete`

### 3. Status Management

#### Update Kaizen Status
```http
PATCH /api/kaizens/{kaizen_id}/status
```
**Permission Required:** `kaizen.approve`

**Request Body:**
```json
{
  "status_id": 3,
  "notes": "Approved for implementation after management review"
}
```

### 4. Assignment

#### Assign Kaizen to User
```http
PATCH /api/kaizens/{kaizen_id}/assign
```
**Permission Required:** `kaizen.assign`

**Request Body:**
```json
{
  "assigned_to": 2,
  "notes": "Assigned to John Doe for implementation"
}
```

### 5. Comments

#### Get Kaizen Comments
```http
GET /api/kaizens/{kaizen_id}/comments
```
**Permission Required:** `kaizen.view`

#### Add Comment
```http
POST /api/kaizens/{kaizen_id}/comments
```
**Permission Required:** `kaizen.comment`

**Request Body:**
```json
{
  "comment": "This looks promising. Let's proceed with pilot testing.",
  "is_internal": false
}
```

### 6. History and Analytics

#### Get Kaizen History
```http
GET /api/kaizens/{kaizen_id}/history
```
**Permission Required:** `kaizen.view`

#### Get Statistics
```http
GET /api/kaizens/stats
```
**Permission Required:** `kaizen.report`

**Response:**
```json
{
  "byStatus": [
    {"name": "Submitted", "count": 15},
    {"name": "In Progress", "count": 8}
  ],
  "savings": {
    "estimated_total": 125000.00,
    "actual_total": 98000.00
  },
  "topCategories": [
    {"name": "Equipment Improvement", "count": 12}
  ]
}
```

## Kaizen Lifecycle

1. **Submitted** - Employee submits improvement idea
2. **Under Review** - Management evaluates the suggestion
3. **Approved** - Kaizen approved for implementation
4. **In Progress** - Implementation underway
5. **Testing** - Testing the implemented improvement
6. **Completed** - Successfully implemented
7. **On Hold** - Temporarily paused
8. **Rejected** - Not approved
9. **Cancelled** - Cancelled during process

## Priority Levels
- `low` - Minor improvements
- `medium` - Standard improvements
- `high` - Important improvements
- `critical` - Safety or urgent improvements

## Permissions

- `kaizen.create` - Submit new kaizen suggestions
- `kaizen.view` - View kaizen suggestions
- `kaizen.update` - Update kaizen details
- `kaizen.delete` - Delete kaizen suggestions
- `kaizen.assign` - Assign kaizens to users
- `kaizen.approve` - Approve/reject kaizens and change status
- `kaizen.comment` - Add comments to kaizens
- `kaizen.view_all` - View all kaizens across divisions
- `kaizen.report` - Generate reports and view statistics
- `kaizen.manage` - Full kaizen management permissions

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```