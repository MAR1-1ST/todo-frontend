import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProject = useCallback(async (projectData) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects`, projectData);
      const newProject = response.data.project;
      
      setProjects(prev => [newProject, ...prev]);
      toast.success('Project created successfully');
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const updateProject = useCallback(async (projectId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/projects/${projectId}`, updates);
      const updatedProject = response.data.project;
      
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ));
      
      toast.success('Project updated successfully');
      return { success: true, project: updatedProject };
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    try {
      await axios.delete(`${API_URL}/api/projects/${projectId}`);
      
      setProjects(prev => prev.filter(project => project.id !== projectId));
      toast.success('Project deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      return { success: false };
    }
  }, []);

  const getProjectById = useCallback((projectId) => {
    return projects.find(project => project.id === projectId);
  }, [projects]);

  const getProjectStats = useCallback(() => {
    return projects.map(project => ({
      ...project,
      taskCount: project._count?.tasks || 0
    }));
  }, [projects]);

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectStats
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};