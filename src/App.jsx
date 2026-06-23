import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔍 NEW: search state
  const [search, setSearch] = useState("");

  // GET TASKS
  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔍 SEARCH TASKS
  const searchTasks = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchTasks();
      return;
    }

    const res = await axios.get(`${API}/search?q=${value}`);
    setTasks(res.data);
  };

  // CREATE TASK
  const addTask = async (e) => {
    e.preventDefault();

    await axios.post(API, {
      title,
      description,
      dueDate,
    });

    resetForm();
    fetchTasks();
  };

  // RESET FORM
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditId(null);
  };

  // COMPLETE TASK
  const completeTask = async (id) => {
    await axios.put(`${API}/${id}`, {
      status: "Completed",
    });

    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  // START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
  };

  // UPDATE TASK
  const updateTask = async (e) => {
    e.preventDefault();

    await axios.put(`${API}/${editId}`, {
      title,
      description,
      dueDate,
      status: "Pending",
    });

    resetForm();
    fetchTasks();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Task Management
      </h1>

      {/* 🔍 SEARCH INPUT */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search task by title..."
          value={search}
          onChange={(e) => searchTasks(e.target.value)}
          className="border p-2 w-80"
        />
      </div>

      {/* FORM */}
      <form
        className="flex justify-center gap-2"
        onSubmit={editId ? updateTask : addTask}
      >
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2"
        />

        <button className="bg-blue-600 text-white px-4 rounded">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <table className="border border-gray-300 w-full mt-6">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="border p-2">{task.title}</td>
              <td className="border p-2">{task.description}</td>
              <td className="border p-2">{task.status}</td>
              <td className="border p-2">{task.dueDate}</td>

              <td className="border p-2">
                {task.status === "Pending" && (
                  <button
                    onClick={() => completeTask(task._id)}
                    className="bg-green-500 text-white px-2 mr-2"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => startEdit(task)}
                  className="bg-yellow-500 text-white px-2 mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;