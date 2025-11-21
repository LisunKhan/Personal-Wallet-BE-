import api from './api';

class CategoryService {
  /**
   * Get all categories for the authenticated user
   * @returns {Promise} List of categories
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
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description
   * @param {string} categoryData.color - Category color (hex)
   * @returns {Promise} Created category
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
   * Update an existing category
   * @param {number} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Updated category
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
   * @param {number} categoryId - Category ID
   * @returns {Promise} Success response
   */
  async deleteCategory(categoryId) {
    try {
      const response = await api.delete(`/vault/categories/${categoryId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific category by ID
   * @param {number} categoryId - Category ID
   * @returns {Promise} Category data
   */
  async getCategory(categoryId) {
    try {
      const response = await api.get(`/vault/categories/${categoryId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 
                     error.response.data?.error || 
                     error.response.data?.message ||
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

export default new CategoryService();