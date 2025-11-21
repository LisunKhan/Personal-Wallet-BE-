import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vaultService from '../services/vaultService';
import { toast } from 'react-hot-toast';

// ==================== CATEGORIES ====================

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: vaultService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, categoryData }) => 
      vaultService.updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== VAULT ITEMS ====================

export const useVaultItems = (filters = {}) => {
  return useQuery({
    queryKey: ['vaultItems', filters],
    queryFn: () => vaultService.getVaultItems(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVaultItem = (itemId) => {
  return useQuery({
    queryKey: ['vaultItem', itemId],
    queryFn: () => vaultService.getVaultItem(itemId),
    enabled: !!itemId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateVaultItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.createVaultItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      queryClient.invalidateQueries({ queryKey: ['vaultStats'] });
      toast.success('Item created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateVaultItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, itemData }) => 
      vaultService.updateVaultItem(itemId, itemData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      queryClient.invalidateQueries({ queryKey: ['vaultItem', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['vaultStats'] });
      toast.success('Item updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteVaultItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.deleteVaultItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      queryClient.invalidateQueries({ queryKey: ['vaultStats'] });
      toast.success('Item deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.toggleFavorite,
    onSuccess: (data, itemId) => {
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      queryClient.invalidateQueries({ queryKey: ['vaultItem', itemId] });
      
      const message = data.is_favorite ? 'Added to favorites!' : 'Removed from favorites!';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== FILE OPERATIONS ====================

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, file, onProgress }) => 
      vaultService.uploadFile(itemId, file, onProgress),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vaultItem', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultItems'] });
      toast.success('File deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== PASSWORD TOOLS ====================

export const useGeneratePassword = () => {
  return useMutation({
    mutationFn: vaultService.generatePassword,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== STATISTICS ====================

export const useVaultStats = () => {
  return useQuery({
    queryKey: ['vaultStats'],
    queryFn: vaultService.getVaultStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== EMERGENCY CONTACTS ====================

export const useEmergencyContacts = () => {
  return useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: vaultService.getEmergencyContacts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.createEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      toast.success('Emergency contact added successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contactId, contactData }) => 
      vaultService.updateEmergencyContact(contactId, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      toast.success('Emergency contact updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.deleteEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      toast.success('Emergency contact deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== SECURITY & AUDIT ====================

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['auditLogs'],
    queryFn: vaultService.getAuditLogs,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePasswordPolicy = () => {
  return useQuery({
    queryKey: ['passwordPolicy'],
    queryFn: vaultService.getPasswordPolicy,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdatePasswordPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vaultService.updatePasswordPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwordPolicy'] });
      toast.success('Password policy updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== DATA EXPORT ====================

export const useExportData = () => {
  return useMutation({
    mutationFn: vaultService.exportData,
    onSuccess: () => {
      toast.success('Data exported successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};