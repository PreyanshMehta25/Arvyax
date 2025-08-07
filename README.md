# Arvyax Wellness Session Platform

This is a full-stack application built for the Arvyax Full Stack Internship Assignment. It is a secure, scalable, and interactive platform that allows users to register, log in, view public wellness sessions, and manage their own custom sessions with features like drafts, publishing, and real-time status updates.

---

### ✨ Live Demo

🔗 **[View the Deployed App Here](https://arvyax-ten.vercel.app/dashboard)**  
🌐 https://arvyax-ten.vercel.app/dashboard

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
