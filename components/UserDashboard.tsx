import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask } from '../utils/storage';
import { Task } from '../types';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      const allTasks = getTasks();
      const assigned = allTasks.filter((t) => t.assigneeId === user.id);
      setMyTasks(assigned);
    }
  }, [user]);

  const handleToggleStatus = (task: Task) => {
    const newStatus: 'Pending' | 'Completed' = task.status === 'Pending' ? 'Completed' : 'Pending';
    const updatedTask = { ...task, status: newStatus };
    
    // Update LocalStorage
    updateTask(updatedTask);
    
    // Update Local State
    setMyTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updatedTask : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.username}</h1>
          <p className="text-slate-500">Here are your assigned tasks.</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myTasks.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-slate-300 p-12 text-center text-slate-400">
            No tasks assigned to you yet.
          </div>
        ) : (
          myTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col justify-between rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md ${
                task.status === 'Completed'
                  ? 'border-green-200 bg-green-50'
                  : 'border-white bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className={`font-bold ${task.status === 'Completed' ? 'text-green-800' : 'text-slate-800'}`}>
                    {task.title}
                  </h3>
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{task.description}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${
                    task.status === 'Pending'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {task.status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;