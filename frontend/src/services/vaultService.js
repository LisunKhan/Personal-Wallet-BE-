import api from './api';

class VaultService {
  // ==================== CATEGORIES ====================
  
  /**
   * Get all categories for the user
   * @returns {Promise<Array>} List of categories
   */
  async getCategories() {
    try {
      const response = await api.get('/vault/categories/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await api.post('/vault/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a category
   * @param {string} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await api.put(`/vault/categories/${categoryId}/`, categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a category
   * @param {string} categoryId - Category ID
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId) {
    try {
      await api.delete(`/vault/categories/${categoryId}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== VAULT ITEMS ====================

  /**
   * Get all vault items with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of vault items
   */
  async getVaultItems(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.favorite !== undefined) params.append('favorite', filters.favorite);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/vault/items/?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific vault item by ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Vault item with encrypted data
   */
  async getVaultItem(itemId) {
    try {
      const response = await api.get(`/vault/items/${itemId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new vault item
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} Created item
   */
  async createVaultItem(itemData) {
    try {
      const response = await api.post('/vault/items/', itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a vault item
   * @param {string} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise<Object>} Updated item
   */
  async updateVaultItem(itemId, itemData) {
    try {
      const response = await api.put(`/vault/items/${itemId}/`, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a vault item
   * @param {string} itemId - Item ID
   * @returns {Promise<void>}
   */
  async deleteVaultItem(itemId) {
    try {
      await api.delete(`/vault/items/${itemId}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle favorite status of a vault item
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Updated favorite status
   */
  async toggleFavorite(itemId) {
    try {
      const response = await api.post(`/vault/items/${itemId}/toggle-favorite/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== FILE OPERATIONS ====================

  /**
   * Upload a file for a vault item
   * @param {string} itemId - Item ID
   * @param {File} file - File to upload
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(itemId, file, onProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/vault/items/${itemId}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download a file
   * @param {string} fileId - File ID
   * @param {string} filename - Original filename
   * @returns {Promise<void>}
   */
  async downloadFile(fileId, filename) {
    try {
      const response = await api.get(`/vault/files/${fileId}/download/`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a file
   * @param {string} fileId - File ID
   * @returns {Promise<void>}
   */
  async deleteFile(fileId) {
    try {
      await api.delete(`/vault/files/${fileId}/delete/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== PASSWORD TOOLS ====================

  /**
   * Generate a secure password
   * @param {Object} options - Password generation options
   * @returns {Promise<Object>} Generated password
   */
  async generatePassword(options = {}) {
    try {
      const defaultOptions = {
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
      };

      const response = await api.post('/vault/password-generator/', {
        ...defaultOptions,
        ...options,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== STATISTICS ====================

  /**
   * Get vault statistics
   * @returns {Promise<Object>} Vault statistics
   */
  async getVaultStats() {
    try {
      const response = await api.get('/vault/stats/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== EMERGENCY CONTACTS ====================

  /**
   * Get emergency contacts
   * @returns {Promise<Array>} List of emergency contacts
   */
  async getEmergencyContacts() {
    try {
      const response = await api.get('/vault/emergency-contacts/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create emergency contact
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} Created contact
   */
  async createEmergencyContact(contactData) {
    try {
      const response = await api.post('/vault/emergency-contacts/', contactData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update emergency contact
   * @param {string} contactId - Contact ID
   * @param {Object} contactData - Updated contact data
   * @returns {Promise<Object>} Updated contact
   */
  async updateEmergencyContact(contactId, contactData) {
    try {
      const response = await api.put(`/vault/emergency-contacts/${contactId}/`, contactData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete emergency contact
   * @param {string} contactId - Contact ID
   * @returns {Promise<void>}
   */
  async deleteEmergencyContact(contactId) {
    try {
      await api.delete(`/vault/emergency-contacts/${contactId}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== SECURITY & AUDIT ====================

  /**
   * Get audit logs
   * @returns {Promise<Array>} List of audit logs
   */
  async getAuditLogs() {
    try {
      const response = await api.get('/vault/audit-logs/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get password policy
   * @returns {Promise<Object>} Password policy settings
   */
  async getPasswordPolicy() {
    try {
      const response = await api.get('/vault/password-policy/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update password policy
   * @param {Object} policyData - Policy settings
   * @returns {Promise<Object>} Updated policy
   */
  async updatePasswordPolicy(policyData) {
    try {
      const response = await api.put('/vault/password-policy/', policyData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== DATA EXPORT ====================

  /**
   * Export vault data
   * @param {Object} exportOptions - Export options
   * @returns {Promise<void>}
   */
  async exportData(exportOptions) {
    try {
      const response = await api.post('/vault/export/', exportOptions, {
        responseType: 'blob',
      });

      // Determine filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'vault_export.json';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== ERROR HANDLING ====================

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 
                     error.response.data?.detail || 
                     'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new VaultService();