import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi"; // Import icons

const categories = ["To-Do", "In Progress", "Done"];

const TasksSection = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited

  // Fetch tasks from server
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/task");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Expected array but got:", data);
        setTasks([]); // Fallback to empty array if data is not an array
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Fallback to empty array in case of error
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Drag & Drop
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.splice(source.index, 1)[0];
    movedTask.category = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);

    // Update in backend & fetch latest data
    try {
      await fetch(`http://localhost:5000/task/${movedTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: movedTask.category }),
      });
      fetchTasks(); // Reload tasks from server
    } catch (error) {
      console.error("Error updating task:", error);
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
      const response = await fetch("http://localhost:5000/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

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
      await fetch(`http://localhost:5000/task/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task immediately
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
    try {
      await fetch(`http://localhost:5000/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      setEditingTask(null);
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Format date to a readable format
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

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
                  className="p-4 border rounded-md shadow-md bg-gray-100 min-h-[300px]"
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
                            className="bg-white p-3 mb-2 shadow-md rounded-md flex justify-between items-center"
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
                                <p className="text-xs text-gray-400">
                                  {formatDate(task.createdAt)}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {editingTask?._id === task._id ? (
                                <FiCheck
                                  className="cursor-pointer text-green-500"
                                  onClick={() =>
                                    handleSaveTask(task._id, editingTask)
                                  }
                                  size={18}
                                />
                              ) : (
                                <FiEdit
                                  className="cursor-pointer text-blue-500"
                                  onClick={() => handleEditTask(task)}
                                  size={18}
                                />
                              )}
                              <FiTrash2
                                className="cursor-pointer text-red-500"
                                onClick={() => handleDeleteTask(task._id)}
                                size={18}
                              />
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
