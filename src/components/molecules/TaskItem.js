import React, { useState } from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { clsx } from 'clsx';
import { Check, Trash2, Edit3, RotateCcw, Calendar, AlertCircle } from 'lucide-react';
import PriorityBadge from '../atoms/PriorityBadge';
import Button from '../atoms/Button';
import { useTasks } from '../../contexts/TaskContext';
import { toast } from 'react-hot-toast';

const TaskItem = ({ task, onEdit, viewType }) => {
  const { toggleTaskComplete, deleteTask, restoreTask, permanentDeleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    await toggleTaskComplete(task.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (task.isDeleted) {
      if (window.confirm('Are you sure you want to permanently delete this task?')) {
        await permanentDeleteTask(task.id);
      }
    } else {
      await deleteTask(task.id);
    }
    setIsDeleting(false);
  };

  const handleRestore = async () => {
    await restoreTask(task.id);
  };

  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    if (isPast(dueDate) && !isToday(dueDate)) {
      return { label: 'Overdue', className: 'text-error-600', icon: AlertCircle };
    } else if (isToday(dueDate)) {
      return { label: 'Today', className: 'text-warning-600', icon: Calendar };
    } else if (isTomorrow(dueDate)) {
      return { label: 'Tomorrow', className: 'text-primary-600', icon: Calendar };
    } else {
      return { 
        label: format(dueDate, 'MMM d'), 
        className: 'text-gray-500', 
        icon: Calendar 
      };
    }
  };

  const dueDateInfo = getDueDateLabel();

  return (
    <div className={clsx(
      'card card-hover p-4 transition-all duration-200',
      task.isComplete && 'opacity-75',
      task.isDeleted && 'border-dashed'
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={task.isDeleted}
          className={clsx(
            'mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors',
            task.isComplete 
              ? 'bg-success-500 border-success-500 text-white' 
              : 'border-gray-300 hover:border-primary-500',
            task.isDeleted && 'cursor-not-allowed opacity-50'
          )}
        >
          {task.isComplete && <Check className="w-3 h-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={clsx(
              'text-sm font-medium',
              task.isComplete ? 'line-through text-gray-500' : 'text-gray-900'
            )}>
              {task.title}
            </h3>
            
            {!task.isDeleted && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={task.priority} size="sm" />
              </div>
            )}
          </div>

          {task.description && (
            <p className={clsx(
              'text-sm mt-1',
              task.isComplete ? 'text-gray-400' : 'text-gray-600'
            )}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2">
            {dueDateInfo && (
              <div className={clsx('flex items-center gap-1 text-xs', dueDateInfo.className)}>
                <dueDateInfo.icon className="w-3 h-3" />
                <span>{dueDateInfo.label}</span>
              </div>
            )}

            {task.project && !task.isDeleted && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: task.project.color }}
                />
                <span>{task.project.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!task.isDeleted ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-1"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-error-600 hover:text-error-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestore}
                className="p-1 text-success-600 hover:text-success-700"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-error-600 hover:text-error-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;