const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server and initialize socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (for development)
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7argw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to check if ObjectId is valid
const isValidObjectId = (id) => ObjectId.isValid(id);

// Run function to handle database operations
async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const taskCollection = client.db("taskManagerDB").collection("tasks");

    // 🔹 **Socket.io: Handle Real-Time Connections**
    io.on("connection", (socket) => {
      console.log("⚡ A user connected");

      // Emit welcome message
      socket.emit("welcome", "Welcome to the task manager!");

      // Handle disconnect event
      socket.on("disconnect", () => {
        console.log("❌ User disconnected");
      });
    });

    // 🔹 **GET: Fetch All Tasks (Sorted by Date)**
    app.get("/task", async (req, res) => {
      try {
        const result = await taskCollection
          .find()
          .sort({ createdAt: -1 }) // Sort tasks by latest first
          .toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // 🔹 **POST: Add New Task**
    app.post("/task", async (req, res) => {
      try {
        const task = req.body;
        task.createdAt = new Date(); // Add creation date
        const result = await taskCollection.insertOne(task);
        io.emit("taskCreated", task); // Notify all clients
        res.send(result);
      } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // 🔹 **PUT: Update Task (Category, Title, etc.)**
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return res.status(400).send({ message: "Invalid task ID" });
      }

      try {
        const updatedTask = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedTask };

        const result = await taskCollection.updateOne(query, updateDoc);

        // If no task was updated, return a 404 error
        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Task not found" });
        }

        // Fetch updated task to emit full updated data
        const updatedData = await taskCollection.findOne(query);
        io.emit("taskUpdated", updatedData); // Notify all clients

        res.send(updatedData);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // 🔹 **DELETE: Remove Task**
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return res.status(400).send({ message: "Invalid task ID" });
      }

      try {
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Task not found" });
        }

        io.emit("taskDeleted", id); // Notify clients about deletion
        res.send({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
      
      
  } catch (error) {
    console.error("Error during MongoDB operation:", error);
    process.exit(1); // Exit the process if DB connection fails
  } finally {
    // Keep MongoDB connection open
    // await client.close();
  }
}

run().catch(console.dir);

// Basic route
app.get("/", (req, res) => {
  res.send("✅ Taskly server is running..");
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Taskly is running on port ${port}`);
});
