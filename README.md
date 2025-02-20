# Participant Dashboard Backend API

A comprehensive backend system for managing event participants, schedules, announcements, and progress tracking.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Organizer/Participant)
  - Secure password hashing

- **Event Management**
  - Create, read, update events
  - Task management within events
  - Participant registration
  - Progress tracking

- **Real-time Announcements**
  - Priority-based announcements
  - Real-time updates using Socket.io
  - Read status tracking

- **Progress Tracking**
  - Task completion tracking
  - Event progress status
  - Detailed progress analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Input Validation**: validator.js

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd participant-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following configurations:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/participant-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3001
   ```

4. **Database Seeding (Optional)**
   ```bash
   npm run seed
   ```
   This will create test data including:
   - 20 organizers
   - 100 participants
   - 50 events
   - 100 announcements

5. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔒 Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Documentation

Detailed API documentation can be found in [API_DOCS.md](./docs/API_DOCS.md)

## 🧪 Testing

```bash
# Run tests
npm test
```

## 🔌 WebSocket Events

The server emits the following Socket.io events:

- `newAnnouncement`: When a new announcement is created
- `eventUpdate`: When an event is updated
- `progressUpdate`: When a participant's progress is updated

## 👥 User Roles

1. **Organizer**
   - Create and manage events
   - Create announcements
   - View participant progress
   - Access all endpoints

2. **Participant**
   - Register for events
   - View announcements
   - Update task progress
   - Limited access to endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contact

For any queries regarding the API, please contact the backend team.
