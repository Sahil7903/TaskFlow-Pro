import { Task, User } from '../types';

const KEYS = {
  USERS: 'taskflow_users',
  TASKS: 'taskflow_tasks',
};

const DEFAULT_USERS: User[] = [
  { id: 1, username: 'user1', role: 'user' },
  { id: 2, username: 'user2', role: 'user' },
  { id: 3, username: 'user3', role: 'user' },
  { id: 999, username: 'admin', role: 'admin' }, // Hidden from assignment usually, but exists for auth
];

export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(KEYS.TASKS)) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(KEYS.USERS);
  return stored ? JSON.parse(stored) : DEFAULT_USERS;
};

export const getTasks = (): Task[] => {
  const stored = localStorage.getItem(KEYS.TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const addTask = (task: Task) => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
};

export const updateTask = (updatedTask: Task) => {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
  return tasks;
};
