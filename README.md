# Smart Chat Hub
Smart Chat Hub is a full-featured real-time chat application designed for instant and secure communication between users. Built with modern technologies, it aims to deliver a seamless and efficient user experience, emphasizing performance and scalability.

---

## ✨ Key Features

* **Real-time Messaging:** Instant sending and receiving of messages facilitated by Socket.IO.
* **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
* **Private Chats:** Dedicated one-on-one conversations between authenticated users.
* **Online/Offline Status:** Real-time display of user connection status.
* **Conversation History:** Automatic loading and display of previous messages when a conversation is selected.
* **Responsive Design:** Optimized layout and functionality across various devices (desktop, tablet, mobile).
* **Intuitive UI:** A clean and user-friendly interface for an excellent user experience.
* **AI Insights Panel (Optional):** A sidebar panel to display AI-powered analytics or insights related to conversations (if `AIInsightsPanel` component is implemented and functional).

---

## 🚀 Tech Stack

The project leverages a robust and modern technology stack to deliver its functionality:

### Frontend
* **Next.js:** A React framework for building full-stack web applications, offering performance optimizations and developer experience enhancements.
* **React:** A JavaScript library for building interactive user interfaces.
* **TypeScript:** A superset of JavaScript that adds static types, improving code quality and maintainability.
* **Tailwind CSS:** A utility-first CSS framework for rapid and flexible UI development.
* **Shadcn/ui:** A collection of re-usable components built with Tailwind CSS, providing a customizable UI foundation.
* **Socket.IO Client:** A JavaScript library for establishing and managing WebSocket connections from the client side.
* **`react-hot-toast`:** A simple and elegant library for displaying toast notifications.

### Backend
* **Node.js:** A JavaScript runtime environment for building scalable server-side applications.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js, used for building robust APIs.
* **Socket.IO Server:** A Node.js library that enables real-time, bidirectional, event-based communication.
* **PostgreSQL:** A powerful, open-source relational database management system, known for its reliability and feature set.
* **Prisma:** A next-generation ORM (Object-Relational Mapper) for Node.js and TypeScript, providing type-safe database access.
* **JWT (JSON Web Tokens):** Used for secure, stateless authentication and authorization.
* **Bcrypt:** A library used for hashing passwords securely.

---

## 🏗️ Project Architecture

Smart Chat Hub follows a modern decoupled architecture, separating the frontend and backend with a real-time communication channel.

* **Frontend (Next.js):**
    * Hosts the graphical user interface (UI).
    * Manages application state using React Hooks and the Context API.
    * Communicates with the Backend API for initial data fetching (e.g., user lists).
    * Utilizes the Socket.IO Client to establish a real-time connection with the server for sending/receiving messages and updating user online status.

* **Backend (Node.js/Express/Socket.IO):**
    * Handles the core business logic of the application.
    * Provides RESTful APIs for user authentication, registration, and managing conversations.
    * Employs the Socket.IO Server to manage WebSocket connections, broadcast real-time messages, and track connected/disconnected users.
    * Interacts with the PostgreSQL database via Prisma for secure storage and management of user and message data.

* **Database (PostgreSQL):**
    * Stores all user data (IDs, usernames, hashed passwords).
    * Maintains a complete log of all sent messages (sender\_id, receiver\_id, text, timestamp).

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites
Ensure you have the following installed:
* Node.js (v18.x or higher)
* npm or Yarn
* PostgreSQL (server running locally or accessible)

### 1. Clone the Repository
```bash
git clone <YOUR_PROJECT_REPO_URL>
cd smart-chat-hub
```

### 2. Backend Setup

```bash
cd backend # Navigate to the backend directory
npm install # or yarn install
```

* **Environment Variables (`.env`):**
    Create a `.env` file in the `backend/` directory and add the following variables:
    ```env
    DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"
    JWT_SECRET="YOUR_SUPER_SECRET_KEY" # Generate a strong, random key
    PORT=3001
    ```
    * Replace `YOUR_DB_USER`, `YOUR_DB_PASSWORD`, and `YOUR_DB_NAME` with your PostgreSQL database credentials.
    * `JWT_SECRET` should be a long, random string.

* **Database Migration:**
    Apply the Prisma migrations to create the necessary tables in your PostgreSQL database:
    ```bash
    npx prisma migrate dev --name init
    ```
    This command will create the `User` and `Message` tables based on your `prisma/schema.prisma` file.

* **Run the Backend Server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The backend server will start on `http://localhost:3001`.

### 3. Frontend Setup

```bash
cd ../frontend # Navigate back to the root, then into the frontend directory
npm install # or yarn install
```

* **Environment Variables (`.env.local`):**
    Create a `.env.local` file in the `frontend/` directory. For a Next.js client-side variable, you might need:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
    *(Note: Ensure your `io("http://localhost:3001")` calls use this variable or directly match the backend port.)*

* **Run the Frontend Development Server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will start on `http://localhost:3000`.

### 4. Access the Application
Open your web browser and navigate to `http://localhost:3000`.

---

# 🤝 (Contributing)
.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

##
---
