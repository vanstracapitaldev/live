/**
 * Bank API Client
 * Handles all API communication with the Vanstra Capital backend
 * Manages JWT token storage and request headers
 */

class BankAPIClient {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set Authorization token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get token from storage
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Build headers with Authorization token
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    return headers;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.auth !== false),
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired or invalid
        this.setToken(null);
        window.location.href = '/login.html';
        throw new Error('Authentication expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ========================
  // Auth Endpoints
  // ========================

  async signup(fullName, email, password, phone = '') {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, phone }),
      auth: false,
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    this.setToken(null);
  }

  // ========================
  // User Profile Endpoints
  // ========================

  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(fullName, phone, avatar) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, phone, avatar }),
    });
  }

  async getUserTransactions() {
    return this.request('/users/transactions');
  }

  async createTransaction(type, amount, description, recipientId = null) {
    return this.request('/users/transaction', {
      method: 'POST',
      body: JSON.stringify({ type, amount, description, recipientId }),
    });
  }

  // ========================
  // Admin Endpoints
  // ========================

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getUserById(userId) {
    return this.request(`/admin/users/${userId}`);
  }

  async updateUserBalance(userId, balance) {
    return this.request(`/admin/users/${userId}/balance`, {
      method: 'PUT',
      body: JSON.stringify({ balance }),
    });
  }

  async updateUserStatus(userId, status) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // Helper Methods
  // ========================

  /**
   * Check if current user is admin
   */
  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      return user.user.role === 'admin';
    } catch {
      return false;
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'EUR', locale = 'de-DE') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (e) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
  }

  /**
   * Format date/time
   */
  formatDate(date, locale = 'de-DE') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  /**
   * Get friendly error message
   */
  getErrorMessage(error) {
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection.';
    }
    if (error.message.includes('401')) {
      return 'Session expired. Please login again.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission for this action.';
    }
    if (error.message.includes('404')) {
      return 'Resource not found.';
    }
    return error.message || 'An error occurred. Please try again.';
  }
}

// Create global instance
const bankAPI = new BankAPIClient();
