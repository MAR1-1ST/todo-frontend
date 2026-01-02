import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TaskItem from '../molecules/TaskItem';
import TaskForm from '../molecules/TaskForm';
import Button from '../atoms/Button';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { useTasks } from '../../contexts/TaskContext';
import { useProjects } from '../../contexts/ProjectContext';
import { toast } from 'react-hot-toast';

const TaskList = ({ view = 'all', projectId }) => {
  const { 
    tasks, 
    loading, 
    fetchTasks, 
    createTask, 
    updateTask, 
    getTaskStats 
  } = useTasks();
  const { projects } = useProjects();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  useEffect(() => {
    const taskFilters = {
      view,
      projectId,
      ...filters
    };
    fetchTasks(taskFilters);
  }, [view, projectId, filters, fetchTasks]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowTaskForm(false);
    }
    return result;
  };

  const handleUpdateTask = async (taskData) => {
    const result = await updateTask(editingTask.id, taskData);
    if (result.success) {
      setEditingTask(null);
    }
    return result;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const stats = getTaskStats();
  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.isComplete !== (filters.status === 'complete')) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (filters.search && 
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const viewConfig = {
    today: { title: "Today's Tasks", icon: Calendar, color: "text-primary-600" },
    upcoming: { title: 'Upcoming Tasks', icon: Clock, color: "text-warning-600" },
    completed: { title: 'Completed Tasks', icon: CheckCircle, color: "text-success-600" },
    trash: { title: 'Trash', icon: AlertCircle, color: "text-error-600" },
    all: { title: 'All Tasks', icon: Filter, color: "text-gray-600" }
  };

  const currentView = viewConfig[view] || viewConfig.all;
  const Icon = currentView.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={clsx('w-6 h-6', currentView.color)} />
          <h1 className="text-2xl font-bold text-gray-900">{currentView.title}</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
        {!viewConfig[view] && (
          <Button 
            onClick={() => setShowTaskForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        )}
      </div>

      {/* Stats */}
      {view === 'all' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error-600" />
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overdue}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning-600" />
              <span className="text-sm text-gray-600">Due Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.dueToday}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="empty-state-title">No tasks found</h3>
            <p className="empty-state-description">
              {view === 'all' ? 'Create your first task to get started!' : 'No tasks match your current view.'}
            </p>
            {view === 'all' && (
              <Button 
                onClick={() => setShowTaskForm(true)}
                icon={<Plus className="w-4 h-4" />}
                className="mt-4"
              >
                Create Task
              </Button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
              viewType={view}
            />
          ))
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          projects={projects}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default TaskList;