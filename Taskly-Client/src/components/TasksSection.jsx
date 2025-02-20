import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const initialTasks = [
  {
    id: uuidv4(),
    title: "Setup Project",
    description: "Initialize repo",
    category: "To-Do",
  },
  {
    id: uuidv4(),
    title: "Fix Bugs",
    description: "Resolve UI issues",
    category: "To-Do",
  },
  {
    id: uuidv4(),
    title: "Write Docs",
    description: "Document API",
    category: "In Progress",
  },
  {
    id: uuidv4(),
    title: "Deploy App",
    description: "Push to server",
    category: "Done",
  },
];

const categories = ["To-Do", "In Progress", "Done"];

const TasksSection = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });

  // Handle Drag & Drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.splice(source.index, 1)[0];
    movedTask.category = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add New Task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const taskToAdd = { id: uuidv4(), ...newTask };
    setTasks([...tasks, taskToAdd]);
    setNewTask({ title: "", description: "", category: "To-Do" });
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
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-2 shadow-md rounded-md"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
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
