import React from 'react';
import { clsx } from 'clsx';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const priorityConfig = {
    LOW: {
      label: 'Low',
      classes: 'bg-success-100 text-success-800',
      dot: 'bg-success-500'
    },
    MEDIUM: {
      label: 'Medium', 
      classes: 'bg-warning-100 text-warning-800',
      dot: 'bg-warning-500'
    },
    HIGH: {
      label: 'High',
      classes: 'bg-error-100 text-error-800',
      dot: 'bg-error-500'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm'
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      config.classes,
      sizeClasses[size]
    )}>
      <svg className={clsx('-ml-0.5 mr-1.5 h-2 w-2', config.dot)} viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="3" />
      </svg>
      {config.label}
    </span>
  );
};

export default PriorityBadge;