import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, Edit2, Trash2, CheckSquare, MoreVertical } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { useTasks } from '../contexts/TaskContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Projects = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectColor, setProjectColor] = useState('#3B82F6');

  const colorOptions = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const getProjectTaskCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId && !task.isDeleted).length;
  };

  const getProjectCompletedCount = (projectId) => {
    return tasks.filter(task => 
      task.projectId === projectId && 
      task.isComplete && 
      !task.isDeleted
    ).length;
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const result = await createProject({
      name: projectName,
      color: projectColor
    });

    if (result.success) {
      setShowCreateForm(false);
      setProjectName('');
      setProjectColor('#3B82F6');
    }
  };

  const handleUpdateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const result = await updateProject(editingProject.id, {
      name: projectName,
      color: projectColor
    });

    if (result.success) {
      setEditingProject(null);
      setProjectName('');
      setProjectColor('#3B82F6');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectColor(project.color);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? Tasks will be moved to no project.')) {
      await deleteProject(projectId);
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setProjectName('');
    setProjectColor('#3B82F6');
  };

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
          <Folder className="w-6 h-6 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Organize your tasks into projects</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const taskCount = getProjectTaskCount(project.id);
          const completedCount = getProjectCompletedCount(project.id);
          const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

          return (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 text-gray-400 hover:text-error-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasks</span>
                    <span className="font-medium text-gray-900">
                      {completedCount}/{taskCount}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{completionRate}% complete</span>
                    <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <Link
                  to={`/tasks?projectId=${project.id}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  View Tasks
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first project to start organizing your tasks.</p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Project
          </Button>
        </div>
      )}

      {/* Create/Edit Project Modal */}
      {(showCreateForm || editingProject) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>

              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setProjectColor(color)}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          ${projectColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'}
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="flex-1"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;