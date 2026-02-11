# Task Manager - Full Stack Application

A complete full-stack task management application built with React.js frontend, Node.js/Express backend, and MongoDB database.

## 🚀 Features

### Authentication
- User registration with secure password hashing (bcrypt)
- JWT-based authentication with secure token management
- Protected routes requiring authentication
- Profile management (view and update)

### Dashboard
- User profile display with name and email
- Task statistics overview (total, pending, in-progress, completed)
- Real-time task counts by status

### Task Management (CRUD)
- Create new tasks with title, description, priority, status, and due date
- View all tasks with detailed information
- Edit existing tasks
- Delete tasks with confirmation
- Tasks are user-specific (each user sees only their tasks)

### Search & Filter
- Search tasks by title or description
- Filter by status (all, pending, in-progress, completed)
- Filter by priority (all, low, medium, high)
- Sort by date (newest/oldest) or title

### UI/UX
- Responsive design for mobile, tablet, and desktop
- Clean, modern interface with TailwindCSS
- Toast notifications for success/error messages
- Loading states with spinners
- Smooth animations and transitions
- Form validation (client and server side)

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API configuration
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
│
├── docs/
│   ├── POSTMAN_COLLECTION.json   # API documentation
│   └── SCALING.md               # Production scaling guide
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Server-side validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updateprofile` | Update user profile | Private |

### Task Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks (with filters) | Private |
| POST | `/api/tasks` | Create new task | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| GET | `/api/tasks/stats` | Get task statistics | Private |

### Query Parameters (GET /api/tasks)

| Parameter | Values | Description |
|-----------|--------|-------------|
| status | pending, in-progress, completed | Filter by status |
| priority | low, medium, high | Filter by priority |
| search | string | Search in title/description |
| sort | newest, oldest, title, priority | Sort order |

---

## 📝 Usage

### 1. Registration
- Navigate to `/signup`
- Enter your name, email, and password
- Click "Create Account"

### 2. Login
- Navigate to `/login`
- Enter your email and password
- Click "Sign In"

### 3. Dashboard
- View your profile information
- See task statistics at a glance
- Use filters to find specific tasks
- Click "Add Task" to create a new task

### 4. Managing Tasks
- **Create:** Click "Add Task", fill in the form, click "Create"
- **Edit:** Click "Edit" on any task, modify details, click "Update"
- **Delete:** Click "Delete" on any task, confirm deletion
- **Filter:** Use dropdowns to filter by status/priority
- **Search:** Type in the search box to find tasks

---

## 🔒 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt (10 salt rounds)
- **JWT Authentication:** Secure token-based authentication
- **Protected Routes:** Backend middleware verifies JWT tokens
- **Server-Side Validation:** Input validation on all endpoints
- **CORS Configuration:** Restricted to frontend origin
- **Secure Headers:** Express.js security best practices

---

## 📦 Postman Collection

Import the Postman collection from `docs/POSTMAN_COLLECTION.json` to test all API endpoints.

To import:
1. Open Postman
2. Click "Import"
3. Select the JSON file
4. Configure the `baseUrl` and `token` variables

---

## 📈 Production Scaling

For information on scaling this application for production use, see [SCALING.md](docs/SCALING.md).

Topics covered:
- Frontend optimizations (lazy loading, caching)
- Backend scaling strategies
- Database scaling options
- Authentication improvements
- Monitoring and observability
- Infrastructure architecture

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] View dashboard after login
- [ ] Create new task
- [ ] Edit existing task
- [ ] Delete task with confirmation
- [ ] Search tasks
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Sort tasks
- [ ] Logout functionality
- [ ] Access protected route without login (should redirect)
- [ ] Responsive design on mobile/tablet

---

## 🤝 Contributing

This is a demonstration project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

