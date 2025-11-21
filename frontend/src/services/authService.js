import api from './api';
import { hashMasterPassword } from '../utils/crypto';

class AuthService {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - Master password (will be hashed)
   * @returns {Promise} API response
   */
  async signup(email, password) {
    try {
      // Hash password client-side before sending
      const masterKeyHash = await hashMasterPassword(password, email);
      
      const response = await api.post('/accounts/signup/', {
        email,
        master_key_hash: masterKeyHash,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   * @param {Object|string} credentials - Either credentials object or email string
   * @param {string} password - Master password (optional if credentials is object)
   * @returns {Promise} API response with tokens
   */
  async login(credentials, password = null) {
    try {
      let loginData;
      
      if (typeof credentials === 'object') {
        // Already hashed credentials passed
        loginData = credentials;
      } else {
        // Email and password passed separately
        const masterKeyHash = await hashMasterPassword(password, credentials);
        loginData = {
          email: credentials,
          master_key_hash: masterKeyHash,
        };
      }
      
      const response = await api.post('/accounts/login/', loginData);

      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_email', loginData.email);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Get current user email
   * @returns {string|null}
   */
  getCurrentUserEmail() {
    return localStorage.getItem('user_email');
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

export default new AuthService();