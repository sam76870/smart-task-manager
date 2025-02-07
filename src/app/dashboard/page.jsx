"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../redux/features/taskSlices';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      
      {/* Dashboard Statistics */}
      <div className="mb-4 p-4 border rounded bg-gray-100">
        <p className='text-zinc-950'>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(task => task.completed).length}</p>
        <p>Pending: {tasks.filter(task => !task.completed).length}</p>
      </div>

      {/* Task List */}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 mb-2">
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Due: {task.dueDate}</p>
            <p>Priority: {task.priorityLevel}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
