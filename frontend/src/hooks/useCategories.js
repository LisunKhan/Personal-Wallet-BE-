import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vaultService from '../services/vaultService';
import { toast } from 'react-hot-toast';

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => vaultService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => vaultService.createCategory(categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      throw error;
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, categoryData }) => 
      vaultService.updateCategory(categoryId, categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
      throw error;
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => vaultService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
      throw error;
    },
  });
};