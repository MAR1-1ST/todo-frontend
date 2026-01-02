import { CheckCircle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  CheckSquare, 
  Folder, 
  Clock, 
  AlertCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Button from '../components/atoms/Button';
import { useTasks } from '../contexts/TaskContext';
import { useProjects } from '../contexts/ProjectContext';
import TaskItem from '../components/molecules/TaskItem';

const Dashboard = () => {
  const { tasks, getTaskStats, fetchTasks } = useTasks();
  const { projects, fetchProjects } = useProjects();
  
  const stats = getTaskStats();
  
  // Get recent tasks (last 5 incomplete tasks)
  const recentTasks = tasks
    .filter(task => !task.isComplete && !task.isDeleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get overdue tasks
  const overdueTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.isComplete || task.isDeleted) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    })
    .slice(0, 5);

  // Get today's tasks
  const todayTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.isComplete || task.isDeleted) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return dueDate >= today && dueDate < tomorrow;
    })
    .slice(0, 5);

  React.useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <Link to="/tasks">
          <Button icon={<Plus className="w-4 h-4" />}>
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-500">Completion rate:</span>
              <span className="ml-1 font-medium text-success-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-500">High priority:</span>
              <span className="ml-1 font-medium text-error-600">
                {stats.highPriority}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.dueToday}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-500">Overdue:</span>
              <span className="ml-1 font-medium text-error-600">
                {stats.overdue}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all projects →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Due Today</h2>
            <Link to="/tasks/today" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No tasks due today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map(task => (
                <TaskItem key={task.id} task={task} onEdit={() => {}} />
              ))}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overdue</h2>
            <Link to="/tasks/upcoming" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          {overdueTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No overdue tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map(task => (
                <TaskItem key={task.id} task={task} onEdit={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-500">
            View all tasks
          </Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent tasks</p>
            <Link to="/tasks" className="text-primary-600 hover:text-primary-500 mt-2 inline-block">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;