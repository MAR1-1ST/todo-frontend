import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

// --- fetchTasks Debugged ---
const fetchTasks = useCallback(async (filters = {}) => {
  if (!user) return;
  setLoading(true);
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      const val = filters[key];
      // Only append if it's a real value (not "null", not empty)
      if (val && val !== 'null' && val !== '' && val !== 'undefined') {
        params.append(key, val);
      }
    });
    const response = await axios.get(`${API_URL}/api/tasks?${params.toString()}`);
    setTasks(response.data.tasks); // Successfully updates the list [cite: 156]
    setError(null);
  } catch (error) {
    console.error('Fetch Error:', error);
    setError('Failed to fetch tasks');
  } finally {
    setLoading(false);
  }
}, [user]);

// --- createTask Debugged ---
const createTask = useCallback(async (taskData) => {
  try {
    const cleanedData = { ...taskData };
    // If projectId is not a real ID, remove it so the backend doesn't see it
    if (!cleanedData.projectId || cleanedData.projectId === 'null') {
      delete cleanedData.projectId;
    }

    const response = await axios.post(`${API_URL}/api/tasks`, cleanedData);
    const newTask = response.data.task;
    
    // Update state immediately so the new task appears without a re-fetch [cite: 156]
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task created successfully');
    return { success: true, task: newTask };
  } catch (error) {
    const msg = error.response?.data?.errors?.[0]?.msg || 'Failed to create task';
    toast.error(msg);
    return { success: false };
  }
}, []);
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, updates);
      const updatedTask = response.data.task;
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const toggleTaskComplete = useCallback(async (taskId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/tasks/${taskId}/toggle`);
      const updatedTask = response.data.task;
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to toggle task');
      return { success: false };
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`);
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task moved to trash');
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return { success: false };
    }
  }, []);

  const restoreTask = useCallback(async (taskId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/tasks/${taskId}/restore`);
      const restoredTask = response.data.task;
      
      setTasks(prev => [...prev, restoredTask]);
      toast.success('Task restored successfully');
      return { success: true };
    } catch (error) {
      console.error('Error restoring task:', error);
      toast.error('Failed to restore task');
      return { success: false };
    }
  }, []);

  const permanentDeleteTask = useCallback(async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}/permanent`);
      toast.success('Task permanently deleted');
      return { success: true };
    } catch (error) {
      console.error('Error permanently deleting task:', error);
      toast.error('Failed to permanently delete task');
      return { success: false };
    }
  }, []);

  const getTaskStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      total: tasks.length,
      completed: tasks.filter(task => task.isComplete).length,
      pending: tasks.filter(task => !task.isComplete && !task.isDeleted).length,
      overdue: tasks.filter(task => 
        !task.isComplete && 
        task.dueDate && 
        new Date(task.dueDate) < today
      ).length,
      dueToday: tasks.filter(task => 
        !task.isComplete && 
        task.dueDate && 
        new Date(task.dueDate) >= today && 
        new Date(task.dueDate) < tomorrow
      ).length,
      highPriority: tasks.filter(task => 
        !task.isComplete && 
        task.priority === 'HIGH'
      ).length,
      inTrash: tasks.filter(task => task.isDeleted).length
    };
  }, [tasks]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    getTaskStats
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};