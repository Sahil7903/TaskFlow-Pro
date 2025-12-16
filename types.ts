export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: number | null; // null means unassigned
  status: 'Pending' | 'Completed';
}

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};
