import React from 'react';
import { useDrag } from 'react-dnd';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  showAssignee?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, showAssignee = false }) => {
  // Setup Drag hook
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK', // The type string identifying what is being dragged
    item: { id: task.id }, // The data payload passed to the drop zone
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`mb-3 cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-slate-800">{task.title}</h4>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            task.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{task.description}</p>
      
      {showAssignee && task.assigneeId && (
        <div className="mt-2 text-xs text-slate-400">
          Assigned to ID: {task.assigneeId}
        </div>
      )}
    </div>
  );
};

export default TaskItem;