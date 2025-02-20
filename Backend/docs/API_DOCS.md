# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "participant"  // "participant" or "organizer"
}

Response (200 OK):
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "user": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "participant"
        },
        "token": "jwt_token"
    }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securepassword123"
}

Response (200 OK):
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "participant"
        },
        "token": "jwt_token"
    }
}
```

## Events

### Get All Events
```http
GET /events
Authorization: Bearer <jwt_token>

Response (200 OK):
{
    "success": true,
    "data": {
        "events": [
            {
                "id": "event_id",
                "title": "Hackathon 2025",
                "description": "Annual coding competition",
                "startDate": "2025-03-01T10:00:00Z",
                "endDate": "2025-03-02T18:00:00Z",
                "location": "Virtual",
                "capacity": 100,
                "tasks": [
                    {
                        "id": "task_id",
                        "title": "Project Submission",
                        "description": "Submit your project",
                        "dueDate": "2025-03-02T12:00:00Z",
                        "points": 50
                    }
                ],
                "participants": ["user_id1", "user_id2"]
            }
        ]
    }
}
```

### Get Single Event
```http
GET /events/:eventId
Authorization: Bearer <jwt_token>

Response (200 OK):
{
    "success": true,
    "data": {
        "event": {
            "id": "event_id",
            "title": "Hackathon 2025",
            // ... other event details
        }
    }
}
```

### Create Event (Organizer Only)
```http
POST /events
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "New Hackathon",
    "description": "Description of the event",
    "startDate": "2025-04-01T10:00:00Z",
    "endDate": "2025-04-02T18:00:00Z",
    "location": "Virtual",
    "capacity": 100,
    "tasks": [
        {
            "title": "Task 1",
            "description": "Description of task 1",
            "dueDate": "2025-04-01T23:59:59Z",
            "points": 10
        }
    ]
}

Response (201 Created):
{
    "success": true,
    "message": "Event created successfully",
    "data": {
        "event": {
            // Created event details
        }
    }
}
```

### Update Event (Organizer Only)
```http
PUT /events/:eventId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "Updated Title",
    // ... other fields to update
}

Response (200 OK):
{
    "success": true,
    "message": "Event updated successfully",
    "data": {
        "event": {
            // Updated event details
        }
    }
}
```

## Announcements

### Get All Announcements
```http
GET /announcements
Authorization: Bearer <jwt_token>

Response (200 OK):
{
    "success": true,
    "data": {
        "announcements": [
            {
                "id": "announcement_id",
                "title": "Important Update",
                "content": "Announcement content",
                "priority": "high",
                "eventId": "event_id",
                "createdAt": "2025-02-20T10:00:00Z"
            }
        ]
    }
}
```

### Create Announcement (Organizer Only)
```http
POST /announcements
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "title": "New Announcement",
    "content": "Announcement content",
    "priority": "high",  // "high", "medium", or "low"
    "eventId": "event_id"  // Optional, if related to specific event
}

Response (201 Created):
{
    "success": true,
    "message": "Announcement created successfully",
    "data": {
        "announcement": {
            // Created announcement details
        }
    }
}
```

## Progress Tracking

### Get User Progress
```http
GET /progress
Authorization: Bearer <jwt_token>

Response (200 OK):
{
    "success": true,
    "data": {
        "progress": [
            {
                "eventId": "event_id",
                "tasks": [
                    {
                        "taskId": "task_id",
                        "status": "completed",
                        "completedAt": "2025-02-20T15:30:00Z"
                    }
                ],
                "totalPoints": 50,
                "completedPoints": 30
            }
        ]
    }
}
```

### Update Task Progress
```http
POST /progress/task/:taskId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "status": "completed"  // "not-started", "in-progress", or "completed"
}

Response (200 OK):
{
    "success": true,
    "message": "Progress updated successfully",
    "data": {
        "progress": {
            // Updated progress details
        }
    }
}
```

## WebSocket Events

### Connection
```javascript
// Connect to WebSocket
const socket = io('http://localhost:3001', {
    auth: {
        token: 'your_jwt_token'
    }
});

// Listen for events
socket.on('newAnnouncement', (announcement) => {
    // Handle new announcement
});

socket.on('eventUpdate', (event) => {
    // Handle event update
});

socket.on('progressUpdate', (progress) => {
    // Handle progress update
});
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
    "success": false,
    "message": "Validation error",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

### Authentication Error (401 Unauthorized)
```json
{
    "success": false,
    "message": "Invalid token or token expired"
}
```

### Authorization Error (403 Forbidden)
```json
{
    "success": false,
    "message": "You do not have permission to perform this action"
}
```

### Not Found Error (404 Not Found)
```json
{
    "success": false,
    "message": "Resource not found"
}
```

### Server Error (500 Internal Server Error)
```json
{
    "success": false,
    "message": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Best Practices

1. **Authentication**
   - Always store the JWT token securely
   - Include the token in the Authorization header for all protected routes
   - Handle token expiration and refresh appropriately

2. **Real-time Updates**
   - Implement proper error handling for WebSocket connections
   - Reconnect logic for dropped connections
   - Handle offline scenarios gracefully

3. **Error Handling**
   - Always check the `success` field in responses
   - Implement proper error handling for all API calls
   - Display user-friendly error messages

4. **Data Validation**
   - Validate all input data before sending to the API
   - Handle all possible API response scenarios
   - Implement proper form validation

## Testing

A Postman collection is available at `/docs/postman/participant-dashboard.json` for testing all API endpoints.
