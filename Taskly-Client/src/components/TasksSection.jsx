import { io } from "socket.io-client";

import { useState, useEffect, useCallback, useContext, use } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { FaCalendar } from "react-icons/fa";

const categories = ["To-Do", "In Progress", "Done"];
// const API_URL = "http://localhost:5000"; 
const API_URL = "https://taskly-enyu.onrender.com"; 


const TasksSection = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });
  const { user, loading } = useContext(AuthContext);
  // console.log(user);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["polling"],
    });
    socket.on("task-updated", fetchTasks);
    return () => socket.disconnect();
  }, []);

  // Fetch tasks from server
  const fetchTasks = useCallback(async () => {
    // if (!user?.email) {
    //   console.error("User email is not available");
    //   toast.warn("User email is not available");

    //   return;
    // }

    try {
      const response = await fetch(`${API_URL}/tasks?email=${user.email}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Expected array but got:", data);
        // toast.error("Unauthorized access");
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks:");
      setTasks([]);
    }
  }, [user]);
  useEffect(() => {
    if (!loading && user?.email) {
      fetchTasks(); // Fetch tasks only if user is logged in and not loading
    }
  }, [loading, user, fetchTasks]);

  useEffect(() => {
    if (user?.email) {
      // Fetch tasks only if the user email is available
      const socket = io(API_URL, { transports: ["polling"] });
      socket.on("task-updated", fetchTasks);
      return () => socket.disconnect();
    }
  }, [user, fetchTasks]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle Drag & Drop
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If the task is dropped outside or no destination is found
    if (!destination) return;

    // If the task hasn't moved, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a new array of tasks
    const newTasks = Array.from(tasks);

    // Find the task that was dragged
    const draggedTask = newTasks.find((task) => task._id === draggableId);

    if (!draggedTask) {
      console.error("Dragged task not found");
      return;
    }

    // Remove the task from its original position
    newTasks.splice(newTasks.indexOf(draggedTask), 1);

    // Update the task's category if it has changed
    if (source.droppableId !== destination.droppableId) {
      draggedTask.category = destination.droppableId;
    }

    // Insert the task at its new position
    newTasks.splice(destination.index, 0, draggedTask);

    // Update the local state
    setTasks(newTasks);

    // Update the backend
    try {
      await fetch(`${API_URL}/tasks/reorder/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: draggedTask.category,
          index: destination.index,
        }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert the local state change if the server update fails
      fetchTasks();
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add New Task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask, // Keep existing task data
          email: user.email, // Attach user email
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to add task:", data.message);

        return;
      }

      if (response.ok) {
        fetchTasks();
        setNewTask({ title: "", description: "", category: "To-Do" });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Enable Edit Mode
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Save Updated Task
  const handleSaveTask = async (taskId, updatedTask) => {
    // eslint-disable-next-line no-unused-vars
    const { _id, ...taskToUpdate } = updatedTask;

    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToUpdate),
      });

      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Format date to a readable format
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  // console.log(tasks);
  return (
    <div className="container mx-auto p-5">
      {/* Task Input Form */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        />
        <select
          name="category"
          value={newTask.category}
          onChange={handleInputChange}
          className="p-2 border rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Task
        </button>
      </div>

      {/* Drag & Drop Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 border rounded-md shadow-md bg-gray-100 min-h-[300px] max-h-[calc(100vh-204px)] overflow-auto"
                >
                  <h2 className="text-lg font-semibold mb-2">{category}</h2>
                  {tasks
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-2 shadow-md rounded-md "
                          >
                            {/* Task Details */}
                            {editingTask?._id === task._id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <input
                                  type="text"
                                  value={editingTask.title}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      title: e.target.value,
                                    })
                                  }
                                  className="border p-1 rounded-md"
                                />
                                <input
                                  type="text"
                                  value={editingTask.description}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      description: e.target.value,
                                    })
                                  }
                                  className="border p-1 rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <h3 className="font-semibold">{task.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {task.description}
                                </p>
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-4">
                              <p className="text- text-gray-400 flex items-center gap-2">
                              <FaCalendar/>  {formatDate(task.createdAt)}
                              </p>
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {editingTask?._id === task._id ? (
                                  <FiCheck
                                    className="cursor-pointer text-green-500"
                                    onClick={() =>
                                      handleSaveTask(task._id, editingTask)
                                    }
                                    size={24}
                                  />
                                ) : (
                                  <FiEdit
                                    className="cursor-pointer text-blue-500"
                                    onClick={() => handleEditTask(task)}
                                    size={24}
                                  />
                                )}
                                <FiTrash2
                                  className="cursor-pointer text-red-500"
                                  onClick={() => handleDeleteTask(task._id)}
                                  size={24}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TasksSection;
