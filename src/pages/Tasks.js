import React from 'react';
import { useParams } from 'react-router-dom';
import TaskList from '../components/organisms/TaskList';

const Tasks = () => {
  const { view, projectId } = useParams(); // Get both potential params [cite: 127]
  
  return (
    <div className="p-4">
      {/* Pass both to TaskList so it knows which filter to use [cite: 147] */}
      <TaskList view={view} projectId={projectId} />
    </div>
  );
};

export default Tasks;