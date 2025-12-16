import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, getUsers, addTask, updateTask } from '../utils/storage';
import { Task, User } from '../types';
import TaskItem from './TaskItem';
import UserDropZone from './UserDropZone';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>(''); // empty string for unassigned

  // Load data on mount
  useEffect(() => {
    setTasks(getTasks());
    // Filter out the admin from the draggable targets usually, but keeping them for visibility
    const allUsers = getUsers();
    setUsers(allUsers.filter(u => u.role !== 'admin')); 
  }, []);

  // Handle Create Task
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(), // Native browser UUID generation
      title: newTaskTitle,
      description: newTaskDesc,
      assigneeId: selectedAssignee ? parseInt(selectedAssignee) : null,
      status: 'Pending',
    };

    const updatedTasks = addTask(newTask);
    setTasks(updatedTasks);
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setSelectedAssignee('');
  };

  // Drag & Drop Logic: Callback when a task is dropped on a User Card
  const handleTaskDrop = (taskId: string, userId: number) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (taskToUpdate && taskToUpdate.assigneeId !== userId) {
      const updatedTask = { ...taskToUpdate, assigneeId: userId };
      const newTaskList = updateTask(updatedTask);
      setTasks(newTaskList);
    }
  };

  const unassignedTasks = tasks.filter((t) => t.assigneeId === null);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Manage tasks and reassign by dragging.</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
        >
          Logout
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column: Create Task & Unassigned */}
        <div className="space-y-6 lg:col-span-1">
          {/* Create Form */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">Create Task</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full rounded border p-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
              <textarea
                placeholder="Description"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full rounded border p-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={2}
              />
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full rounded border p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Unassigned Tasks Pool */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">
              Unassigned Pool
            </h2>
            <div className="space-y-2">
              {unassignedTasks.length === 0 ? (
                <p className="text-sm italic text-slate-400">No unassigned tasks.</p>
              ) : (
                unassignedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: User Drop Zones */}
        <div className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <UserDropZone
                key={user.id}
                user={user}
                tasks={tasks.filter((t) => t.assigneeId === user.id)}
                onDropTask={handleTaskDrop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
