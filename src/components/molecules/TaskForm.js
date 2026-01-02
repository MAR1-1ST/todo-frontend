import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import Select from '../atoms/Select';
import Button from '../atoms/Button';

const schema = yup.object({
  title: yup.string().required('Title is required').trim(),
  description: yup.string().optional(),
  dueDate: yup.date().optional().nullable(),
  priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  projectId: yup.string().optional().nullable()
});

const TaskForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  projects = [], 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      projectId: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : ''
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      dueDate: data.dueDate || null,
      projectId: data.projectId || null
    };
    onSubmit(formattedData);
  };

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority' },
    { value: 'MEDIUM', label: 'Medium Priority' },
    { value: 'HIGH', label: 'High Priority' }
  ];

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
              label="Title"
              placeholder="What needs to be done?"
              error={errors.title?.message}
              required
              {...register('title')}
              autoFocus
            />

            <TextArea
              label="Description"
              placeholder="Add more details (optional)"
              error={errors.description?.message}
              {...register('description')}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />

              <Select
                label="Priority"
                options={priorityOptions}
                error={errors.priority?.message}
                {...register('priority')}
              />
            </div>

            {projects.length > 0 && (
              <Select
                label="Project"
                options={projectOptions}
                placeholder="No project"
                error={errors.projectId?.message}
                {...register('projectId')}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                className="flex-1"
              >
                {initialData ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;