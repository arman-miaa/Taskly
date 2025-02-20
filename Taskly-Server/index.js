const express = require("express");
const cors = require("cors");
require("dotenv").config();



const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7argw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
      );
      
 const taskCollection = client.db("taskManagerDB").collection("tasks");

      
      app.get("/task", async (req, res) => {
          const result = await taskCollection.find().toArray();
          res.send(result);
      })

      app.post("/task", async (req, res) => {
          const task = req.body;
          console.log(task);
          const result = await taskCollection.insertOne(task);
          res.send(result) 
      })

app.put("/task/:id", async (req, res) => {
  try {
    const id = req.params.id; // Extract ID
    const updatedTask = req.body; // Get the update data
    const query = { _id: new ObjectId(id) };

    // Define the update operation
    const updateDoc = {
      $set: updatedTask,
    };

    // Update task in MongoDB
    const result = await taskCollection.updateOne(query, updateDoc);

    res.send(result);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

      
app.delete("/task/:id", async (req, res) => {
  try {
    const id = req.params.id; // Extract ID from URL params
    const query = { _id: new ObjectId(id) };

    // Delete task from MongoDB
    const result = await taskCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.send({ message: "Task deleted successfully", result });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("Taskly server is running..");
});

app.listen(port, () => {
  console.log(`Taskly is running on port ${port}`);
});
