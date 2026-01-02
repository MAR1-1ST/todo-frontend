import React from 'react';
import { useParams } from 'react-router-dom';
import TaskList from '../components/organisms/TaskList';

const Tasks = () => {
  const { view } = useParams();
  
  return (
    <div>
      <TaskList view={view} />
    </div>
  );
};

export default Tasks;