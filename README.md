# Arvyax Wellness Session Platform

This is a full-stack application built for the Arvyax Full Stack Internship Assignment. It is a secure, scalable, and interactive platform that allows users to register, log in, view public wellness sessions, and manage their own custom sessions with features like drafts, publishing, and real-time status updates.

---

### ✨ Live Demo

*[[Link to your deployed application](https://arvyax-ten.vercel.app/dashboard)]*

---

## ✅ Features Implemented

### Core Functionality
-   **Secure User Authentication**: Full registration and login flow using JWT for secure authentication. Passwords are fully hashed using `bcrypt`.
-   **JWT Handling**: Tokens are securely stored on the client-side and sent with protected requests.
-   **Protected Routes**: Backend middleware protects sensitive routes, ensuring only authenticated users can access or modify their own content.
-   **Session Management**: Full CRUD (Create, Read, Update, Delete) functionality for wellness sessions.
-   **Draft & Publish System**: Users can save sessions as drafts and publish them when they are ready, making them publicly visible.

### Bonus & Advanced Features
-   **Auto-Save in Editor**: The session editor automatically saves a draft 2 seconds after the user stops typing, with clear UI feedback.
-   **Live Session Status**: Users can set their published sessions to "Live," which displays a blinking indicator on the main dashboard.
-   **Session Analytics**: The platform tracks and displays the number of views for each session.
-   **User Profile Management**: A dedicated page where users can view their email and update their name.
-   **Search & Filter**: The main dashboard includes a real-time search bar to filter sessions by title or tags.
-   **Copy to Clipboard**: A user-friendly feature to easily copy a session's JSON URL.
-   **Responsive UI**: The entire application, including the navigation bar, is fully responsive and optimized for mobile devices.
-   **User Feedback**: The application provides clear feedback for all actions using toast notifications for success, error, and informational messages.

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
| :------------ | :-------------------------------------------- |
| **Frontend** | React.js, TypeScript, Vite, React Router      |
| **Backend** | Node.js, Express.js                           |
| **Database** | MongoDB (with Mongoose)                       |
| **Styling** | Tailwind CSS                                  |
| **Icons** | Lucide React                                  |
| **Auth** | JSON Web Tokens (JWT), bcrypt                 |
| **Utilities** | Axios, js-cookie, lodash.debounce, jwt-decode |

---

## 📂 Project Structure

The repository is organized into two main folders:

-   `/frontend`: Contains the complete React.js client-side application.
-   `/backend`: Contains the Node.js, Express, and MongoDB server-side application.

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   MongoDB (A free MongoDB Atlas account is recommended)

### 1. Backend Setup

First, navigate to the backend directory and install the required dependencies.

```bash
cd backend
npm install
```

Next, create a `.env` file in the `/backend` directory. Copy the contents of `.env.example` into this new file and fill in your environment variables.

**.env.example**
```
# MongoDB Connection String (replace with your own)
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/yourDatabaseName?retryWrites=true&w=majority

# JWT Secret Key (can be any long, random string)
JWT_SECRET=yourSuperSecretKeyForSigningTokens

# Port for the server to run on (optional, defaults to 5000)
PORT=5000
```

### 2. Frontend Setup

In a new terminal, navigate to the frontend directory and install its dependencies.

```bash
cd frontend
npm install
```

The frontend is configured to connect to the backend server at `http://localhost:5000`.

### 3. Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the /backend directory
    npm start
    ```
    The server should now be running on `http://localhost:5000` (or the port you specified).

2.  **Start the Frontend Development Server:**
    ```bash
    # From the /frontend directory
    npm run dev
    ```
    The React application will open in your browser, usually at `http://localhost:5173`.

---

## 📝 API Endpoints Documentation

All API routes are prefixed with `/api`.

| Method    | Endpoint                         | Description                               | Protected |
| :-------- | :------------------------------- | :---------------------------------------- | :-------- |
| **Auth** |                                  |                                           |           |
| `POST`    | `/auth/register`                 | Register a new user.                      | No        |
| `POST`    | `/auth/login`                    | Log in a user and receive a JWT.          | No        |
| **User** |                                  |                                           |           |
| `GET`     | `/user/profile`                  | Get the current user's profile.           | Yes       |
| `PUT`     | `/user/profile`                  | Update the current user's profile.        | Yes       |
| **Sessions**|                                |                                           |           |
| `GET`     | `/session/sessions`              | Get all **published** sessions.           | No        |
| `POST`    | `/session/sessions/:id/view`     | Increment the view count of a session.    | No        |
| `GET`     | `/session/my-sessions`           | Get all sessions owned by the user.       | Yes       |
| `GET`     | `/session/my-sessions/:id`       | Get a single session owned by the user.   | Yes       |
| `POST`    | `/session/my-sessions/save-draft`| Create or update a session as a draft.    | Yes       |
| `POST`    | `/session/my-sessions/publish`   | Create or update and publish a session.   | Yes       |
| `DELETE`  | `/session/my-sessions/:id`       | Delete a session owned by the user.       | Yes       |
| `PATCH`   | `/session/my-sessions/:id/live`  | Toggle the "live" status of a session.    | Yes       |
