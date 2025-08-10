# Arvyax Wellness Session Platform

This is a full-stack application built for the Arvyax Full Stack Internship Assignment. It is a secure, scalable, and interactive platform that allows users to register, log in, view public wellness sessions, and manage their own custom sessions with features like drafts, publishing, and real-time status updates.

---

### ✨ Live Demo

*[[Link to your deployed application (e.g., on Vercel, Netlify, or Render](https://arvyax-phi.vercel.app/dashboard))]*

---

## ✅ Features Implemented

### Core Functionality
-   **Secure User Authentication**: Full registration and login flow using JWT for secure authentication. Passwords are fully hashed using `bcrypt`.
-   **JWT Handling**: Tokens are securely stored on the client-side in both `localStorage` and cookies, and sent with protected requests.
-   **Protected Routes**: Backend middleware protects sensitive routes, ensuring only authenticated users can access or modify their own content.
-   **Session Management**: Full CRUD (Create, Read, Update, Delete) functionality for wellness sessions.
-   **Draft & Publish System**: Users can save sessions as drafts and publish them when they are ready, making them publicly visible.

### Bonus & Advanced Features
-   **Auto-Save in Editor**: The session editor automatically saves a draft 2 seconds after the user stops typing, with clear UI feedback.
-   **Live Session Status**: Users can set their published sessions to "Live," which displays a blinking indicator on the main dashboard.
-   **Session Analytics**: The platform tracks and displays the number of views for each session.
-   **User Profile Management**: A dedicated page where users can view their email and update their name.
-   **Search & Filter**: The main dashboard includes a real-time search bar to filter sessions by title or tags.
-   **Image Uploads**: Users can upload a cover image for their sessions via Cloudinary, which is displayed on the dashboard.
-   **Copy to Clipboard**: A user-friendly feature to easily copy a session's JSON URL.
-   **Forgot Password Flow**: A complete password reset flow, including token generation and email sending via Nodemailer.
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
| **Image Hosting** | Cloudinary                                |
| **Emailing** | Nodemailer                                    |
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
-   A Cloudinary account (for image hosting)
-   A Gmail account with an "App Password" (for the forgot password feature)

### 1. Backend Setup

First, navigate to the backend directory and install the required dependencies.

```bash
cd backend
npm install
```

Next, create a `.env` file in the `/backend` directory. Copy the contents of `.env.example` into this new file and fill in your environment variables.

**.env.example**
```
# MongoDB Connection String
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/yourDatabaseName?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=yourSuperSecretKeyForSigningTokens

# Port for the server
PORT=5000

# Cloudinary Credentials (from your Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer Credentials (use a Gmail App Password, not your regular password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password
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
    The server should now be running on `http://localhost:5000`.

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
| `POST`    | `/auth/forgot-password`          | Send a password reset email.              | No        |
| `POST`    | `/auth/reset-password/:token`    | Reset a user's password with a valid token.| No        |
| **User** |                                  |                                           |           |
| `GET`     | `/user/profile`                  | Get the current user's profile.           | Yes       |
| `PUT`     | `/user/profile`                  | Update the current user's profile.        | Yes       |
| **Sessions**|                                |                                           |           |
| `GET`     | `/session/sessions`              | Get all **published** sessions.           | No        |
| `POST`    | `/session/sessions/:id/view`     | Increment the view count of a session.    | No        |
| `POST`    | `/session/upload-image`          | Upload a cover image for a session.       | Yes       |
| `GET`     | `/session/my-sessions`           | Get all sessions owned by the user.       | Yes       |
| `GET`     | `/session/my-sessions/:id`       | Get a single session owned by the user.   | Yes       |
| `POST`    | `/session/my-sessions/save-draft`| Create or update a session as a draft.    | Yes       |
| `POST`    | `/session/my-sessions/publish`   | Create or update and publish a session.   | Yes       |
| `DELETE`  | `/session/my-sessions/:id`       | Delete a session owned by the user.       | Yes       |
| `PATCH`   | `/session/my-sessions/:id/live`  | Toggle the "live" status of a session.    | Yes       |

---

## 🔮 Future Plans

The current platform provides a robust foundation. Future development could include:

-   **Real-Time Chat for Live Sessions**: Integrate WebSockets (using a library like Socket.IO) to allow users to chat in real-time during a "Live" session, enhancing engagement.
-   **Payment API Integration**: Introduce paid sessions by integrating a payment gateway like Stripe or Razorpay, allowing hosts to monetize their content.
