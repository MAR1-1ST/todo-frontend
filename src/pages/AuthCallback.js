import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        handleAuthCallback(token, user);
        toast.success('Welcome to TaskFlow!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
    }
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">Completing sign in...</h2>
        <p className="mt-2 text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;