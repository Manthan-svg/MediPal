# MediPal Backend

A Node.js/Express backend for managing user health routines, medication schedules, and profiles. This backend provides RESTful APIs for user authentication, health tracking, medication reminders, and dashboard analytics.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Key Concepts & Architecture](#key-concepts--architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
MediPal Backend is designed to:
- Register and authenticate users
- Manage user profiles
- Track daily health routines (water, exercise, sleep, steps, meditation)
- Manage medication schedules and reminders
- Provide dashboard analytics for users

---

## Folder Structure
```
Backend/
  ├── app.js                  # Main Express app setup
  ├── server.js               # Server entry point
  ├── config/
  │   └── dbConnection.config.js   # MongoDB connection logic
  ├── controllers/            # Route handler logic
  ├── dao/                    # Data access logic
  ├── middlewares/            # Express middlewares (e.g., auth)
  ├── models/                 # Mongoose schemas/models
  ├── routes/                 # API route definitions
  ├── utlis/                  # Utilities (e.g., schedulers, validation)
  ├── package.json            # Project metadata & dependencies
  └── Readme.md               # Project documentation
```

---

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd MediPal/Backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `Backend/` directory with the following:
     ```env
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET_KEY=<your-jwt-secret>
     ```

---

## Running the Server
```bash
node server.js
```
The server will start on port `5000` by default.

---

## API Overview
### Authentication
- `POST /users/register` — Register a new user
- `POST /users/login` — Login and receive JWT

### Profile
- `POST /profile/getProfile` — Get user profile (auth required)
- `PUT /profile/updateProfile` — Update user profile (auth required)

### Health Routine
- `POST /health/createHealthRoutine` — Create daily health routine (auth required)
- `PUT /health/updateHealthRoutine` — Update health routine (auth required)
- `POST /health/getHealthRoutine` — Get health routine history (auth required)
- `POST /health/getHealthLog/:date` — Get health log for a specific date (auth required)

### Medication
- `POST /medication/addNewMedication` — Add new medication (auth required)
- `PUT /medication/updateMedication` — Update medication (auth required)
- `POST /medication/getAllMedication` — Get all medications (auth required)
- `DELETE /medication/deleteMedication/:medicationId` — Delete medication (auth required)
- `PATCH /medication/markAsTaken/:medicationId` — Mark medication as taken (auth required)
- `POST /medication/getMedicationLog/:date` — Get medication log for a date (auth required)

### Dashboard
- `POST /dashboard/getTodayHealthDashboard/:userId` — Get today's health dashboard (auth required)

---

## Key Concepts & Architecture
### 1. **Authentication & Authorization**
- Uses JWT for stateless authentication.
- `authMiddleware` protects routes, verifies tokens, and attaches user info to requests.

### 2. **Database**
- MongoDB with Mongoose ODM.
- Models:
  - **User**: Stores user info, hashed passwords, JWT methods.
  - **HealthRoutine**: Tracks daily health metrics per user.
  - **Medication**: Stores medication schedules, reminders, and logs.

### 3. **Validation**
- Uses `express-validator` for request validation.
- Centralized validation error handling in `utlis/validationResult.util.js`.

### 4. **Reminders & Scheduling**
- Uses `node-cron` to check medication schedules every minute.
- Prints reminders to the console (can be extended to notifications).

### 5. **Controllers & DAO**
- Controllers handle request/response logic.
- DAO (Data Access Objects) abstract database operations for modularity.

---

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a Pull Request

---

## License
This project is licensed under the ISC License.
