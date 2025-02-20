"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, addTask, updateTask } from "../redux/features/taskSlices";
import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";

const api_key = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
const googleMapsApiKey = `${api_key}`;

export default function Home() {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  const [taskForm, setTaskForm] = useState({ id: null, title: "", description: "", dueDate: "", priority: "low", location: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.49725470978967, lng: 77.09220052408524 }); // Default to Lens Corp
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(isEditing ? updateTask(taskForm) : addTask(taskForm));
    setTaskForm({ id: null, title: "", description: "", dueDate: "", priority: "low", location: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = async (task) => {
    setTaskForm(task);
    setIsEditing(true);
    setShowForm(true);

    if (task.location) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(task.location)}&key=${googleMapsApiKey}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setMapCenter(location); // Update map center to task's location
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };


  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(taskToDelete));
    setShowDeletePopup(false);
    alert("Task deleted successfully!");
  };

  const handleLocationSearch = async () => {
    if (!taskForm.location) return;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(taskForm.location)}&key=${googleMapsApiKey}`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      setMapCenter(location);
    } else {
      alert("Location not found!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Task Manager</h1>

      <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Task</button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
          <input
            type="text"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="block w-full p-2 border rounded mb-2 text-black"
            required
          />
          <textarea
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="block w-full p-2 border rounded mb-2 text-black"
            required
          />
          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            className="block w-full p-2 border rounded mb-2 text-black"
            required
          />
          <select
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            className="block w-full p-2 border rounded mb-2 text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Location Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter location"
              value={taskForm.location}
              onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
              className="block w-full p-2 border rounded mb-2 text-black"
              required
            />
            <button type="button" onClick={handleLocationSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {/* Google Map */}
          <LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap mapContainerStyle={{ width: "100%", height: "300px" }} center={mapCenter} zoom={14}>
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScriptNext>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            {isEditing ? "Update Task" : "Add Task"}
          </button>
          <button onClick={() => setShowForm(false)} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      )}

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 mb-2">
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Due: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            <p>Location: {task.location}</p>
            <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
              Edit
            </button>
            <button onClick={() => handleDeleteClick(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Are you sure you want to delete this task?</p>
            <div className="mt-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Yes</button>
              <button onClick={() => setShowDeletePopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
