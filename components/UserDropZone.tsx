import React from 'react';
import { useDrop } from 'react-dnd';
import { User, Task } from '../types';
import TaskItem from './TaskItem';

interface UserDropZoneProps {
  user: User;
  tasks: Task[];
  onDropTask: (taskId: string, userId: number) => void;
}

const UserDropZone: React.FC<UserDropZoneProps> = ({ user, tasks, onDropTask }) => {
  // Setup Drop hook
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK', // Must match the type in TaskItem
    drop: (item: { id: string }) => {
      onDropTask(item.id, user.id); // Trigger reassignment logic
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Style calculations for visual feedback during drag
  let borderColor = 'border-slate-200';
  let bgColor = 'bg-slate-50';

  if (isOver && canDrop) {
    borderColor = 'border-green-500';
    bgColor = 'bg-green-50';
  } else if (canDrop) {
    borderColor = 'border-blue-300';
    bgColor = 'bg-blue-50/50';
  }

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`flex h-full min-h-[200px] flex-col rounded-xl border-2 p-4 transition-colors ${borderColor} ${bgColor}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold">
             {user.username.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-bold text-slate-700">{user.username}</h3>
        </div>
        <span className="text-xs text-slate-400">{tasks.length} tasks</span>
      </div>

      <div className="flex-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-sm italic text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserDropZone;