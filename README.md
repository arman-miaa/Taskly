Got it! Here's the updated README with everything organized in a single block:

```markdown
# Taskly

Taskly is a task management application that allows users to create, organize, and manage tasks efficiently. It offers a drag-and-drop interface, real-time updates, and user authentication.

## Live Links
- **Client**: [Taskly Client](https://taskly1.netlify.app/)
- **Server**: [Taskly Server](https://taskly-server-one.vercel.app)

## Description
Taskly is a task management tool built with real-time synchronization, a drag-and-drop interface, and user authentication. Users can add, edit, delete, and organize tasks in categories, with changes being instantly reflected across all devices using WebSockets (via socket.io).

## Technologies Used
- **Frontend**:
  - React.js
  - Vite.js
  - Tailwind CSS
  - React Router
  - Firebase Authentication
  - Socket.io (for real-time updates)
  - React Icons
  - SweetAlert2
  - Axios
  - UUID
- **Backend**:
  - Express.js
  - MongoDB (for storing user data and tasks)
  - Socket.io (for real-time updates)
  - JWT Authentication
  - Cookie-Parser
  - Dotenv
  - Nodemon (for development)

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/arman-miaa/Taskly.git
   ```

2. Navigate to the `taskly-server` directory:
   ```bash
   cd taskly-server
   ```

3. Install the server dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the `taskly-server` folder and add your MongoDB connection string and other required environment variables.

5. Start the server:
   ```bash
   npm start
   ```

6. Navigate to the `taskly-client` directory:
   ```bash
   cd taskly-client
   ```

7. Install the client dependencies:
   ```bash
   npm install
   ```

8. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- **User Authentication**: Firebase authentication for secure sign-in.
- **Task Management**: Add, edit, delete, and categorize tasks.
- **Drag-and-Drop Interface**: Easily organize tasks by dragging them between categories.
- **Real-Time Updates**: Changes to tasks are immediately reflected for all users using WebSockets.
- **Responsive Design**: Works seamlessly across devices (mobile, tablet, desktop).

## Contributing
Feel free to fork the repository, create issues, and submit pull requests. All contributions are welcome!

## License
This project is licensed under the MIT License.
```

This version has everything in a single block for you to paste directly into your `README.md` file.